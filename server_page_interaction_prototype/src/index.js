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
            console.log(document.cookie[5]);
            userCounter = parseInt(currentCount) + 1;
            setCookie('User', userCounter, 1);
        }

        // xmlhttp.send(content);
    }
}

send_request();