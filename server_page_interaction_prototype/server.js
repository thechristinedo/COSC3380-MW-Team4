const http = require('http');
const fs = require('fs');

const { hostname, port } = require('./src/contants');
const { resourceLimits } = require('worker_threads');

async function return_static_file(request, response) {
    if (request.url === '/' ) { // Default to index page?
        file_path = './index.html';
        content_type = 'text/html';
    }
    else if (request.url == '/requests' || request.method === 'POST') {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        console.log(buffers.toString());
        response.end();
        return;
    }
    else {
        file_path = '.' + request.url;
        const extension = request.url.split('.').pop();
        if (extension === 'css') {
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


//Create connection
var mysql      = require('./node_modules/mysql');
var connection = mysql.createConnection({
  host     : 'cosc3380-mw-team4.ce2wtehy81sy.us-east-1.rds.amazonaws.com',
  port : '3380',
  user     : 'admin',
  password : 'Team4!!!',
  database : 'Team4_Music_Site'
});
connection.connect();

connection.query('SELECT * FROM `SONG`', function (error, results) {
    if (error){                     // error will be an Error if one occurred during the query
        console.log('Error');
        throw error;
    }
    console.log(results);    // results will contain the results of the query
  });

connection.end();



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