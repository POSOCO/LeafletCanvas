var http = require('http');

var app = http.createServer(function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.end(JSON.stringify({dval: Math.random()*1000, status: 'OK'}, null, 3));
});
app.listen(62448);