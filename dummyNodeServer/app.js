var http = require('http');
var url = require('url');

var app = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url, true),
        urlParams = urlParts.query, 
        urlPathname = urlParts.pathname;
	
	res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    
	if(urlPathname.indexOf("/api/values/real") == 0){
		//console.log(urlParams);
		res.end(JSON.stringify({dval:Math.random(), status: 'OK'}, null, 3));
		return;
	}
	var resArray = [];
	
    for (var i = 0; i < 1550; i++) {
        resArray.push({dval: Math.random(), status: 'OK', timestamp: "gfhgfhh"});
    }
    res.end(JSON.stringify(resArray, null, 3));
	//res.end(JSON.stringify({dval:Math.random() * 1000, status: 'OK'}, null, 3));
});
var port = 62448;
app.listen(port, ()=>{console.log('listening on port '+port)});