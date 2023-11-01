//Create web server in javascript
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var comments = [];

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    if (urlObj.pathname === "/comment") {
        console.log("comment route");
        if (req.method === "POST") {
            console.log("POST comment route");
            var jsonData = "";
            req.on('data', function (chunk) {
                jsonData += chunk;
            });
            req.on('end', function () {
                var reqObj = JSON.parse(jsonData);
                console.log(reqObj);
                console.log("Name: " + reqObj.Name);
                console.log("Comment: " + reqObj.Comment);
                comments.push(reqObj);
                console.log(comments);
                res.writeHead(200);
                res.end("");
            });
        }
        else if (req.method === "GET") {
            console.log("In GET");
            res.writeHead(200);
            var data = JSON.stringify(comments);
            res.end(data);
        }
    }
    else {
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(80);