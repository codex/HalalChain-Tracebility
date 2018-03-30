#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

#
# This script does the following:
# 1) registers orderer and peer identities with intermediate fabric-ca-servers
# 2) Builds the channel artifacts (e.g. genesis block, etc)
#

function main {
   log "Beginning building channel artifacts ..."
   registerIdentities
   getCACerts
   makeConfigTxYaml
   generateChannelArtifacts
   log "Finished building channel artifacts"
   touch /$SETUP_SUCCESS_FILE
}

# Enroll the CA administrator
function enrollCAAdmin {
   waitPort "$CA_NAME to start" 90 $CA_LOGFILE $CA_HOST 7054
   log "Enrolling with $CA_NAME as bootstrap identity ..."
   export FABRIC_CA_CLIENT_HOME=$HOME/cas/$CA_NAME
   export FABRIC_CA_CLIENT_TLS_CERTFILES=$CA_CHAINFILE
   fabric-ca-client enroll -d -u https://$CA_ADMIN_USER_PASS@$CA_HOST:7054
}

function registerIdentities {
   log "Registering identities ..."
   registerOrdererIdentities
   registerPeerIdentities
}

# Register any identities associated with the orderer
function registerOrdererIdentities {
   for i in "${!ORDERER_ORGS[@]}"; do
      initOrgVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]}
      enrollCAAdmin
      fabric-ca-client affiliation add ${ORDERER_ORGS[i]}
      fabric-ca-client affiliation add ${ORDERER_ORGS[i]}.department1
      local COUNT=1
      while [[ "$COUNT" -le $NUM_ORDERERS ]]; do
         initOrdererVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]} $COUNT
         log "Registering $ORDERER_NAME with $CA_NAME"
         fabric-ca-client register -d --id.name $ORDERER_NAME --id.secret $ORDERER_PASS --id.affiliation ${ORDERER_ORGS[i]}.department1
         COUNT=$((COUNT+1))
      done
      log "Registering admin identity with $CA_NAME"
      # The admin identity has the "admin" attribute which is added to ECert by default
      fabric-ca-client register -d --id.name $ADMIN_NAME --id.secret $ADMIN_PASS --id.attrs "admin=true:ecert" --id.affiliation ${ORDERER_ORGS[i]}.department1
   done
}

# Register any identities associated with a peer
function registerPeerIdentities {
   for i in "${!PEER_ORGS[@]}"; do
      initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
      enrollCAAdmin
      fabric-ca-client affiliation add ${PEER_ORGS[i]}
      fabric-ca-client affiliation add ${PEER_ORGS[i]}.department1
      local COUNT=1
      while [[ "$COUNT" -le $NUM_PEERS ]]; do
         initPeerVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]} $COUNT
         log "Registering $PEER_NAME with $CA_NAME"
         fabric-ca-client register -d --id.name $PEER_NAME --id.secret $PEER_PASS --id.affiliation ${PEER_ORGS[i]}.department1
         COUNT=$((COUNT+1))
      done
      log "Registering admin identity with $CA_NAME"
      # The admin identity has the "admin" attribute which is added to ECert by default
      fabric-ca-client register -d --id.name $ADMIN_NAME --id.secret $ADMIN_PASS --id.attrs "hf.Registrar.Roles=client,hf.Registrar.Attributes=*,hf.Revoker=true,hf.GenCRL=true,admin=true:ecert,abac.init=true:ecert" --id.affiliation ${PEER_ORGS[i]}.department1
      log "Registering user identity with $CA_NAME"
      fabric-ca-client register -d --id.name $USER_NAME --id.secret $USER_PASS --id.affiliation ${PEER_ORGS[i]}.department1
   done
}

function getCACerts {
   log "Getting CA certificates ..."
   for i in "${!PEER_ORGS[@]}"; do
      initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
      log "Getting CA certs for organization ${PEER_ORGS[i]} and storing in $ORG_MSP_DIR"
      export FABRIC_CA_CLIENT_TLS_CERTFILES=$CA_CHAINFILE
      fabric-ca-client getcacert -d -u https://$CA_HOST:7054 -M $ORG_MSP_DIR
      finishMSPSetup $ORG_MSP_DIR
      # If ADMINCERTS is true, we need to enroll the admin now to populate the admincerts directory
      if [ $ADMINCERTS ]; then
         switchToAdminIdentity
      fi
   done

   for i in "${!ORDERER_ORGS[@]}"; do
      initOrgVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]}
      log "Getting CA certs for organization ${ORDERER_ORGS[i]} and storing in $ORG_MSP_DIR"
      export FABRIC_CA_CLIENT_TLS_CERTFILES=$CA_CHAINFILE
      fabric-ca-client getcacert -d -u https://$CA_HOST:7054 -M $ORG_MSP_DIR
      finishMSPSetup $ORG_MSP_DIR
      # If ADMINCERTS is true, we need to enroll the admin now to populate the admincerts directory
      if [ $ADMINCERTS ]; then
         switchToAdminIdentity
      fi
   done
}

# printOrg
function printOrg {
   echo "
  - &$ORG_NAME

    Name: $ORG_NAME

    # ID to load the MSP definition as
    ID: $ORG_MSP_ID

    # MSPDir is the filesystem path which contains the MSP configuration
    MSPDir: $ORG_MSP_DIR"
}

