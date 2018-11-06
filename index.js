/*
* Constants
*/
const AuthorizationForm =
    `<div class="Rectangle-3">

                <div class="login_text">Log in</div>
                <div class="input_box">
                    <input id="email" type="text" class="InInput" placeholder="Email" autofocus/>
                </div>
                <div class="input_box_pass">
                    <input id="password" type="password" class="InInput" placeholder="Password"/>
                </div>
                <div id="error_box"></div>
                <div class="submit_btn_box">
                    <button id="submit_btn" type="submit" class="submit_btn">Login</button>
                </div>

        </div>`;

/*
* Variables
*/
let error_box = document.getElementById('error_box');
let email_form = document.getElementById('email');
let password_form = document.getElementById('password');
let xhr = null;
let authorization_form = document.getElementById("authorization-form");

/*
* Function for form validation
* return boolean
*/
function formValidationError(focus_element, error_text) {
    error_box.hidden = false;
    document.getElementById(focus_element).focus();
    error_box.innerText = error_text;
    return false;
}

/*
* Show message when server return error
*/
function incorrectEmailPass() {
    error_box.hidden = false;
    email_form.style.borderColor = '#ed4159';
    email_form.style.color = '#ed4159';
    email_form.addEventListener('click', function () {
        email_form.style.borderColor = '#f1f1f1';
        email_form.style.color = '#262626';
    });
    error_box.innerText = 'E-Mail or password is incorrect';//JSON.parse(xhr.responseText).error;
}

/*
* Stage response from the server
*/
function onReadyState() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            let request = JSON.parse(xhr.responseText);

            authorization_form.innerHTML =
                '<div class="logout_grid">\n' +
                '                    <img class="Oval-2" src="' + request.photoUrl + '" />\n' +
                '                    <div class="Name">' + request.name + '</div>\n' +
                '                    <div class="submit_btn_box_logout">\n' +
                '                        <button id="logout_btn" class="submit_btn">Login</button>\n' +
                '                    </div>\n' +
                '                </div>';

            document.getElementById('logout_btn').addEventListener('click', function () {
                document.getElementById('error_box').hidden = true;
                authorization_form.innerHTML = AuthorizationForm;
            });
        } else {
            incorrectEmailPass();
        }
    } else {
        error_box.hidden = false;
        error_box.innerText = 'Something went wrong!';
    }
}

/*
* Main function
*/
function main() {
    error_box.hidden = true;
    authorization_form.onsubmit = function onSubmit() {
        let submit_btn = document.getElementById('submit_btn');
        submit_btn.setAttribute("disabled", "disabled");
        xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://us-central1-mercdev-academy.cloudfunctions.net/login', true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = onReadyState;

        if (email_form.value.length < 5)
            formValidationError('email', 'Email too short');
        else if (password_form.value.length < 4)
            formValidationError('password', 'Password is too short');

        if (email_form.value.length >= 5 && password_form.value.length >= 4)
            xhr.send(JSON.stringify({email: email_form.value, password: password_form.value}));
        submit_btn.removeAttribute("disabled");
        return false;
    };
}

window.onload = main;
