var http = require('http');
var fs = require('fs');
var img = fs.readFileSync('./empty_image.png');
http.createServer((req,res)=>{
    res.end(img);
}).listen(8080);