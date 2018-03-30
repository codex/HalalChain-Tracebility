#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

#
# This script builds the docker compose file needed to run this sample.
#

SDIR=$(dirname "$0")
source $SDIR/scripts/env.sh

function main {
   {
   writeHeader
   writeRootFabricCA
   if $USE_INTERMEDIATE_CA; then
      writeIntermediateFabricCA
   fi
   writeKafka
   writeSetupFabric
   writeStartFabric
#   writeRunFabric
   writeConfig
   } > $SDIR/docker-compose.yml
   log "Created docker-compose.yml"
}

# Write services for the root fabric CA servers
function writeRootFabricCA {
#   for i in "${!ORDERER_ORGS[@]}"; do
      initOrgVars ${ORDERER_ORGS[0]} ${ORDERER_ORG_DOMAINS[0]} ${CA_ORDERER_ORGS[0]} ${CA_ORDERER_ORG_DOMAINS[0]} ${ORDERER_MSP_IDS[0]}
      writeRootCA
#   done
}

# Write services for the intermediate fabric CA servers
function writeIntermediateFabricCA {
   PORT=7054
   for i in "${!PEER_ORGS[@]}"; do
      initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
      writeIntermediateCA $PORT
      PORT=$((PORT+1000))
   done
}

# Write a service to setup the fabric artifacts (e.g. genesis block, etc)
function writeSetupFabric {
   echo "  setup:
    container_name: setup
    image: inklabsfoundation/halal-fabric-ca-tools:0.1.0
    command: /bin/bash -c '/scripts/setup-fabric.sh 2>&1 | tee /$SETUP_LOGFILE; sleep 99999'
    volumes:
      - ./scripts:/scripts
      - ./$DATA:/$DATA
    networks:
      - $NETWORK
    depends_on:"
   for i in "${!PEER_ORGS[@]}"; do
      initOrgVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]}
      echo "      - $CA_HOST"
   done
   echo ""
}

# Write services for fabric orderer and peer containers
function writeStartFabric {
   ORDER_PORT=7050
   for i in "${!ORDERER_ORGS[@]}"; do
      COUNT=1
      while [[ "$COUNT" -le $NUM_ORDERERS ]]; do
         initOrdererVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]} $COUNT
         writeOrderer $ORDER_PORT
         COUNT=$((COUNT+1))
         ORDER_PORT=$((ORDER_PORT+1000))
      done
   done
   PEER_PORT=7051
   EVENT_PORT=7053
   for i in "${!PEER_ORGS[@]}"; do
      COUNT=1
      while [[ "$COUNT" -le $NUM_PEERS ]]; do
         initPeerVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]} $COUNT
         writePeer $PEER_PORT $EVENT_PORT
         COUNT=$((COUNT+1))
         PEER_PORT=$((PEER_PORT+1000))
         EVENT_PORT=$((EVENT_PORT+1000))
      done
   done
}

# Write a service to run a fabric test including creating a channel,
# installing chaincode, invoking and querying
function writeRunFabric {
   # Set samples directory relative to this script
#   SAMPLES_DIR=$(dirname $(cd ${SDIR} && pwd))
   SAMPLES_DIR=${GOPATH}/src/github.com/hyperledger/fabric-samples
   # Set fabric directory relative to GOPATH
   FABRIC_DIR=${GOPATH}/src/github.com/hyperledger/fabric
   echo "  run:
    container_name: run
    image: inklabsfoundation/halal-fabric-ca-tools:0.1.0
    environment:
      - GOPATH=/opt/gopath
    command: /bin/bash -c 'sleep 3;/scripts/run-fabric.sh 2>&1 | tee /$RUN_LOGFILE; sleep 99999'
    volumes:
      - ./scripts:/scripts
      - ./$DATA:/$DATA
      - ${SAMPLES_DIR}:/opt/gopath/src/github.com/hyperledger/fabric-samples
      - ${FABRIC_DIR}:/opt/gopath/src/github.com/hyperledger/fabric
    networks:
      - $NETWORK
    depends_on:"
   for i in "${!ORDERER_ORGS[@]}"; do
      COUNT=1
      while [[ "$COUNT" -le $NUM_ORDERERS ]]; do
         initOrdererVars ${ORDERER_ORGS[i]} ${ORDERER_ORG_DOMAINS[i]} ${CA_ORDERER_ORGS[i]} ${CA_ORDERER_ORG_DOMAINS[i]} ${ORDERER_MSP_IDS[i]} $COUNT
         echo "      - $ORDERER_HOST"
         COUNT=$((COUNT+1))
      done
   done
   for i in "${!PEER_ORGS[@]}"; do
      COUNT=1
      while [[ "$COUNT" -le $NUM_PEERS ]]; do
         initPeerVars ${PEER_ORGS[i]} ${PEER_ORG_DOMAINS[i]} ${CA_PEER_ORGS[i]} ${CA_PEER_ORG_DOMAINS[i]} ${PEER_MSP_IDS[i]} $COUNT
         echo "      - $PEER_HOST"
         COUNT=$((COUNT+1))
      done
   done
}

