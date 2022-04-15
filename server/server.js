const http = require('http');
const fs = require('fs');
const mysql = require('./node_modules/mysql');

const { hostname, port, pages_path } = require('./src/contants');

//Create connection to our database
const connection = mysql.createConnection({
  host     : 'cosc3380-mw-team4.ce2wtehy81sy.us-east-1.rds.amazonaws.com',
  port     : '3380',
  user     : 'admin',
  password : 'Team4!!!',
  database : 'Team4_Music_Site'
});
connection.connect();

function construct_update_rating(data) {
    // data: {UserID, SongID, Rating, WasRated}
    let query = `UPDATE RATING SET rating=${data.Rating}
            WHERE (user_id = ${data.UserID} AND song_id = ${data.SongID})`
    return query;
}

function construct_insert_rating(data) {
    // data: {UserID, SongID, Rating, WasRated}
    let query = `INSERT INTO RATING (user_id, song_id, rating) VALUE (
        ${data.UserID}, ${data.SongID}, ${data.Rating}
    )`
    return query;
}

async function handle_song_rating_update(song_id, response) {
    connection.query(`SELECT rating FROM SONG WHERE (id = ${song_id})`, (error, results) => {
        if (error) {
            console.log(error);
            response.writeHead(500);
            response.end();
            throw error;
        }
        response.writeHead(200);
        response.write(JSON.stringify({Modified: true, NewRating: results[0].rating}));
        response.end();
    });
}

/**
 *  This function is used to handle all urls sent to the server that begin with "/requests". This
 *  URL is EXCLUSIVELY used with fetch() on the frontend to tell the server to expect to receive JSON
 *  information and to react to that JSON.
 * @param {*} request 
 * @param {*} response 
 */
async function handle_posts_requests(request, response) {
    // This section is for handling a longin request which conists of a username and password.
    if (request.url === '/requests/login') {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        // user_info = {Username, Password}
        const user_info = JSON.parse(buffers.toString());
        const query = `SELECT id FROM USER WHERE (name="${user_info.Username}" AND password="${user_info.Password}")`
        connection.query(query, (error, results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            if (Object.keys(results).length === 0) { // Username/Password combo not found in database
                response.writeHead(200);
                response.write(JSON.stringify({'Accepted': false}));
                response.end();
            }
            else {
                response.writeHead(200);
                // results: Array['0': {id}] (first key is referenced as below, I know it's weird)
                response.write(JSON.stringify({'Accepted': true, 'UserID': results['0'].id}));
                response.end();
            }
        });
    }
    else if (request.url.substr(0,15) === '/requests/songs') {
        if (request.url === '/requests/songs') {
            const buffers = [];
            for await (const chunk of request) {
                buffers.push(chunk);
            }
            // user_id: {UserID}
            const user_id = JSON.parse(buffers.toString());
            const first_query = 'SELECT id, title, rating FROM SONG';
            const second_query = `SELECT song_id, rating FROM RATING WHERE (user_id = ${user_id.UserID})`
            connection.query(first_query, (error, first_results) => {
                if (error) {
                    console.log(error);
                    response.writeHead(500);
                    response.end();
                    throw error;
                }
                connection.query(second_query, (error, second_results) => {
                    if (error) {
                        console.log(error);
                        response.writeHead(500);
                        response.end();
                        throw error;
                    }
                    else {
                        const rows = {Songs: [], Ratings: []};
                        // first_results is an array of info that looks like:
                        // RowDataPacket {id, title, rating} NOTE: these are the fields requested in second_query!
                        for (const row of first_results) {
                            rows.Songs.push(row);
                        }
                        for (const row of second_results) {
                            rows.Ratings.push(row);
                        }
                        response.writeHead(200);
                        response.write(JSON.stringify(rows));
                        response.end();
                    }
                });

            });
        }
    }
    else if (request.url.substr(0,16) === '/requests/rating') {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        // rating_info = {UserID, SongID, Rating, WasRated} (see songs.js)
        rating_info = JSON.parse(buffers.toString());
        var query;
        if (rating_info.WasRated) { // If user has already rated, then we need to updat3
            query = construct_update_rating(rating_info);
        }
        else {                       // Otherwise, we need to insert
            query = construct_insert_rating(rating_info);
        }
        connection.query(query, async (error, results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            else {
                if (results.affectedRows != 0 || results.changedRows != 0) {
                    // If we have changed data, we need to update the frontend.
                    await handle_song_rating_update(rating_info.SongID, response);
                    return;
                }
                // Otherwise, we notify the frontend that no data has been changed.
                const body = {Modified: false};
                
                response.writeHead(200);
                response.write(JSON.stringify(body));
                response.end();
            }
        });
    }
    else {
        const buffers = [];    
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        response.write(JSON.stringify({'Accepted': false}))
        response.end();
    }
}

// Main function body of our server. All requests to our webpage are routed
// through this function. We use fetch() in our frontend javascript to send a URL
// and other info to the server. For example, if the request is "/songs", then it
// will load the first elseif statement below
async function server_handler(request, response) {
    if (request.url === '/' ) { // Default to index page?
        file_path = pages_path + '/html/index.html';
        content_type = 'text/html';
    }
    else if (request.url === '/songs') {
        file_path = pages_path + '/html/songs.html'
        content_type = 'text/html';
    }
    else if (request.url.substr(0,9) === '/requests') {
        handle_posts_requests(request, response);
        return;
    }
    else { // Likely a request for a specific resource
        const extension = request.url.split('.').pop(); // gives us the last string preceeded by ".", should be file extension
        file_path = '.' + request.url;
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
        else if (extension === 'ico') {
            content_type = 'image/x-icon'
            file_path = pages_path + '/data/' + request.url;
        }
        else {
            content_type = 'text/plain';
        }
    }
    fs.readFile(file_path, function (err, content) {
        if (err) {
            console.log(err);
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
