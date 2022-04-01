const http = require('http');
const fs = require('fs');

const { hostname, port } = require('./src/contants')

function return_static_file(request, response) {
    if (request.url === '/' ) { // Default to index page?
        file_path = './index.html';
        content_type = 'text/html';
    }
    else {
        file_path = '.' + request.url;
        const extension = request.url.split('.').pop();
        if (request.method === 'POST') {
            
        }
        else if (extension === 'css') {
            content_type = 'text/css'; // gonna need a switch case for the end of the URL
        }
        else if (extension === 'js') {
            content_type = 'text/javascript';
        }
        else if (extension === 'png') {
            content_type = 'image/png';  
        }
        else {
            content_type = 'text/plain';
        }
    }
    fs.readFile(file_path, function (err, html) {
        if (err) {
            throw err;
        }
        response.writeHead(200, {"Content-Type": content_type});
        response.write(html);
        response.end();
    });
}

http.createServer(return_static_file).listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`)
});

// const hostname = '172.31.21.219'; // Our hostname per AWS
// const port = 80; // Default HTTP port
//
// function server_function(req, res) {
//  res.statusCode = 200;
//  res.setHeader('Content-type', 'text/plain');
//  res.end('Hello world!');
// }
//
// const server = http.createServer(server_function);
//
// server.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
// });