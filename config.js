var util = require('util');
var path = require('path');
var hfc = require('fabric-client');
let request = require('request');
let fs = require('fs');
let yaml = require("js-yaml");
let http = require("http");

var file = 'network_config%s.yaml';

var env = process.env.TARGET_NETWORK;
if (env)
    file = util.format(file, '_' + env);
else
    file = util.format(file, '');

// some other settings the application might need to know
hfc.addConfigFile(path.join(__dirname, 'config.json'));
// indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
let config_server = hfc.getConfigSetting('config_server');
let apps = config_server['names'];
apps.forEach(function (name) {
    // let app_file = fs.createWriteStream(util.format('%s-%s.yml', name, config_server['profile']));
    // request.get(util.format("%s/%s/%s-%s.yml", config_server['endpoint'], config_server['label'], name, config_server['profile'])).auth(config_server['username'], config_server['password'], false).on('error', function (err) {
    //     console.log(util.format("%s/%s/%s-%s.yml", config_server['endpoint'], config_server['label'], name, config_server['profile']));
    //     console.log(err)
    // }).pipe(app_file);
    let filename = util.format('%s-%s.yml', name, config_server['profile']);
    http.get(util.format("%s/%s/%s-%s.yml", config_server['endpoint'], config_server['label'], name, config_server['profile']), (res) => {
        res.setEncoding('utf-8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            fs.writeFile(path.join(__dirname, filename), rawData, {"encoding": 'utf-8'}, function (err) {
                fs.readFile(path.join(__dirname, filename), 'utf-8', function (err, data) {
                    result = data.replace(/~/g, ".");
                    fs.writeFile(path.join(__dirname, filename), result, {"encoding": 'utf-8'}, function (err) {
                        hfc.setConfigSetting(util.format('%s-connection-profile-path', name), path.join(__dirname, filename));
                    })
                })
            });
        })
    });
    // let data = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
    // // console.log(data);
    // let result = data.replace(/~/g, ".");
    // console.log(result);
    // fs.unlinkSync(path.join(__dirname, filename));
    // fs.writeFileSync(path.join(__dirname, filename), result, {"encoding": 'utf-8'});
    // hfc.setConfigSetting(util.format('%s-connection-profile-path', name), path.join(__dirname, filename));
});

// var config_loc = path.resolve(path.join(__dirname, "network_config-test.yml"));
// var file_data = fs.readFileSync(config_loc);
// let file_ext = path.extname(config_loc);
// // maybe the file is yaml else has to be JSON
//
// var network_data = yaml.safeLoad(file_data);
//
// console.log(network_data);
// hfc.setConfigSetting('network_config-connection-profile-path', path.join(__dirname, 'config', file));
// hfc.setConfigSetting('Hlc-connection-profile-path', path.join(__dirname, app_file.path));
// hfc.setConfigSetting('Creater-connection-profile-path', path.join(__dirname, 'config', 'creater-test.yml'));
// hfc.setConfigSetting('Transfer-connection-profile-path', path.join(__dirname, 'config', 'transfer-test.yml'));
// hfc.setConfigSetting('Seller-connection-profile-path', path.join(__dirname, 'config', 'seller-test.yml'));
