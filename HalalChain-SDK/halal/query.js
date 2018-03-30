/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var helper = require('./helper.js');
var logger = helper.getLogger('Query');

var queryChaincode = async function (peers, channelName, chaincodeName, args, fcn, username, org_name) {
    try {
        let response = await helper.getOrgCAUser(org_name);
        let orgCAusername;
        if (response && response.success) {
            orgCAusername = response.username;
        } else {
            response.timestamp = Date.now();
            return response;
        }
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, orgCAusername);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
        var channel = client.getChannel(channelName);
        if (!channel) {
            let message = util.format('Channel %s was not defined in the connection profile', channelName);
            logger.error(message);
            throw new Error(message);
        }

        // send query
        var request = {
            // targets : [peer], //queryByChaincode allows for multiple targets
            chaincodeId: chaincodeName,
            fcn: fcn,
            args: args
        };
        logger.debug(util.format("specific peers %s for query chaincode", peers));
        if (peers) {
            request.targets = peers
        }
        let response_payloads = await channel.queryByChaincode(request);
        let payload_strings = [];
        if (response_payloads) {
            for (let i = 0; i < response_payloads.length; i++) {
                logger.info(args[0] + ' now has ' + response_payloads[i].toString('utf8') +
                    ' after the move');
                payload_strings.push(response_payloads[i].toString('utf8'))
                // return args[0] + ' now has ' + response_payloads[i].toString('utf8') +
                //     ' after the move';
            }
            let message = util.format(
                'Successfully invoked the chaincode %s to the channel \'%s\'',
                org_name, channelName);
            return {
                success: true,
                payloads: payload_strings,
                timestamp: Date.now(),
                message: message
            }
        } else {
            logger.error('response_payloads is null');
            return {
                success: false,
                timestamp: Date.now(),
                message: 'response_payloads is null'
            }
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return {
            success: false,
            timestamp: Date.now(),
            message: error.toString()
        };
    }
};
var getBlockByNumber = async function (peer, channelName, blockNumber, username, org_name) {
    try {
        let response = await helper.getOrgCAUser(org_name);
        let orgCAusername;
        if (response && response.success) {
            orgCAusername = response.username;
        } else {
            response.timestamp = Date.now();
            return response;
        }
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, orgCAusername);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
        var channel = client.getChannel(channelName);
        if (!channel) {
            let message = util.format('Channel %s was not defined in the connection profile', channelName);
            logger.error(message);
            throw new Error(message);
        }

        let response_payload = await channel.queryBlock(parseInt(blockNumber), peer);
        if (response_payload) {
            let message = 'response_payload is not null';
            logger.debug(response_payload);
            return {
                success: true,
                block: response_payload,
                message: message,
                timestamp: Date.now()
            };
        } else {
            let message = 'response_payload is null';
            logger.error(message);
            return {
                success: false,
                block: response_payload,
                message: message,
                timestamp: Date.now()
            };
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return {
            success: false,
            block: null,
            message: error.toString(),
            timestamp: Date.now()
        };
    }
};
var getTransactionByID = async function (peer, channelName, trxnID, username, org_name) {
    try {
        let response = await helper.getOrgCAUser(org_name);
        let orgCAusername;
        if (response && response.success) {
            orgCAusername = response.username;
        } else {
            response.timestamp = Date.now();
            return response;
        }
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, orgCAusername);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
        var channel = client.getChannel(channelName);
        if (!channel) {
            let message = util.format('Channel %s was not defined in the connection profile', channelName);
            logger.error(message);
            throw new Error(message);
        }

        let response_payload = await channel.queryTransaction(trxnID, peer);
        if (response_payload) {
            let message = 'response_payload is not null';
            logger.debug(response_payload);
            return {
                success: true,
                tx: response_payload,
                message: message,
                timestamp: Date.now()
            };
        } else {
            let message = 'response_payload is null';
            logger.error(message);
            return {
                success: false,
                tx: response_payload,
                message: message,
                timestamp: Date.now()
            };
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return {
            success: false,
            tx: null,
            message: error.toString(),
            timestamp: Date.now()
        };
    }
};
var getBlockByHash = async function (peer, channelName, hash, username, org_name) {
    try {
        let response = await helper.getOrgCAUser(org_name);
        let orgCAusername;
        if (response && response.success) {
            orgCAusername = response.username;
        } else {
            response.timestamp = Date.now();
            return response;
        }
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, orgCAusername);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
        var channel = client.getChannel(channelName);
        if (!channel) {
            let message = util.format('Channel %s was not defined in the connection profile', channelName);
            logger.error(message);
            throw new Error(message);
        }

        let response_payload = await channel.queryBlockByHash(Buffer.from(hash), peer);
        if (response_payload) {
            let message = 'response_payload is not null';
            logger.debug(response_payload);
            return {
                success: true,
                tx: response_payload,
                message: message,
                timestamp: Date.now()
            };
        } else {
            let message = 'response_payload is null';
            logger.error(message);
            return {
                success: false,
                tx: response_payload,
                message: message,
                timestamp: Date.now()
            };
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return {
            success: false,
            tx: null,
            message: error.toString(),
            timestamp: Date.now()
        };
    }
};
var getChainInfo = async function (peer, channelName, username, org_name) {
    try {
        let response = await helper.getOrgCAUser(org_name);
        let orgCAusername;
        if (response && response.success) {
            orgCAusername = response.username;
        } else {
            response.timestamp = Date.now();
            return response;
        }
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, orgCAusername);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
        var channel = client.getChannel(channelName);
        if (!channel) {
            let message = util.format('Channel %s was not defined in the connection profile', channelName);
            logger.error(message);
            throw new Error(message);
        }

        let response_payload = await channel.queryInfo(peer);
        if (response_payload) {
            let message = 'response_payload is not null';
            logger.debug(response_payload);
            return {
                success: true,
                channel: response_payload,
                message: message,
                timestamp: Date.now()
            };
        } else {
            let message = 'response_payload is null';
            logger.error(message);
            return {
                success: false,
                channel: response_payload,
                message: message,
                timestamp: Date.now()
            };
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return {
            success: false,
            channel: null,
            message: error.toString(),
            timestamp: Date.now()
        };
    }
};
//getInstalledChaincodes
var getInstalledChaincodes = async function (peer, channelName, type, username, org_name) {
    try {
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, username);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);

        let response = null
        if (type === 'installed') {
            response = await client.queryInstalledChaincodes(peer, true); //use the admin identity
        } else {
            var channel = client.getChannel(channelName);
            if (!channel) {
                let message = util.format('Channel %s was not defined in the connection profile', channelName);
                logger.error(message);
                throw new Error(message);
            }
            response = await channel.queryInstantiatedChaincodes(peer, true); //use the admin identity
        }
        if (response) {
            if (type === 'installed') {
                logger.debug('<<< Installed Chaincodes >>>');
            } else {
                logger.debug('<<< Instantiated Chaincodes >>>');
            }
            var details = [];
            for (let i = 0; i < response.chaincodes.length; i++) {
                logger.debug('name: ' + response.chaincodes[i].name + ', version: ' +
                    response.chaincodes[i].version + ', path: ' + response.chaincodes[i].path
                );
                details.push('name: ' + response.chaincodes[i].name + ', version: ' +
                    response.chaincodes[i].version + ', path: ' + response.chaincodes[i].path
                );
            }
            return details;
        } else {
            logger.error('response is null');
            return 'response is null';
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return error.toString();
    }
};
var getChannels = async function (peer, username, org_name) {
    try {
        // first setup the client for this org
        var client = await helper.getClientForOrg(org_name, username);
        logger.debug('Successfully got the fabric client for the organization "%s"', org_name);

        let response = await client.queryChannels(peer);
        if (response) {
            logger.debug('<<< channels >>>');
            var channelNames = [];
            for (let i = 0; i < response.channels.length; i++) {
                channelNames.push('channel id: ' + response.channels[i].channel_id);
            }
            logger.debug(channelNames);
            return response;
        } else {
            logger.error('response_payloads is null');
            return 'response_payloads is null';
        }
    } catch (error) {
        logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
        return error.toString();
    }
};

exports.queryChaincode = queryChaincode;
exports.getBlockByNumber = getBlockByNumber;
exports.getTransactionByID = getTransactionByID;
exports.getBlockByHash = getBlockByHash;
exports.getChainInfo = getChainInfo;
exports.getInstalledChaincodes = getInstalledChaincodes;
exports.getChannels = getChannels;
