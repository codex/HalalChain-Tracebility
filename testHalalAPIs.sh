#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

jq --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
	echo "Please Install 'jq' https://stedolan.github.io/jq/ to execute this script"
	echo
	exit 1
fi

starttime=$(date +%s)

# Print the usage message
function printHelp () {
  echo "Usage: "
  echo "  ./testHalalAPIs.sh -l golang|node"
  echo "    -l <language> - chaincode language (defaults to \"golang\")"
}
# Language defaults to "golang"
LANGUAGE="golang"

# Parse commandline args
while getopts "h?l:" opt; do
  case "$opt" in
    h|\?)
      printHelp
      exit 0
    ;;
    l)  LANGUAGE=$OPTARG
    ;;
  esac
done

##set chaincode path
function setChaincodePath(){
	LANGUAGE=`echo "$LANGUAGE" | tr '[:upper:]' '[:lower:]'`
	case "$LANGUAGE" in
		"golang")
		CC_SRC_PATH="github.com/example_cc/go"
		;;
		"node")
		CC_SRC_PATH="$PWD/chaincode/src/github.com/example_cc/node"
		;;
		*) printf "\n ------ Language $LANGUAGE is not supported yet ------\n"$
		exit 1
	esac
}

setChaincodePath

echo "POST request Enroll on Org1  ..."
echo
ORG1_TOKEN=$(curl -s -X POST \
  http://localhost:4000/login \
  -H "content-type: application/json" \
  -d '{
	"username":"grapebaba1",
	"password":"grapebaba1",
	"orgName": "hlc"
}')
echo $ORG1_TOKEN
ORG1_TOKEN=$(echo $ORG1_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG1 token is $ORG1_TOKEN"
echo
echo "POST request Enroll on Org2 ..."
echo
ORG2_TOKEN=$(curl -s -X POST \
  http://localhost:4000/login \
  -H "content-type: application/json" \
  -d '{
	"username":"grapebaba2",
	"password":"grapebaba2",
	"orgName": "creater"
}')
echo $ORG2_TOKEN
ORG2_TOKEN=$(echo $ORG2_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG2 token is $ORG2_TOKEN"
echo
echo "POST request Enroll on Org3  ..."
echo
ORG3_TOKEN=$(curl -s -X POST \
  http://localhost:4000/login \
  -H "content-type: application/json" \
  -d '{
	"username":"grapebaba3",
	"password":"grapebaba3",
	"orgName": "transfer"
}')
echo $ORG3_TOKEN
ORG3_TOKEN=$(echo $ORG3_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG3 token is $ORG3_TOKEN"
echo
echo "POST request Enroll on Org4  ..."
echo
ORG4_TOKEN=$(curl -s -X POST \
  http://localhost:4000/login \
  -H "content-type: application/json" \
  -d '{
	"username":"grapebaba4",
	"password":"grapebaba4",
	"orgName": "seller"
}')
echo $ORG4_TOKEN
ORG4_TOKEN=$(echo $ORG4_TOKEN | jq ".token" | sed "s/\"//g")
echo
echo "ORG4 token is $ORG4_TOKEN"
echo
echo
echo "POST request Create channel  ..."
echo
curl -s -X POST \
  http://localhost:4000/channels \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"channelName":"mychannel",
	"channelConfigPath":"../network/channel-artifacts/channel.tx",
	"orderer": "orderer0.hlcorderer.com"
}'
echo
echo
sleep 5
echo "POST request Join channel on Org1"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.hlc.com","peer1.hlc.com"]
}'
echo
echo

echo "POST request Join channel on Org2"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer $ORG2_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.creater.com","peer1.creater.com"]
}'
echo
echo

echo "POST request Join channel on Org3"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer $ORG3_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.transfer.com","peer1.transfer.com"]
}'
echo
echo

echo "POST request Join channel on Org4"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer $ORG4_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["peer0.seller.com","peer1.seller.com"]
}'
echo
echo

echo "POST Install chaincode on Org1"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.hlc.com\",\"peer1.hlc.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v1.0\"
}"
echo
echo

echo "POST Install chaincode on Org2"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG2_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.creater.com\",\"peer1.creater.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v1.0\"
}"
echo
echo

echo "POST Install chaincode on Org3"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG3_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.transfer.com\",\"peer1.transfer.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v1.0\"
}"
echo
echo


echo "POST Install chaincode on Org4"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG4_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.seller.com\",\"peer1.seller.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v1.0\"
}"
echo
echo

