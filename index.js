/**
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

/**
 * Variables
 */
let error_box = document.getElementById('error_box');
let email_form = document.getElementById('email');
let password_form = document.getElementById('password');
let authorization_form = document.getElementById("authorization-form");

/**
 * Function for form validation
 * return boolean
 */
function formValidationError(focus_element, error_text) {
    error_box.hidden = false;
    document.getElementById(focus_element).focus();
    error_box.innerText = error_text;
    return false;
}

/**
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

/**
 * Function for XMLHttpRequest initializing
 * @param xhr
 */
function initializingXMLHttpRequest(xhr) {
    xhr.timeout = 2000;
    xhr.open("POST", 'https://us-central1-mercdev-academy.cloudfunctions.net/login', true);
    xhr.setRequestHeader("Content-type", "application/json");
}

/**
 * Make POST Request
 * @param xhr
 */
function request(xhr) {
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            } else {
                error_box.hidden = false;
                error_box.innerText = 'Something went wrong!';
            }
        };
        xhr.send(JSON.stringify({email: email_form.value, password: password_form.value}));
    });
}


/**
 * Success login
 * @param data
 */
function successLogin(data) {
    let request = JSON.parse(data);
    authorization_form.innerHTML =
        `<div class="logout_grid">
        <img class="Oval-2" src="${request.photoUrl}" />
        <div class="Name">${request.name}</div>
        <div class="submit_btn_box_logout">
        <button id="logout_btn" class="submit_btn">Logout</button>
        </div>
        </div>`;
    document.getElementById('logout_btn').addEventListener('click', function () {
        document.getElementById('error_box').hidden = true;
        authorization_form.innerHTML = AuthorizationForm;
    });
}

/**
 *
 * async function asyncRequest() {
 * return await request();
 * }
 */

/**
 * Fail login
 * @param error_code
 */
function failLogin(error_code) {
    if (error_code === 400) {
        incorrectEmailPass();
    } else if (error_code === 403) {
        error_box.hidden = false;
        error_box.innerText = '403: Forbidden!';
    } else if (error_code === 500) {
        error_box.hidden = false;
        error_box.innerText = '500: Internal Server Error!';
    } else {
        error_box.hidden = false;
        error_box.innerText = 'Something went wrong!';
    }
}

/**
 * Main function
 */
function main() {
    document.getElementById('error_box').hidden = true;
    authorization_form.onsubmit = function onSubmit() {
        let submit_btn = document.getElementById('submit_btn');
        let xhr = new XMLHttpRequest();

        submit_btn.setAttribute("disabled", "disabled");
        initializingXMLHttpRequest(xhr);

        if (email_form.value.length < 5)
            formValidationError('email', 'Email too short');

        else if (password_form.value.length < 4)
            formValidationError('password', 'Password is too short');

        if (email_form.value.length >= 5 && password_form.value.length >= 4)
            request(xhr).then(successLogin).catch(failLogin);

        submit_btn.removeAttribute("disabled");
        return false;
    };
}

window.onload = main;
