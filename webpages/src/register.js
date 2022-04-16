const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginButton = document.querySelector("label.login");
const signupButton = document.querySelector("label.signup");
const loginRedirect = document.querySelector("#submit-btn");
const signupLink = document.querySelector("form .signup-link a");

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path =/";
}

signupButton.onclick = (()=> {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginButton.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

signupLink.onclick = (()=>{
    signupButton.click();
    return false;
});

async function postSignup(data) {
    const response = await fetch('/requests/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

async function postLogin(data) {
    const response = await fetch('/requests/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

const handle_signup = (event) => {
    const form = new FormData(event.target);
    const username = form.get("username");
    const password = form.get("password");
    const re_password = form.get("re_password");

    if (password !== re_password) {
        alert("Passwords don't match!");
        return false;
    }

    const response = postSignup({Username: username, Password: password});
    response.then(data => {
        // Data will be an object with one or two keys. It has Accepted, a boolean indicating if
        // the signup request is accepted. If it is, then the object also has the key UserID, corresponding 
        // to the ID of the user in the database internally. This is insanely insecure but will work for our
        // demo.
        if (data.Accepted) {
            setCookie("UserID", data.UserID, 1);
            window.location.href = "/user";
        }
        else {
            alert("This username already exists!");    
        }
    })
    return false;
}

const handle_login = (event) => {
    const cd = document.cookie;
    const form = new FormData(event.target);
    const username = form.get("uname");
    const password = form.get("psw");
    const remember = form.get("remember")
    
    const response = postLogin({Username: username, Password: password});
    response.then(data => {
        // Data will be an object with one or two keys. It has Accepted, a boolean indicating if
        // the login request is accepted. If it is, then the object also has the key UserID, corresponding 
        // to the ID of the user in the database internally. This is insanely insecure but will work for our
        // demo.
        if (data.Accepted) {
            setCookie("UserID", data.UserID, 1);
            // Put logic for loading user profile page here
            window.location.href = "/user";
        }
        else {
            alert("Sorry that username or password was incorrect!")    
        }
    })
    return false;
}