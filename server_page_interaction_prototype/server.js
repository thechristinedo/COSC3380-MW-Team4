const http = require('http');
const fs = require('fs');

const { hostname, port } = require('./src/contants');

async function handle_requests(request, response) {
    if (request.url === '/' ) { // Default to index page?
        file_path = './index.html';
        content_type = 'text/html';
    }
    else if (request.url == '/requests') {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        console.log(buffers.toString());
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
        else {
            content_type = 'text/plain';
        }
    }
    fs.readFile(file_path, function (err, content) {
        if (err) {
            throw err;
        }
        response.writeHead(200, {"Content-Type": content_type});
        await response.write(content);
        response.end();
    });
}

http.createServer(handle_requests).listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`)
});