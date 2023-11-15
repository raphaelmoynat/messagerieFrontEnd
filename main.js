const baseUrl = "https://b1messenger.imatrythis.tk/"

const buttonLogIn = document.querySelector('#logIn')
const form = document.querySelector('.form')
const name = document.querySelector('#username')
const pass = document.querySelector('#password')
const textErreur = document.querySelector('.textErreur')
const conv = document.querySelector('.conv')

buttonLogIn.addEventListener('click',  () =>{

    getToken().then(response=>{
        console.log(response.message)
       if (response.message == "Invalid credentials."){
           textErreur.innerHTML += "Identifiants incorrects."
       }
       else{
           let token = response.token
           form.classList.add('d-none')
           conv.classList.remove('d-none')
           getMessages(token)






       }
    })




})


async function getToken(){
    const corpsRequeteLogin = {
        username : name.value,
        password : pass.value
    }

    const loginParams = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsRequeteLogin)
    }

    return await fetch(`${baseUrl}login`, loginParams)
        .then(response=>response.json())
        .then(data=>{
            return data
        })
}

async function getMessages(token)
{
    const messagesListParams = {
        method : 'GET',
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
    }

    return await fetch(`${baseUrl}api/messages`, messagesListParams)
        .then(response=>response.json())
        .then(data=>{
            let allMessage = data

            allMessage.forEach((message)=>{
                let dateCreation = new Date(message.createdAt)
                let heures = dateCreation.getHours()
                let minutes = dateCreation.getMinutes()
                conv.innerHTML += `
                <div class="d-flex mb-2">
                    <div class="mb-1 pr-2">${message.author.username} <span class="px-1 ">:</span></div>
                    <div class="">${message.content}</div>
                    <div class="px-2">${heures}:${minutes}</div>

                </div>
                `
            })
        } )
}