function writeRootCA {
   echo "  $ROOT_CA_HOST:
    container_name: $ROOT_CA_HOST
    image: inklabsfoundation/halal-fabric-ca:0.1.0
    command: /bin/bash -c '/scripts/start-root-ca.sh 2>&1 | tee /$ROOT_CA_LOGFILE'
    environment:
      - FABRIC_CA_SERVER_HOME=/etc/hyperledger/fabric-ca
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_SERVER_CSR_CN=$ROOT_CA_HOST
      - FABRIC_CA_SERVER_CSR_HOSTS=$ROOT_CA_HOST
      - FABRIC_CA_SERVER_DEBUG=true
      - BOOTSTRAP_USER_PASS=$ROOT_CA_ADMIN_USER_PASS
      - TARGET_CERTFILE=$ROOT_CA_CERTFILE
    volumes:
      - ./scripts:/scripts
      - ./$DATA:/$DATA
    networks:
      - $NETWORK
"
}

function writeIntermediateCA {
   echo "  $INT_CA_HOST:
    container_name: $INT_CA_HOST
    image: inklabsfoundation/halal-fabric-ca:0.1.0
    command: /bin/bash -c '/scripts/start-intermediate-ca.sh 2>&1 | tee /$INT_CA_LOGFILE'
    environment:
      - FABRIC_CA_SERVER_HOME=/etc/hyperledger/fabric-ca
      - FABRIC_CA_SERVER_CA_NAME=$INT_CA_NAME
      - FABRIC_CA_SERVER_INTERMEDIATE_TLS_CERTFILES=$ROOT_CA_CERTFILE
      - FABRIC_CA_SERVER_CSR_HOSTS=$INT_CA_HOST
      - FABRIC_CA_SERVER_TLS_ENABLED=true
      - FABRIC_CA_SERVER_DEBUG=true
      - BOOTSTRAP_USER_PASS=$INT_CA_ADMIN_USER_PASS
      - PARENT_URL=https://$ROOT_CA_ADMIN_USER_PASS@$ROOT_CA_HOST:7054
      - TARGET_CHAINFILE=$INT_CA_CHAINFILE
      - ORG_NAME=$ORG_NAME
      - ORG_DOMAIN=$ORG_DOMAIN
      - CA_ORG_NAME=$CA_ORG_NAME
      - CA_ORG_DOMAIN=$CA_ORG_DOMAIN
      - MSP_ID=$MSP_ID
    volumes:
      - ./scripts:/scripts
      - ./$DATA:/$DATA
    ports:
      - $1:7054
    networks:
      - $NETWORK
    depends_on:
      - $ROOT_CA_HOST
"
}

function writeOrderer {
   MYHOME=/etc/hyperledger/orderer
   echo "  $ORDERER_HOST:
    container_name: $ORDERER_HOST
    image: inklabsfoundation/halal-fabric-ca-orderer:0.1.0
    environment:
      - FABRIC_CA_CLIENT_HOME=$MYHOME
      - FABRIC_CA_CLIENT_TLS_CERTFILES=$CA_CHAINFILE
      - ENROLLMENT_URL=https://$ORDERER_NAME_PASS@$CA_HOST:7054
      - ORDERER_HOME=$MYHOME
      - ORDERER_HOST=$ORDERER_HOST
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=$GENESIS_BLOCK_FILE
      - ORDERER_GENERAL_LOCALMSPID=$ORG_MSP_ID
      - ORDERER_GENERAL_LOCALMSPDIR=$MYHOME/msp
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=$MYHOME/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=$MYHOME/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[$CA_CHAINFILE]
      - ORDERER_GENERAL_TLS_CLIENTAUTHREQUIRED=false
      - ORDERER_GENERAL_TLS_CLIENTROOTCAS=[$CA_CHAINFILE]
      - ORDERER_GENERAL_LOGLEVEL=debug
      - ORDERER_DEBUG_BROADCASTTRACEDIR=$LOGDIR
      - ORDERER_KAFKA_VERBOSE=true
      - ORDERER_KAFKA_RETRY_SHORTTOTAL=30s
      - ORDERER_KAFKA_RETRY_SHORTINTERVAL=1s
      - ORG_NAME=$ORG_NAME
      - ORG_DOMAIN=$ORG_DOMAIN
      - CA_ORG_NAME=$CA_ORG_NAME
      - CA_ORG_DOMAIN=$CA_ORG_DOMAIN
      - MSP_ID=$MSP_ID
      - ORG_ADMIN_CERT=$ORG_ADMIN_CERT
    command: /bin/bash -c '/scripts/start-orderer.sh 2>&1 | tee /$ORDERER_LOGFILE'
    volumes:
      - ./scripts:/scripts
      - ./$DATA:/$DATA
    ports:
      - $1:7050
    networks:
      - $NETWORK
    depends_on:
      - setup
      - kafka0.kafka
      - kafka1.kafka
      - kafka2.kafka
      - kafka3.kafka
"
}

