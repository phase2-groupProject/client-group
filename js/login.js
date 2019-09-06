$("#register-form").submit(function (event) {
    event.preventDefault()
    console.log('submited')
    axios({
            method: 'post',
            url: 'http://localhost:3000/user/register',
            data: {
                "name": $('#reg-name').val(),
                "email": $('#reg-email').val(),
                "password": $('#reg-password').val()
            },
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        })
        .then((response) => {
            localStorage.setItem("token", data.token)
            showMain()
        })
        .catch((err) => {
            console.log(err)
        });
});

$("#login-form").submit(function (event) {
    event.preventDefault()
    console.log('submited')
    axios({
            method: 'post',
            url: 'http://localhost:3000/user/signIn',
            data: {
                "email": $('#login-email').val(),
                "password": $('#login-password').val()
            },
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        })
        .then(({
            data
        }) => {
            localStorage.setItem("token", data.token)
            showMain()
        })
        .catch((err) => {
            console.log(err)
        });
});

$('#logout').click(event => {
    event.preventDefault()
    if (gapi.auth2) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            localStorage.removeItem("token")
            showLogin()
        })
    } else {
        localStorage.removeItem("token")
        showLogin()
    }
})

function onSignIn(googleUser) {
    
    const id_token = googleUser.getAuthResponse().id_token;

    const options = {
        method: 'POST',
        headers: {
            id_token
        },
        url: 'http://localhost:3000/user/oauth/login',
    };
    axios(options)
        .then(({
            data
        }) => {
            localStorage.setItem("token", data.token)
            showMain()
        })
        .catch((error) => {
            console.log(error);
        });
}