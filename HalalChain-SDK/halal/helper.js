/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
const ORG_CA_USER_CONFIG = 'caUsername';
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');

var path = require('path');
var util = require('util');
var fs = require('fs-extra');
var User = require('fabric-client/lib/User.js');
var crypto = require('crypto');
var copService = require('fabric-ca-client');

var hfc = require('fabric-client');
hfc.setLogger(logger);
var ORGS = hfc.getConfigSetting('network-config');

var clients = {};
var channels = {};
var caClients = {};

var sleep = async function (sleep_time_ms) {
    return new Promise(resolve => setTimeout(resolve, sleep_time_ms));
}

async function getClientForOrg(userorg, username) {
    logger.debug('getClientForOrg - ****** START %s %s', userorg, username)
    // get a fabric client loaded with a connection profile for this org
    let config = '-connection-profile-path';

    // build a client context and load it with a connection profile
    // lets only load the network settings and save the client for later
    let client = hfc.loadFromConfig(hfc.getConfigSetting('network_config' + config));

    // This will load a connection profile over the top of the current one one
    // since the first one did not have a client section and the following one does
    // nothing will actually be replaced.
    // This will also set an admin identity because the organization defined in the
    // client section has one defined
    client.loadFromConfig(hfc.getConfigSetting(userorg + config));

    // let peers = Object.entries(client._network_config._network_config['peers']).map(([key, peer]) => {
    //     let clientKey = fs.readFileSync(path.join(__dirname, peer['grpcOptions']['clientKey']));
    //     let clientCert = fs.readFileSync(path.join(__dirname, peer['grpcOptions']['clientCert']));
    //     let pem = fs.readFileSync(path.join(__dirname, peer['grpcOptions']['pem']));
    //     peer['grpcOptions']['clientKey'] = Buffer.from(clientKey).toString();
    //     peer['grpcOptions']['clientCert'] = Buffer.from(clientCert).toString();
    //     peer['grpcOptions']['pem'] = Buffer.from(pem).toString();
    //     return [key, peer];
    // });
    // peers.forEach(([key, peer]) => {
    //     client._network_config._network_config['peers'][key] = peer;
    // });
    // this will create both the state store and the crypto store based
    // on the settings in the client section of the connection profile
    await client.initCredentialStores();

    // The getUserContext call tries to get the user from persistence.
    // If the user has been saved to persistence then that means the user has
    // been registered and enrolled. If the user is found in persistence
    // the call will then assign the user to the client object.
    if (username) {
        let user = await client.getUserContext(username, true);
        if (!user) {
            throw new Error(util.format('User was not found :', username));
        } else {
            logger.debug('User %s was found to be registered and enrolled', username);
        }
    }
    logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

    return client;
}

let getOrgCAUser = async function (userOrg) {
    let client = await getClientForOrg(userOrg);
    logger.debug('Successfully initialized the credential stores');
    let clientConfig = client.getClientConfig();

    let orgCAusername = clientConfig[ORG_CA_USER_CONFIG];
    return await getRegisteredUser(orgCAusername, userOrg, true);
};


var getRegisteredUser = async function (username, userOrg, isJson) {
    try {
        var client = await getClientForOrg(userOrg);
        logger.debug('Successfully initialized the credential stores');
        // client can now act as an agent for organization Org1
        // first check to see if the user is already enrolled
        var user = await client.getUserContext(username, true);
        if (user && user.isEnrolled()) {
            logger.info('Successfully loaded member from persistence');
        } else {
            // user was not enrolled, so we will need an admin user object to register
            // var admins = hfc.getConfigSetting('admins');
            let client_config = client.getClientConfig();
            var ca_admin_username;
            var ca_admin_password;
            if (client_config && client_config.organization) {
                let organization_config = client._network_config.getOrganization(client_config.organization);
                if (organization_config) {
                    let cas = organization_config.getCertificateAuthorities();
                    if (cas.length > 0) {
                        let ca = cas[0];
                        console.log(ca.getRegistrar()[0]['enrollId']);
                        console.log(ca.getRegistrar()[0]['enrollSecret']);
                        ca_admin_username = ca.getRegistrar()[0]['enrollId'];
                        ca_admin_password = ca.getRegistrar()[0]['enrollSecret'];
                    }
                }
            }

            let adminUserObj = await client.setUserContext({username: ca_admin_username, password: ca_admin_password});
            console.log(adminUserObj);
            let caClient = client.getCertificateAuthority();
            console.log(caClient);
            let secret = await caClient.register({
                enrollmentID: username,
                affiliation: userOrg.toLowerCase() + '.department1'
                // affiliation: userOrg.toLowerCase()
            }, adminUserObj);
            console.log(secret);
            logger.debug('Successfully got the secret for user %s', username);
            user = await client.setUserContext({username: username, password: secret});
            logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);
        }
        if (user && user.isEnrolled) {
            if (isJson && isJson === true) {
                var response = {
                    success: true,
                    secret: user._enrollmentSecret,
                    username: username,
                    message: username + ' enrolled Successfully'
                };
                return response;
            }
        } else {
            throw new Error('User was not enrolled ');
        }
    } catch (error) {
        logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
        return {
            success: false,
            message: 'failed ' + error.toString()
        };
    }

};


var setupChaincodeDeploy = function () {
    process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('CC_SRC_PATH'));
};

var getLogger = function (moduleName) {
    var logger = log4js.getLogger(moduleName);
    logger.setLevel('DEBUG');
    return logger;
};

exports.getClientForOrg = getClientForOrg;
exports.getLogger = getLogger;
exports.setupChaincodeDeploy = setupChaincodeDeploy;
exports.getRegisteredUser = getRegisteredUser;
exports.getOrgCAUser = getOrgCAUser;
