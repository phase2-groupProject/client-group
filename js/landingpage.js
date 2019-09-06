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
                Swal.fire("Success!","Logged in!", "success");
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
                Swal.fire("Error!",err.message, "error");
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
            let insert = `<div class="movie-detail d-flex justify-content-between align-items-center p-3 shadow-lg">
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
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="giveTrailer('${mov.title}')">
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
    let token = localStorage.getItem('token')
    axios({
        method: 'get',
        url: `http://localhost:3000/movie/${name}`,
        headers: {
            token
        }
    }).then(({
        data
    }) => {

        let yutubs = `      
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            <iframe width="480" height="360"
            src="https://www.youtube.com/embed/${data}">
            </iframe>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
        `
        $('#exampleModal').html(yutubs)

    }).catch(err => {
        Swal.fire("Error!", err.message, "error");
    })
}

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