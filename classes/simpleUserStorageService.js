import http from 'http'
import querystring from 'querystring';

export default class SimpleUserStorageService {
    
    constructor(){
    }

    createUser(){
        return new Promise((resolve, reject) => {
            var post_data ='';

            // An object of options to indicate where to post to
            var options = {
                host: 'localhost',
                port: '3000',
                path: '/user',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Content-Length': Buffer.byteLength(post_data)
                }
            };

            // Set up the request
            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resolve(chunk);
                });
            });

            req.on('error', error => {
                console.error(error)
                reject();
            })

            // post the data
            req.write(post_data);
            req.end();
        })
    }

    getUserData(userID){
        return new Promise((resolve, reject) => {

            const query = {
                userID: userID
            }

            const queryString = querystring.stringify(query);

            var options = {
                host: 'localhost',
                port: '3000',
                path: '/userData?' + queryString,
                method: 'GET'
            }
            var req = http.request(options, function(res){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    try {
                        var data = JSON.parse(chunk);
                        resolve(data);
                    } catch (e){
                        console.log('Error parsing user data');
                    }
                });
            })

            req.end();
        })
    }

    writeUserData(userID, data){
        return new Promise((resolve, reject) => {
            var post_data = data;

            const query = {
                userID: userID
            }

            const queryString = querystring.stringify(query);

            // An object of options to indicate where to post to
            var options = {
                host: 'localhost',
                port: '3000',
                path: '/userData?' + queryString,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };

            // Set up the request
            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function () {
                    resolve();
                });
            });

            req.on('error', error => {
                console.error(error)
                reject();
            })

            // post the data
            req.write(post_data);
            req.end();
        })

    }
}