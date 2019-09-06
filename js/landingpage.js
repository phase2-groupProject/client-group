$(document).ready(function () {
    if (localStorage.getItem('token')) {
        $('#beforeIn').show()
        $('#login-container').hide()
        $('#landing-container').hide()
        $('#puter').show()
        $('#navIn').show()
        $('#second-step').show()
        $('#third-step').hide()
    } else {
        showQuotes()
        $('#beforeIn').hide()
        $('#login-container').hide()
        $('#landing-container').show()
        $('#puter').hide()
    }

    $("#register-form").submit(function (event) {
        event.preventDefault()
        Swal.fire({
            title: 'Registering Your Account...',
            allowOutsideClick: () => !Swal.isLoading()
        })
        Swal.showLoading()
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
                Swal.close()
                Swal.fire("Success!", "Your Account is Created!", "success");
                $('#beforeIn').hide()
                $('#login-container').show()
                $('#landing-container').hide()
                $('#puter').hide()
            })
            .catch((err) => {
                Swal.fire("Error!", err.message, "error");
            });
    });

    $("#login-form").submit(function (event) {
        event.preventDefault()
        Swal.fire({
            title: 'Loggin in...',
            allowOutsideClick: () => !Swal.isLoading()
        })
        Swal.showLoading()
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
                Swal.close()
                Swal.fire("Success!", "Logged in!", "success");
                localStorage.setItem("token", data.token)
                $('#beforeIn').show()
                $('#login-container').hide()
                $('#landing-container').hide()
                $('#puter').show()
                $('#navIn').show()
                $('#second-step').show()
                $('#third-step').hide()
            })
            .catch((err) => {
                Swal.fire("Error!", err.message, "error");
            });
    });


});

function showQuotes() {
    const options = {
        method: 'GET',
        url: 'https://api.adviceslip.com/advice',
    };

    axios(options)
        .then(({
            data
        }) => {
            let ad = `<h2>"${data.slip.advice}"</h2>`
            $('#quotes').prepend(ad)
        })
        .catch((error) => {
            console.log(error);
        });

    $('#quote')
}

function toLogin() {
    $('#beforeIn').hide()
    $('#login-container').show()
    $('#landing-container').hide()
    $('#puter').hide()
}

function submitMood() {
    let token = localStorage.getItem('token')
    Swal.fire({
        title: 'Checking your mood...',
        allowOutsideClick: () => !Swal.isLoading()
    })
    Swal.showLoading()
    axios({
        method: 'post',
        url: 'http://localhost:3000/movie/',
        headers: {
            token
        },
        data: {
            text: $('#search-box').val()
        }
    }).then(({
        data
    }) => {
        Swal.close()
        Swal.fire("Success!", `Your Mood Right Now is ${data.mood} !`, "success");
        $('#beforeIn').show()
        $('#login-container').hide()
        $('#landing-container').hide()
        $('#puter').show()
        $('#navIn').show()
        $('#second-step').hide()
        $('#third-step').show()
        for (let i = 0; i < data.kumpulan.length; i++) {
            let mov = data.kumpulan[i]
            let insert = `<div class="movie-detail col-12 col-sm-6 col-lg-4 d-flex justify-content-between align-items-center p-3 shadow-lg">
    <div class="movie-poster"><img class="poster-image" src="${mov.image}" alt="avenger poster">
    </div>
    <div class="movie-info d-flex flex-column justify-content-between align-items-start ml-3">
        <h3>${mov.title}</h3>
        <p>Overview :</p>
        <div>
            <p class="movie-description" style="max-width: 250px;max-height: 100px;text-align: justify">${mov.overview}</p>
        </div>
        <div class="d-flex justify-content-between align-items-center" style="width: 100%">
            <h6>${mov.vote_average}</h6>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick='giveTrailer("${mov.title}")'>
            See Trailer
      </button>
        </div>
    </div>
</div>`
            $('#recmov').prepend(insert)
        }
    }).catch(err => {
        Swal.fire("Error!", err.message, "error");
    })

}

function giveTrailer(name) {
    // $('#exampleModal').show();
    // $('.modal-backdrop').show();
    let token = localStorage.getItem('token')

    axios({
        method: 'get',
        url: `http://localhost:3000/movie/${name}`,
        headers: {
            token
        }
    }).then(({data}) => {
        let yutubs = `    
      
            <iframe width="480" height="360"
            src="https://www.youtube.com/embed/${data}">
            </iframe>
            
        `
        $('#trailerContent').html(yutubs)

    }).catch(err => {
        console.log(err)
        Swal.fire("Error!", err.message, "error");
    })
}
function closeTrailer(){
    console.log($('#exampleModal').modal)
    $('#exampleModal').modal('hide');
    // $('.modal-backdrop').hide();
}

function onSignIn(googleUser) {
    const idToken = googleUser.getAuthResponse().id_token;
    const options = {
        method: 'POST',
        data: {
            idToken
        },
        url: 'http://localhost:3000/user/gsignIn',
    };
    axios(options)
        .then(({
            data
        }) => {
            localStorage.setItem("token", data.token)
            $('#beforeIn').show()
            $('#login-container').hide()
            $('#landing-container').hide()
            $('#puter').show()
            $('#navIn').show()
            $('#second-step').show()
            $('#third-step').hide()
        })
        .catch((error) => {
            Swal.fire("Error!", error.message, "error");
        });
}

function signOut() {
    event.preventDefault()
    if (gapi.auth2) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            Swal.fire("Success!","Logout Success!", "success");
            localStorage.removeItem("token")
            showQuotes()
            $('#beforeIn').hide()
            $('#login-container').hide()
            $('#landing-container').show()
            $('#puter').hide()
            $('#navIn').hide()
            $('#second-step').hide()
            $('#third-step').hide()

        })
    } else {
        Swal.fire("Success!","Logout Success!", "success");
        localStorage.removeItem("token")
        showQuotes()
        $('#beforeIn').hide()
        $('#login-container').hide()
        $('#landing-container').show()
        $('#puter').hide()
        $('#navIn').hide()
        $('#second-step').hide()
        $('#third-step').hide()

    }
}