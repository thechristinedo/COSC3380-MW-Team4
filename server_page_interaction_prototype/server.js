const http = require('http');
const fs = require('fs');

const { hostname, port } = require('./src/contants');

async function handle_requests(request, response) {
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
    fs.readFile(file_path, function (err, content) {
        if (err) {
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {"Content-Type": content_type});
        response.write(content);
        response.end();
    });
}

http.createServer(handle_requests).listen(port, hostname, () => {
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
