#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

function stopHalalNetwork(){
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
   cd "$CURRENT_DIR"
}

stopHalalNetwork