# printOrdererOrg <ORG>
function printOrdererOrg {
   initOrgVars $1 $2 $3 $4 $5
   printOrg
}

# printPeerOrg <ORG> <COUNT>
function printPeerOrg {
   initPeerVars $1 $2 $3 $4 $5 $6
   printOrg
   echo "
    AnchorPeers:
       # AnchorPeers defines the location of peers which can be used
       # for cross org gossip communication.  Note, this value is only
       # encoded in the genesis block in the Application section context
       - Host: $PEER_HOST
         Port: 7051"
}

function makeConfigTxYaml {
   {
   echo "################################################################################
#
#   Profile
#
#   - Different configuration profiles may be encoded here to be specified
#   as parameters to the configtxgen tool
#
################################################################################
Profiles:

  OrgsOrdererGenesis:
    Orderer:
      # Orderer Type: The orderer implementation to start
      # Available types are \"solo\" and \"kafka\"
      OrdererType: kafka
      Addresses:"

   for i in "${!ORDERER_ORGS[@]}"; do
      local COUNT=1
      while [[ "$COUNT" -le $NUM_ORDERERS ]]; do
         initOrdererVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]} $COUNT
         echo "        - $ORDERER_HOST:7050"
         COUNT=$((COUNT+1))
      done
   done

   echo "
      # Batch Timeout: The amount of time to wait before creating a batch
      BatchTimeout: 2s

      # Batch Size: Controls the number of messages batched into a block
      BatchSize:

        # Max Message Count: The maximum number of messages to permit in a batch
        MaxMessageCount: 10

        # Absolute Max Bytes: The absolute maximum number of bytes allowed for
        # the serialized messages in a batch.
        AbsoluteMaxBytes: 99 MB

        # Preferred Max Bytes: The preferred maximum number of bytes allowed for
        # the serialized messages in a batch. A message larger than the preferred
        # max bytes will result in a batch larger than preferred max bytes.
        PreferredMaxBytes: 512 KB

      Kafka:
        # Brokers: A list of Kafka brokers to which the orderer connects
        # NOTE: Use IP:port notation
        Brokers:
          - kafka0.kafka:9092
          - kafka1.kafka:9092
          - kafka2.kafka:9092
          - kafka3.kafka:9092

      # Organizations is the list of orgs which are defined as participants on
      # the orderer side of the network
      Organizations:"

   for i in "${!ORDERER_ORGS[@]}"; do
      initOrgVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]}
      echo "        - *${ORG_NAME}"
   done

   echo "
    Consortiums:

      SampleConsortium:

        Organizations:"

   for i in "${!PEER_ORGS[@]}"; do
      initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
      echo "          - *${ORG_NAME}"
   done

   echo "
  OrgsChannel:
    Consortium: SampleConsortium
    Application:
      <<: *ApplicationDefaults
      Organizations:"

   for i in "${!PEER_ORGS[@]}"; do
      initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
      echo "        - *${ORG_NAME}"
   done

   echo "
################################################################################
#
#   Section: Organizations
#
#   - This section defines the different organizational identities which will
#   be referenced later in the configuration.
#
################################################################################
Organizations:"

   for i in "${!ORDERER_ORGS[@]}"; do
      printOrdererOrg ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]}
   done

   for i in "${!PEER_ORGS[@]}"; do
      printPeerOrg ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]} 1
   done

   echo "
################################################################################
#
#   SECTION: Application
#
#   This section defines the values to encode into a config transaction or
#   genesis block for application related parameters
#
################################################################################
Application: &ApplicationDefaults

    # Organizations is the list of orgs which are defined as participants on
    # the application side of the network
    Organizations:
"

   } > /etc/hyperledger/fabric/configtx.yaml
   # Copy it to the data directory to make debugging easier
   cp /etc/hyperledger/fabric/configtx.yaml /$DATA
}

function generateChannelArtifacts() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    fatal "configtxgen tool not found. exiting"
  fi

  log "Generating orderer genesis block at $GENESIS_BLOCK_FILE"
  # Note: For some unknown reason (at least for now) the block file can't be
  # named orderer.genesis.block or the orderer will fail to launch!
  configtxgen -profile OrgsOrdererGenesis -outputBlock $GENESIS_BLOCK_FILE
  if [ "$?" -ne 0 ]; then
    fatal "Failed to generate orderer genesis block"
  fi

  log "Generating channel configuration transaction at $CHANNEL_TX_FILE"
  configtxgen -profile OrgsChannel -outputCreateChannelTx $CHANNEL_TX_FILE -channelID $CHANNEL_NAME
  if [ "$?" -ne 0 ]; then
    fatal "Failed to generate channel configuration transaction"
  fi

  for i in "${!PEER_ORGS[@]}"; do
     initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
     log "Generating anchor peer update transaction for $ORG at $ANCHOR_TX_FILE"
     configtxgen -profile OrgsChannel -outputAnchorPeersUpdate $ANCHOR_TX_FILE \
                 -channelID $CHANNEL_NAME -asOrg ${PEER_ORGS[i]}
     if [ "$?" -ne 0 ]; then
        fatal "Failed to generate anchor peer update for $ORG"
     fi
  done
}

set -e

SDIR=$(dirname "$0")
source $SDIR/env.sh

main
