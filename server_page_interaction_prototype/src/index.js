const Http = new XMLHttpRequest();

const body = document.querySelector('body');

function send_request() {
    Http.open("GET", '/data/data.json');
    Http.send();
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path =/";
}

async function postLogin(data) {
    const response = await fetch('/posts/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

const handle_login = (event) => {
    const cd = document.cookie;
    const form = new FormData(event.target);
    const username = form.get("uname");
    const password = form.get("psw");
    
    const response = postLogin({Username: username, Password: password});
    response.then(data => {
        // Data will be an object with one or two keys. It has Accepted, a boolean indicating if
        // the login request is accepted. If it is, then the object also has the key UserID, corresponding 
        // to the ID of the user in the database internally. This is insanely insecure but will work for our
        // demo.
        if (data.Accepted) {
            console.log(data);
            setCookie("UserID", data.UserID, 1);
            // Put logic for loading user profile page here
        }
        else {
            alert("Sorry that username or password was incorrect!")    
        }
    })
    return false;
}

Http.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
        // const resp = JSON.parse(this.responseText);
        // for (const obj of resp) {
        //     const div = document.createElement('div');
        //     div.setAttribute('class', 'card');
        //     const h4 = document.createElement('h4');
        //     const a = document.createElement('a');
        //     const img = document.createElement('img');
        //     body.append(div);
        //     h4.append(a);
        //     div.append(h4);
        //     div.append(img);
        //     a.setAttribute('href', obj.info);
        //     img.setAttribute('src', obj.pic);
        //     a.innerHTML = obj.name;
        // }

        // const xmlhttp = new XMLHttpRequest();
        // xmlhttp.open("POST", "/requests");
        // xmlhttp.setRequestHeader("Content-type", "application/json");
        // const content = JSON.stringify({'Username': 'First User', 'Password': '7654321'});

        var userCounter;
        const loc = document.cookie.indexOf('User')
        if (loc  == -1) {
            userCounter = 1;
            setCookie('User', userCounter, 1);
        }
        else {
            const restOfString = document.cookie.substring(loc);
            const endOfCookie = restOfString.indexOf(';');
            var currentCount;
            if (endOfCookie == -1) {
                currentCount = restOfString.substring(5);
            }
            else {
                currentCount = restOfString.substring(5, endOfCookie);
            }
            userCounter = parseInt(currentCount) + 1;
            setCookie('User', userCounter, 1);
        }

        // xmlhttp.send(content);
    }
}

send_request();