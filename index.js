window.onload = function () {
    document.getElementById('error_box').hidden = true;
    document.getElementById("authorization-form").onsubmit = function onSubmit() {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://us-central1-mercdev-academy.cloudfunctions.net/login', true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200){
                    let request = JSON.parse(xhr.responseText);

                    document.getElementById("authorization-form").innerHTML =
                        '<div class="logout_grid">\n' +
                    '                    <img class="Oval-2" src="'+request.photoUrl+'" />\n' +
                    '                    <div class="Name">'+request.name+'</div>\n' +
                    '                    <div class="submit_btn_box_logout">\n' +
                    '                        <button id="logout_btn" class="submit_btn">Login</button>\n' +
                    '                    </div>\n' +
                    '                </div>';

                    document.getElementById('logout_btn').addEventListener('click', function () {
                        document.getElementById('error_box').hidden = true;
                        document.getElementById("authorization-form").innerHTML =
                            `
                            <div class="Rectangle-3">

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

        </div>
                            `;
                    });
                }else{
                    document.getElementById('error_box').hidden = false;
                    document.getElementById('email').style.borderColor = '#ed4159';
                    document.getElementById('email').style.color = '#ed4159';
                    document.getElementById('email').addEventListener('click', function () {
                        document.getElementById('email').style.borderColor = '#f1f1f1';
                        document.getElementById('email').style.color = '#262626';
                    });
                    document.getElementById('error_box').innerText = 'E-Mail or password is incorrect';//JSON.parse(xhr.responseText).error;

                }
            }else{
                document.getElementById('error_box').hidden = false;
                                document.getElementById('error_box').innerText = 'Something went wrong!';
            }
        };
        if(email.length < 5){
            document.getElementById('error_box').hidden = false;
            document.getElementById("email").focus();
            document.getElementById('error_box').innerText = 'Email too short';
        }else
        if(password.length < 4){
            document.getElementById('error_box').hidden = false;
            document.getElementById("password").focus();
            document.getElementById('error_box').innerText = 'Password is too short';
        }
        if(email.length >= 5 && password.length >= 4)
            xhr.send( JSON.stringify({email: email, password: password}) );

        return false;
    };


};
