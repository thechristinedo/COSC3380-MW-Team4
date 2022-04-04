const http = require('http');
const fs = require('fs');
const mysql = require('./node_modules/mysql');

const { hostname, port } = require('./src/contants');

//Create connection
const connection = mysql.createConnection({
  host     : 'cosc3380-mw-team4.ce2wtehy81sy.us-east-1.rds.amazonaws.com',
  port : '3380',
  user     : 'admin',
  password : 'Team4!!!',
  database : 'Team4_Music_Site'
});
connection.connect();

async function handle_post_requests(request, response) {
    if (request.url === '/posts/login') {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        const user_info = JSON.parse(buffers.toString());
        const query = `SELECT id FROM USER WHERE (name="${user_info.Username}" AND password="${user_info.Password}")`
        connection.query(query, (error, results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            if (Object.keys(results).length === 0) {
                response.writeHead(200);
                response.write(JSON.stringify({'Accepted': false}));
                response.end();
            }
            else {
                response.writeHead(200);
                response.write(JSON.stringify({'Accepted': true, 'UserID': results['0'].id}));
                response.end();
            }
        })
    }
    else {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        console.log(JSON.parse(buffers.toString()));
        response.write(JSON.stringify({'Accepted': false}))
        response.end();
    }
}

// Main function body of our server. All requests to our webpage are routed
// through this function.
async function server_handler(request, response) {
    if (request.url === '/' ) { // Default to index page?
        file_path = './index.html';
        content_type = 'text/html';
    }
    else if (request.url.substr(0,8) === '/posts' || request.method === 'POST') {
        handle_post_requests(request, response);
        return;
    }
    else { // Likely a request for a specific resource
        file_path = '.' + request.url;
        const extension = request.url.split('.').pop(); // gives us the last string preceeded by ".", should be file extension
        if (extension === 'css') {
            content_type = 'text/css';
        }
        else if (extension === 'js') {
            content_type = 'text/javascript';
        }
        else if (extension === 'png') {
            content_type = 'image/png';  
        }
        else if (extension === 'json') {
            content_type = 'application/json'
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

http.createServer(server_handler).listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`)
});

connection.query('SELECT * FROM `SONG`', function (error, results) {
    if (error){                     // error will be an Error if one occurred during the query
        console.log('Error');
        throw error;
    }
    console.log(results);    // results will contain the results of the query
  });

// connection.end();
