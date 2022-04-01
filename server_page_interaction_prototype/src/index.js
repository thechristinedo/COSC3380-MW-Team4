const Http = new XMLHttpRequest();

const url='localhost:8000';
const div = document.createElement('div');
const h4 = document.createElement('h4');
const a = document.createElement('a');
const img = document.createElement('img');

const body = document.querySelector('body');
body.append(div);
h4.append(a);
div.append(h4);
div.append(img);

a.innerHTML = "Flat-Twist With Twist Out"

div.setAttribute('class', 'card');

a.setAttribute('href', 'https://therighthairstyles.com/20-most-inspiring-natural-hairstyles-for-short-hair/')

img.setAttribute('src', 'https://i0.wp.com/therighthairstyles.com/wp-content/uploads/2014/03/13-flat-twist-with-twist-out-2.jpg?w=500&ssl=1')

function send_request() {
    Http.open("GET", '/data/data.json');

    Http.send();
}

Http.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText));
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/requests");
        xmlhttp.setRequestHeader("Content-type", "application/json");
        const content = JSON.stringify({'Username': 'First User', 'Password': '7654321'});
        xmlhttp.send(content);
    }
}

send_request();