#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

function dkcl(){
        CONTAINER_IDS=$(docker ps -aq)
	echo
        if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" = " " ]; then
                echo "========== No containers available for deletion =========="
        else
                docker rm -f $CONTAINER_IDS
        fi
	echo
}

function dkrm(){
        DOCKER_IMAGE_IDS=$(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')
	echo
        if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
		echo "========== No images available for deletion ==========="
        else
                docker rmi -f $DOCKER_IMAGE_IDS
        fi
	echo
}

function restartNetwork() {
	echo

        #teardown the network and clean the containers and intermediate images
	cd artifacts
	docker-compose down
	dkcl
	dkrm

	#Cleanup the stores
	rm -rf ./fabric-client-kv-org*

	#Start the network
	docker-compose up -d
	cd -
	echo
}

function installNodeModules() {
	echo
	if [ -d node_modules ]; then
		echo "============== node modules installed already ============="
	else
		echo "============== Installing node modules ============="
		npm install
	fi
	echo
}

function restartHalalchain(){
   CURRENT_DIR=$PWD
   echo "Starting delete credential fabric-client"
   rm -rf fabric-client-kv-*
   echo "Successfully delete credential fabric-client"

   echo "Starting delete crypto fabric-client"
   rm -rf /tmp/fabric-client-kv*
   echo "Successfully delete crypto fabric-client"

   cd network
   if [ -f docker-compose-e2e.yaml ]; then
       echo "Starting clean old halalchain network"
       ./halal.sh -m down -f docker-compose-e2e.yaml
       echo "Successfully clean old halalchain network"
   fi

   echo "Starting generate halalchain network"
   ./halal.sh -m generate
   echo "Successfully generate halalchain network"

   echo "Starting bootstrap halalchain network"
   ./halal.sh -m up -f docker-compose-e2e.yaml
   echo "Successfully bootstrap halalchain network"
   cd "$CURRENT_DIR"
}

function replaceClientPrivKey(){
  # sed on MacOSX does not support -i flag with a null extension. We will use
  # 't' for our back-up's extension and depete it at the end of the function
  ARCH=`uname -s | grep Darwin`
  if [ "$ARCH" == "Darwin" ]; then
    OPTS="-it"
  else
    OPTS="-i"
  fi

  echo "Starting replace private key in network-config"
  CURRENT_DIR=$PWD
  cp config/network-config-template.yaml config/network_config-test.yml
  cd network/crypto-config/peerOrganizations/hlc.com/users/Admin@hlc.com/msp/keystore/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/ADMIN1_PRIVATE_KEY/${PRIV_KEY}/g" config/network_config-test.yml

  cd network/crypto-config/peerOrganizations/creater.com/users/Admin@creater.com/msp/keystore/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/ADMIN2_PRIVATE_KEY/${PRIV_KEY}/g" config/network_config-test.yml

  cd network/crypto-config/peerOrganizations/transfer.com/users/Admin@transfer.com/msp/keystore/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/ADMIN3_PRIVATE_KEY/${PRIV_KEY}/g" config/network_config-test.yml

  cd network/crypto-config/peerOrganizations/seller.com/users/Admin@seller.com/msp/keystore/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/ADMIN4_PRIVATE_KEY/${PRIV_KEY}/g" config/network_config-test.yml
  echo "Successfully replace private key in network-config"

  # If MacOSX, remove the temporary backup of the docker-compose file
  if [ "$ARCH" == "Darwin" ]; then
    rm config/network_config-test.ymlt
  fi
}
restartHalalchain
replaceClientPrivKey
#restartNetwork
sleep 30
installNodeModules

PORT=4000 node halal