function writePeer {
   MYHOME=/opt/gopath/src/github.com/hyperledger/fabric/peer
   echo "  $PEER_HOST:
    container_name: $PEER_HOST
    image: inklabsfoundation/halal-fabric-ca-peer:0.1.0
    environment:
      - FABRIC_CA_CLIENT_HOME=$MYHOME
      - FABRIC_CA_CLIENT_TLS_CERTFILES=$CA_CHAINFILE
      - ENROLLMENT_URL=https://$PEER_NAME_PASS@$CA_HOST:7054
      - PEER_NAME=$PEER_NAME
      - PEER_HOME=$MYHOME
      - PEER_HOST=$PEER_HOST
      - PEER_NAME_PASS=$PEER_NAME_PASS
      - CORE_PEER_ID=$PEER_HOST
      - CORE_PEER_ADDRESS=$PEER_HOST:7051
      - CORE_PEER_LOCALMSPID=$ORG_MSP_ID
      - CORE_PEER_MSPCONFIGPATH=$MYHOME/msp
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=net_${NETWORK}
      - CORE_LOGGING_LEVEL=DEBUG
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=$MYHOME/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=$MYHOME/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=$CA_CHAINFILE
      - CORE_PEER_TLS_CLIENTAUTHREQUIRED=false
      - CORE_PEER_TLS_CLIENTROOTCAS_FILES=$CA_CHAINFILE
      - CORE_PEER_TLS_CLIENTCERT_FILE=/$DATA/tls/$PEER_NAME-client.crt
      - CORE_PEER_TLS_CLIENTKEY_FILE=/$DATA/tls/$PEER_NAME-client.key
      - CORE_PEER_GOSSIP_USELEADERELECTION=true
      - CORE_PEER_GOSSIP_ORGLEADER=false
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=$PEER_HOST:7051
      - CORE_PEER_GOSSIP_SKIPHANDSHAKE=true
      - ORG_NAME=$ORG_NAME
      - ORG_DOMAIN=$ORG_DOMAIN
      - CA_ORG_NAME=$CA_ORG_NAME
      - CA_ORG_DOMAIN=$CA_ORG_DOMAIN
      - MSP_ID=$MSP_ID
      - ORG_ADMIN_CERT=$ORG_ADMIN_CERT"
   if [ $NUM -gt 1 ]; then
      echo "      - CORE_PEER_GOSSIP_BOOTSTRAP=peer1.${ORG_DOMAIN}:7051"
   fi
   echo "    working_dir: $MYHOME
    command: /bin/bash -c '/scripts/start-peer.sh 2>&1 | tee /$PEER_LOGFILE'
    volumes:
      - ./scripts:/scripts
      - ./$DATA:/$DATA
      - /var/run:/host/var/run
    ports:
      - $1:7051
      - $2:7053
    networks:
      - $NETWORK
    depends_on:
      - setup
"
}