echo "POST instantiate chaincode on peer1 of Org1"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/chaincodes \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"chaincodeName\":\"mycc\",
	\"chaincodeVersion\":\"v1.0\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"args\":[\"a\",\"100\",\"b\",\"200\"],
	\"peer\":\"peer0.hlc.com\"
}"
echo
echo

echo "POST invoke chaincode on peers of Org1 and Org2"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"fcn":"move",
	"args":["a","b","10"],
	"peers": ["peer0.hlc.com","peer0.creater.com"]
}'
echo
echo

echo "GET query chaincode on peer1 of Org1"
echo
curl -s -X POST \
  "http://localhost:4000/query/channels/mychannel/chaincodes/mycc" \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"fcn":"query",
	"args":["a"],
	"peers": ["peer0.hlc.com","peer0.creater.com"]
}'
echo
echo

echo "POST Install chaincode v2.0 on Org1"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.hlc.com\",\"peer1.hlc.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v2.0\"
}"
echo
echo

echo "POST Install chaincode v2.0 on Org2"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG2_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.creater.com\",\"peer1.creater.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v2.0\"
}"
echo
echo

echo "POST Install chaincode v2.0 on Org3"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG3_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.transfer.com\",\"peer1.transfer.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v2.0\"
}"
echo
echo


echo "POST Install chaincode v2.0 on Org4"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer $ORG4_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"peers\": [\"peer0.seller.com\",\"peer1.seller.com\"],
	\"chaincodeName\":\"mycc\",
	\"chaincodePath\":\"$CC_SRC_PATH\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"chaincodeVersion\":\"v2.0\"
}"
echo
echo

echo "PUT upgrade chaincode on peer1 of Org1"
echo
curl -s -X PUT \
  http://localhost:4000/channels/mychannel/chaincodes \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d "{
	\"chaincodeName\":\"mycc\",
	\"chaincodeVersion\":\"v2.0\",
	\"chaincodeType\": \"$LANGUAGE\",
	\"args\":[\"a\",\"150\",\"b\",\"200\"],
	\"peer\":\"peer0.hlc.com\"
}"
echo
echo

echo "POST invoke chaincode on peers of Org1 and Org2"
echo
TRX=$(curl -s -X POST \
  http://localhost:4000/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"fcn":"move",
	"args":["a","b","10"],
	"peers": ["peer0.hlc.com","peer0.creater.com"]
}')
echo
echo
echo $TRX
TRX_ID=$(echo $TRX | jq ".txId" | sed "s/\"//g")

echo "POST query Transaction by TransactionID on peer1 of Org1"
echo
curl -s -X POST \
  "http://localhost:4000/query/channels/mychannel/transactions/$TRX_ID" \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peer": "peer0.hlc.com"
}'
echo
echo

echo "POST query Block by blockNumber"
echo
curl -s -X POST \
  "http://localhost:4000/channels/mychannel/blocks/1" \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peer": "peer0.hlc.com"
}'
echo
echo


############################################################################
### TODO: What to pass to fetch the Block information
############################################################################
#echo "GET query Block by Hash"
#echo
#hash=????
#curl -s -X GET \
#  "http://localhost:4000/channels/mychannel/blocks?hash=$hash&peer=peer1" \
#  -H "authorization: Bearer $ORG1_TOKEN" \
#  -H "cache-control: no-cache" \
#  -H "content-type: application/json" \
#  -H "x-access-token: $ORG1_TOKEN"
#echo
#echo

echo "POST query ChainInfo"
echo
curl -s -X POST \
  "http://localhost:4000/channels/mychannel" \
  -H "authorization: Bearer $ORG1_TOKEN" \
  -H "content-type: application/json" \
  -d '{
	"peer": "peer0.hlc.com"
}'
echo
echo

#echo "GET query Installed chaincodes"
#echo
#curl -s -X GET \
#  "http://localhost:4000/chaincodes?peer=peer0.hlc.com" \
#  -H "authorization: Bearer $ORG1_TOKEN" \
#  -H "content-type: application/json"
#echo
#echo
#
#echo "GET query Instantiated chaincodes"
#echo
#curl -s -X GET \
#  "http://localhost:4000/channels/mychannel/chaincodes?peer=peer0.hlc.com" \
#  -H "authorization: Bearer $ORG1_TOKEN" \
#  -H "content-type: application/json"
#echo
#echo
#
#echo "GET query Channels"
#echo
#curl -s -X GET \
#  "http://localhost:4000/channels?peer=peer0.hlc.com" \
#  -H "authorization: Bearer $ORG1_TOKEN" \
#  -H "content-type: application/json"
#echo
#echo


echo "Total execution time : $(($(date +%s)-starttime)) secs ..."
