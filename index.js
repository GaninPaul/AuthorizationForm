/**
 * Constants
 */
const AuthorizationForm =
    `<div class="rounded-rectangle">
                <div class="rounded-rectangle-header-logo">Log in</div>
                <div class="input-box-for-email">
                    <input id="email" type="email" class="input" placeholder="E-mail" autofocus/>
                </div>
                <div class="input-box-for-pass">
                    <input id="password" type="password" class="input" placeholder="Password"/>
                </div>
                <div id="error-box"></div>
                <div class="submit-box">
                    <button id="submit_btn" type="submit" class="submit-btn">Login</button>
                </div>
            </div>`;

/**
 * Variables
 */
let error_box = document.getElementById('error-box');
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
        `<div class="rounded-rectangle">
            <img class="rounded-rectangle-user-photo" src="${request.photoUrl}" />
            <div class="rounded-rectangle-user-name">${request.name}</div>
            <div class="submit-box-logout">
                <button id="logout_btn" class="submit-btn">Logout</button>
            </div>
        </div>`;
    document.getElementById('logout_btn').addEventListener('click', function () {
        document.getElementById('error-box').hidden = true;
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
 * Async function to make request
 */
async function asyncRequest(xhr) {
    let request_data = await request(xhr);
    successLogin(request_data);
}

/**
 * Fail login
 * @param error_code
 */
function failLogin(error_code) {
    switch (error_code) {
        case 403:
            error_box.hidden = false;
            error_box.innerText = '403: Forbidden!';
            break;
        case 500:
            error_box.hidden = false;
            error_box.innerText = '500: Internal Server Error!';
            break;
        case 400:
            incorrectEmailPass();
            break;
        default:
            error_box.hidden = false;
            error_box.innerText = 'Something went wrong!';
            break;
    }
}

/**
 * Main function
 */
function main() {
    document.getElementById('error-box').hidden = true;
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
            asyncRequest(xhr).catch(failLogin);//request(xhr).then(successLogin).catch(failLogin);

        submit_btn.removeAttribute("disabled");
        return false;
    };
}

window.onload = main;
