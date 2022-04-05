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

async function postLogin(data) {
    const response = await fetch('/posts/requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
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

loginRedirect.onclick = (()=> {
    /* 
        use conditional logic to check if login text & login password exist in database 
        if password user doesn't exist in database, then render error banner
        else link to user's page
    */
    location.href = "/user/";
});