function writeKafka {
   echo "  zookeeper0.kafka:
    container_name: zookeeper0.kafka
    image: inklabsfoundation/inkchain-zookeeper:x86_64-0.11.4
    environment:
      - ZOO_MY_ID=1
      - ZOO_SERVERS=server.1=0.0.0.0:2888:3888 server.2=zookeeper1.kafka:2888:3888 server.3=zookeeper2.kafka:2888:3888
      - ZOO_TICK_TIME=2000
      - ZOO_INIT_LIMIT=10
      - ZOO_SYNC_LIMIT=2
    expose:
      - 2888
      - 3888
      - 2181
    networks:
      - $NETWORK

  zookeeper1.kafka:
    container_name: zookeeper1.kafka
    image: inklabsfoundation/inkchain-zookeeper:x86_64-0.11.4
    environment:
      - ZOO_MY_ID=2
      - ZOO_SERVERS=server.1=zookeeper0.kafka:2888:3888 server.2=0.0.0.0:2888:3888 server.3=zookeeper2.kafka:2888:3888
      - ZOO_TICK_TIME=2000
      - ZOO_INIT_LIMIT=10
      - ZOO_SYNC_LIMIT=2
    expose:
      - 2888
      - 3888
      - 2181
    networks:
      - $NETWORK

  zookeeper2.kafka:
    container_name: zookeeper2.kafka
    image: inklabsfoundation/inkchain-zookeeper:x86_64-0.11.4
    environment:
      - ZOO_MY_ID=3
      - ZOO_SERVERS=server.1=zookeeper0.kafka:2888:3888 server.2=zookeeper1.kafka:2888:3888 server.3=0.0.0.0:2888:3888
      - ZOO_TICK_TIME=2000
      - ZOO_INIT_LIMIT=10
      - ZOO_SYNC_LIMIT=2
    expose:
      - 2888
      - 3888
      - 2181
    networks:
      - $NETWORK

  kafka0.kafka:
    container_name: kafka0.kafka
    image: inklabsfoundation/inkchain-kafka:x86_64-0.11.0
    environment:
      - KAFKA_MESSAGE_MAX_BYTES=103809024
      - KAFKA_REPLICA_FETCH_MAX_BYTES=103809024
      - KAFKA_UNCLEAN_LEADER_ELECTION_ENABLE=false
      - KAFKA_BROKER_ID=0
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0.kafka:2181,zookeeper1.kafka:2181,zookeeper2.kafka:2181
      - KAFKA_ADVERTISED_HOST_NAME=kafka0.kafka
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=10000
    expose:
      - 9092
      - 9093
    depends_on:
      - zookeeper0.kafka
      - zookeeper1.kafka
      - zookeeper2.kafka
    networks:
      - $NETWORK

  kafka1.kafka:
    container_name: kafka1.kafka
    image: inklabsfoundation/inkchain-kafka:x86_64-0.11.0
    environment:
      - KAFKA_MESSAGE_MAX_BYTES=103809024
      - KAFKA_REPLICA_FETCH_MAX_BYTES=103809024
      - KAFKA_UNCLEAN_LEADER_ELECTION_ENABLE=false
      - KAFKA_BROKER_ID=1
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0.kafka:2181,zookeeper1.kafka:2181,zookeeper2.kafka:2181
      - KAFKA_ADVERTISED_HOST_NAME=kafka1.kafka
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=10000
    expose:
      - 9092
      - 9093
    depends_on:
      - zookeeper0.kafka
      - zookeeper1.kafka
      - zookeeper2.kafka
    networks:
      - $NETWORK

  kafka2.kafka:
    container_name: kafka2.kafka
    image: inklabsfoundation/inkchain-kafka:x86_64-0.11.0
    environment:
      - KAFKA_MESSAGE_MAX_BYTES=103809024
      - KAFKA_REPLICA_FETCH_MAX_BYTES=103809024
      - KAFKA_UNCLEAN_LEADER_ELECTION_ENABLE=false
      - KAFKA_BROKER_ID=2
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0.kafka:2181,zookeeper1.kafka:2181,zookeeper2.kafka:2181
      - KAFKA_ADVERTISED_HOST_NAME=kafka2.kafka
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=10000
    expose:
      - 9092
      - 9093
    depends_on:
      - zookeeper0.kafka
      - zookeeper1.kafka
      - zookeeper2.kafka
    networks:
      - $NETWORK

  kafka3.kafka:
    container_name: kafka3.kafka
    image: inklabsfoundation/inkchain-kafka:x86_64-0.11.0
    environment:
      - KAFKA_MESSAGE_MAX_BYTES=103809024
      - KAFKA_REPLICA_FETCH_MAX_BYTES=103809024
      - KAFKA_UNCLEAN_LEADER_ELECTION_ENABLE=false
      - KAFKA_BROKER_ID=3
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0.kafka:2181,zookeeper1.kafka:2181,zookeeper2.kafka:2181
      - KAFKA_ADVERTISED_HOST_NAME=kafka3.kafka
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=10000
    expose:
      - 9092
      - 9093
    depends_on:
      - zookeeper0.kafka
      - zookeeper1.kafka
      - zookeeper2.kafka
    networks:
      - $NETWORK
"
}

function writeConfig {
   echo "  config:
    container_name: config
    image: inklabsfoundation/halal-config-server-template:0.1.0
    ports:
      - 8888:8888
    volumes:
        - ./../config:/config
    networks:
      - $NETWORK
"
}

function writeHeader {
   echo "version: '2'

networks:
  $NETWORK:

services:
"
}

main
