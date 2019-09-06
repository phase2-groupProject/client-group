$(document).ready(function () {
    
    showQuotes()

});

function  showQuotes () {
    const options = {
        method: 'GET',
        url: 'https://api.adviceslip.com/advice',
    };

    axios(options)
        .then(({
            data
        }) => {
            console.log(data.slip.advice)
            let ad = `<h2>"${data.slip.advice}"</h2>`
            $('#quotes').prepend(ad)
        })
        .catch((error) => {
            console.log(error);
        });

    $('#quote')
}