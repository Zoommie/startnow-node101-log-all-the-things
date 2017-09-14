const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const csv = path.join(__dirname,'log.csv');


app.use((req, res, next) => {
// write your logging code here

        const agent = req.headers['user-agent'].replace(',','');
        const date = new Date();
        const time = date.toISOString();
        const method = req.method;
        const resource = req.originalUrl;
        const version = 'HTTP/' + req.httpVersion;
        const status = res.statusCode;     
                       
        console.log( agent + ','+ time +','+ method +','+ resource +','+ version+','+ status+',' )

fs.appendFile(csv, '\n' + agent +','+ time +','+ method +','+ resource +','+ version +','+ status, (err) => {
        if (err) throw err;});

        next()
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
        res.status(200).send("ok");
});

app.get('/logs', (req, res) => {
   //created an array for json, to push an object with data
        const arrayJson = [];
// write your code to return a json object containing the log data here
        fs.readFile(csv, 'utf8', function(err, data){
            if (err) res.status(500).send("error");

            var arrayLines = data.split('\n');
            arrayLines.shift();

        console.log(arrayLines);
     
   arrayLines.forEach(function (lgLine){
            var Line = lgLine.split(',');
            //This object is created an object/
            var dataLog = {
                'Agent':Line[0],
                'Time':Line[1],
                'Method':Line[2],
                'Resource':Line[3],
                'Version':Line[4],
                'Status':Line[5]
            };
            arrayJson.push(dataLog);
        
            });
        res.json(arrayJson);
        });
        });

module.exports = app;
