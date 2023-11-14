const baseUrl = "https://b1messenger.imatrythis.tk/"

const formulaire = document.querySelector('.log')

const name = document.querySelector('#username')
const pass = document.querySelector('#password')

formulaire.addEventListener('submit', function (e){
    e.preventDefault()
    const corpsRequeteLogin = {
        username : name.value,
        password : pass.value
    }

    const loginParams = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsRequeteLogin)
    }

    fetch(`${baseUrl}login`, loginParams)
        .then(response=>response.json())
        .then(data=> console.log(data.token))

})











