const content = document.querySelector('.content')
let token = null
let messageId = null

function run(){
    if (!token){
        renderLoginForm()
    }
    else{
        fetchMessages().then(data=>{
           renderMessages(data)
            createFormMessage()
            deleteButton()
            editButton()
        })
    }
}

run()


function renderLoginForm(){
    let loginTemplate = `
    <div class="container form">
        <div class="fs-2 my-3">Login</div>
            <div class="mb-3">
                <label for="username" class="form-label fs-5">Username</label>
                <input type="text" class="form-control fs-5" id="username">

            </div>
            <div class="mb-3">
                <label for="password" class="form-label fs-5">Password</label>
                <input type="text" class="form-control fs-5" id="password">
            </div>
            <div class="textErreur mb-3"></div>
            <button type="submit" class="btn btn-primary fs-5" id="logIn">Log in</button>
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


let userName = ""
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
                userName = username.value
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
    let deleteButton = ''
    let editButton = ''
    let replyButton = ''

    if (message.author.username === userName) {
        deleteButton = `<i class="bi bi-trash3 delete fs-4" style="cursor: pointer;" id="${message.id}" ></i>
`
        editButton =   `<i class="bi bi-pencil edit fs-4" style="cursor: pointer;" id="${message.id}"></i>`
    }

    else{
        replyButton = '<i class="bi bi-arrow-up-right fs-5" style="cursor: pointer;"></i>'
    }


    let divMessage = `
        <div class="d-flex justify-content-between align-items-center mb-2 message" id="message-${message.id}">
           
            <div class="fs-5 d-flex col-10">
                <div class="col-4">${message.author.username} : </div> 
                <div class="col-6">${message.content}</div>
            </div>
            <div class="d-flex">
                <div class="mr-1">${deleteButton}</div>
                <div>${editButton}</div>
                <div>${replyButton}</div>
                
            </div>
            
        </div>`

    return divMessage
}

function renderMessages(messages){
    let contentMessages = ""
    messages.forEach(message=>{
        contentMessages += generateMessages(message)
    })
    render(contentMessages)
    deleteButton()
    editButton()
}


function createFormMessage(){
    let formMessage = `
                            <div class="row">
                                <input type="text mb-2" class="form-control border border-success fs-5" id="messageContent">
                                <button type="button" class="btn btn-success fs-5" id="messageButton">Envoyer</button>
                            
                            </div>`
    content.innerHTML+=formMessage
    const messageButton = document.querySelector('#messageButton')
    messageButton.addEventListener('click', () => {
        const messageContent = document.querySelector('#messageContent').value

        if (messageId) {
            editMessage(messageId)
        } else {
            postMessage(messageContent)
        }

        document.querySelector('#messageContent').value = ''
        messageId = null
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
        })

}


async function deleteMessage(idMessage){

    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "DELETE"
    }

    return await fetch(`https://b1messenger.imatrythis.tk/api/messages/delete/${idMessage}`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run()
        })
}


function deleteButton() {
    const deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            const messageId = button.id
            deleteMessage(messageId)
        })
    })
}

function editButton(){
    const editButtons = document.querySelectorAll('.edit')
    editButtons.forEach((button) => {
        button.addEventListener('click', ()=> {
            console.log("coucou")
            messageId = button.id
        })
    })
}

async function editMessage(idMessage){
    const messageContent = document.querySelector('#messageContent').value

    const modifiedMessage = {
        content: messageContent + " (edited)"
    }

    const messageParams = {
        method : "PUT",
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        body : JSON.stringify(modifiedMessage)
    }

    return await fetch(`https://b1messenger.imatrythis.tk/api/messages/${idMessage}/edit`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            messageId = null
            run()
        })
}


function replyButton(){

}



















