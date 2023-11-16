const baseUrl = "https://b1messenger.imatrythis.tk/"


const content = document.querySelector('.content')
let token = null

function run(){
    if (!token){
        renderLoginForm()
    }
    else{
        fetchMessages().then(data=>{
           renderMessages(data)
            createFormMessage()

        })


    }

}

run()


function renderLoginForm(){
    let loginTemplate = `
    <div class="container form">
        <div class="fs-2 my-3">Login</div>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username">

            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="text" class="form-control" id="password">
            </div>
            <div class="textErreur mb-3"></div>
            <button type="submit" class="btn btn-primary" id="logIn">Log in</button>
    </div>
    `
    render(loginTemplate)
    const loginButton = document.querySelector('#logIn')
    loginButton.addEventListener('click', ()=>{
        login()
    })
}

function render(pageContent){
    content.innerHTML = ""
    content.innerHTML = pageContent
}

function login(){

    const username = document.querySelector('#username')
    const password= document.querySelector('#password')

    let corpsRequeteLogin = {
        username : username.value,
        password : password.value
    }

    const loginParams = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsRequeteLogin)
    }

    fetch(`https://b1messenger.imatrythis.tk/login`, loginParams)
        .then(response=>response.json())
        .then(data =>{
            if(data.message == "Invalid credentials.")
            {
                renderLoginForm()
            }else{
                token = data.token
                run()
            }
        })

}

async function fetchMessages(){
    const messagesParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "GET"
    }

    return await fetch(`https://b1messenger.imatrythis.tk/api/messages`, messagesParams)
        .then(response => response.json())
        .then(data =>{
            if(data.message == "Invalid credentials.")
            {
                renderLoginForm()
            }else{
                return data
            }
        })

}

function generateMessages(message){
    let divMessage = ` <div class="row">
                                    <div class="mb-2">${message.author.username} : ${message.content}</div>
                              </div>      
`
    return divMessage
}

function renderMessages(messages){
    let contentMessages = ""
    messages.forEach(message=>{
        contentMessages += generateMessages(message)
    })
    render(contentMessages)
}


function createFormMessage(){
    let formMessage = `
                            <div class="row">
                                <input type="text mb-2" class="form-control" id="messageContent">
                                <button type="button" class="btn btn-success" id="messageButton">Envoyer</button>
                            
                            </div>`
    content.innerHTML+=formMessage
    const messageButton = document.querySelector('#messageButton')
    messageButton.addEventListener('click', ()=>{
        postMessage()
    })
}


async function postMessage(){

    const message = document.querySelector('#messageContent')

    let corpsMessage = {
        content : message.value
    }

    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "POST",
        body :  JSON.stringify(corpsMessage)
    }

    return await fetch(`https://b1messenger.imatrythis.tk/api/messages/new`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run()
            console.log("coucou")
        })

}




















