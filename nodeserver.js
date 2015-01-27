var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  res.writeHead(200);
  res.end('Simple http node server. Here are the GET parameters:' + JSON.stringify(query));
});
server.listen(8080);