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

let helper = require('./helper.js');
let logger = helper.getLogger('Login');
let bcrypt = require('bcrypt');
const USERS_CONFIG = 'users';
//Attempt to send a request to the orderer with the sendTransaction method
let login = async function (username, orgName, password) {
    logger.debug('\n====== Login \'' + username + '\' ======\n');
    try {
        // first setup the client for this org
        let client = await helper.getClientForOrg(orgName);
        logger.debug('Successfully got the fabric client for the organization "%s"', orgName);
        let clientConfig = client.getClientConfig();

        if (clientConfig[USERS_CONFIG][username] && bcrypt.compareSync(password, clientConfig[USERS_CONFIG][username]['password'])) {
            return {
                success: true,
                message: 'User \'' + username + '\' Org \'' + orgName + '\' logon Successfully'
            };
        }

        return {
            success: false,
            message: 'User \'' + username + '\' Org \'' + orgName + '\' logon Failed'
        };
    } catch (err) {
        logger.error('Failed to login user: ' + err.stack ? err.stack : err);
        return {
            success: false,
            message: 'Failed to login user: ' + err.toString()
        };
    }
};

exports.login = login;
