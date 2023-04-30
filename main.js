//CONFIG
const port = 3001
//CONFIG END
require('dotenv').config();
const Express = require('express');
const Querystring = require('querystring');
const Http = require('http');
const { json } = require('express');
const path = require('path');
const axios = require('axios').default;
const util = require('util');
const bodyParser = require('body-parser');
const cors = require("cors")
const errtemplate = `
<!DOCTYPE html>
<html lang="en">


    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Oh no!</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>


    <body>
        <div class="d-flex align-items-center justify-content-center vh-100">
            <div class="text-center">
                <h1 class="display-1 fw-bold">%s</h1>
                <p class="fs-3"> <span class="text-danger">Something Went Wrong!! - </span>%s.</p>
                <p class="lead">
                    %s
                  </p>
                <a href="index.html" class="btn btn-primary">Go Home</a>
            </div>
        </div>
    </body>


</html>
`
// Success Web Page Template
const success = `
<!DOCTYPE html>
<html lang="en">


    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Done!</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>


    <body>
        <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="card text-center">
        <div class="card-header">
          OK!
        </div>
        <div class="card-body">
          <h5 class="card-title">Web Builder is Ready! Current Plan : Free</h5>
          <p class="card-text">You can Entering by clicking below button!</p>
          <a href="%s" class="btn btn-primary">Lead me to Web Builder</a>
        </div>
        <div class="card-footer text-muted">
          Will Expire in 24 hours
        </div>
      </div>
        </div>
    </body>


</html>
`
const landing = `
Landing Page Comming Soon.
`
const app = Express();
app.use(cors({
    origin: [
        "http:/localhost:3000",
        "http://cpanel.share.sitenexus.me",
        "https://cpanel.share.sitenexus.me",
        "https://cpanel.epizy.com"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization']
}))
const info = {
    username: "apikey0",
    password: "wcctObW2am4XD02Qd9Sf9nWJiRWNASe.dYrDxgFUQ1UOrunl",
    debug: false
};
if (info.debug) {
    console.log(`Running API With Username ${info.username} and Password is ${info.password},You can disable showing this by Setting Debug to false`)
}
app.use(Express.static('public'));
var Encoded = Buffer.from(`${info.username}:${info.password}`).toString("base64")
var cfg = {
    hostname: 'http://site.pro/',
    method: 'POST',
    path: '/api/requestLogin',
    headers: {
        "Authorization": `Basic ${Encoded}`,
        "Content-Type": "application/json"
    }
}
function requestLogin(config, OnDone) {
    var cfg = {
        url: 'http://site.pro/api/requestLogin',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Encoded}`,
            'Content-Type': "application/json"
        },
        auth: {
            username: info.username,
            password: info.password
        },
        data: JSON.stringify(config)
    };

    axios(cfg).then(function (response) {
        console.log("Sended");
        OnDone({
            url: response.data.url
        });
    }).catch(txt => {
        console.log(`[ERROR] Failed to Connect API ${txt.response.status} `)
        if (txt.response.data.error.message == "License not found. Please contact your hosting support.") {
            console.log("[WARN] Please Allow This IP in Site.Pro Controls")
        }
        OnDone({
            statuscode: txt.response.code,
            code: txt.code,
            reason: txt.response.data.error.message
        });

        // End of Error Catcher
    });


} // Function End
// Pages
app.use(bodyParser.json());
app.post("/json", function (req, res) {
    //
    
    //
    if (req.body) {
        console.log("OK!");
        // User Client Config
        // Options of HTTP
    
        var config = req.body

        var a = requestLogin(config,function (data) {
            if (data.reason) {
                res.json({
                    success: false,
                    error: {
                        message: data.reason
                    },
                });
            } else if (data.url) {
                res.json({
                    success: true,
                    error: {

                    },
                    url: data.url
                });
    
            }
        });



    }
    //
});
app.post('/main', async function (req, res) {
    console.log("Hello");
    console.log(`["MAIN API"] IP: ${req.ip}`)
    if (req.body) {
        console.log("OK!");
        console.log(req.body)
        // User Client Config
        var config = {
            type: "external",
            domain: req.body.domain,
            apiUrl: req.body.ftp_host,
            lang: "en",
            username: req.body.ftp_user,
            password: req.body.ftp_password,
            uploadDir: req.body.uploadDir
        };
        // Options of HTTP
        var a = requestLogin(config, function (data) {
            if (data.reason) {
                res.json({
                    success: false,
                    message: data.reason
                })
            } else if (data.url) {
                res.json({
                    success: true,
                    url: data.url
                })
            }
        });



    }
});


app.listen(port);
console.log(`Running on ${port} Ports...`)
