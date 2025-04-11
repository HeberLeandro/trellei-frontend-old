// Base URL
var BaseURL = "http://localhost:8080/api/v1/"


// Divs Login, Cadastro
var divSingIn = document.getElementById("divSignIn");
var divSignUp = document.getElementById("divSignUp");

//Alerts & Btns
var alertDiv = document.getElementById("alertDiv");
var btnCloseAlert = document.getElementById("btnCloseAlert");
var alertHeading = document.getElementById("alertHeading");

// Forms
var formSingIn = document.getElementById("formSingIn");
var formSingUp = document.getElementById("formSingUp");

//Campos do form Cadastro
var firstnameSignUp = document.getElementById("firstnameSignUp");
var lastnameSignUp = document.getElementById("lastnameSignUp");
var emailSignUp = document.getElementById("emailSignUp");
var passwordSignUp = document.getElementById("passwordSignUp");

//Campos do form Login
var emailSignIn = document.getElementById("emailSignIn");
var passwordSignIn = document.getElementById("passwordSignIn");
var keepSigned = document.getElementById("keepSigned");

//elemeto a
var showSignUp = document.getElementById("showSignUp");
var showSignIn = document.getElementById("showSignIn");

verificaSessaoAberta();
/* Verifica sessão aberta */
function verificaSessaoAberta(){
    var userAuth;
    if(sessionStorage.getItem("userAuth")){
        userAuth = JSON.parse(sessionStorage.getItem("userAuth"));
    }else if (localStorage.getItem("userAuth")) {
        userAuth = JSON.parse(localStorage.getItem("userAuth"));
    }else{
        return;
    }
    buscarUsuario(userAuth);
}

//Pegar Nome do usuario
function buscarUsuario(userAuth){

    var url = BaseURL+"users/"+userAuth.userId;

    fetch(url, {
        headers: {
            Authorization: 'Bearer '+userAuth.token,
        }
    }) .then(resp => {
        if (resp.status == 200) {
            resp.json().then((resp) => {
                console.log(resp);
                sessionStorage.setItem("user", JSON.stringify(resp));
                location = 'user/mainpage.html';
            })
        } 
        else {
            localStorage.removeItem("userAuth");
            sessionStorage.clear();
        }
    })
}

//evento do form Cadastro
formSingUp.addEventListener("submit",function(e){
    e.preventDefault();

    let url = BaseURL + "auth/register";

    let user = {
        "firstname": firstnameSignUp.value,
        "lastname": lastnameSignUp.value,
        "email": emailSignUp.value,
        "password": passwordSignUp.value
    }

    // Options to be given as parameter 
    // in fetch for making requests
    // other then GET
    let options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }

    fetch(url, options).then(response => {
        if (response.status == 200) {
            response.json().then((responseJson) => {
                displayAlert("User created successfully.", "alert-success");
                formSingUp.reset();
                showSignIn.click();

            })
        }

       else if (response.status == 400) {
            response.json().then((responseJson) => {
                displayAlert("Umpossible to proceed.", "alert-danger", responseJson.errors);
            })
        }

       else if(response.status == 409) {
            response.json().then((responseJson) => {
                emailSignUp.value = "";
                displayAlert("Umpossible to proceed.", "alert-info", responseJson.errors);
            })
        }
      });
});

//evento do form Login
formSingIn.addEventListener("submit",function(e){
    e.preventDefault();

    let url = BaseURL + "auth/authenticate";
    let user = {
        "email": emailSignIn.value,
        "password": passwordSignIn.value
    }
    let options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }



    fetch(url, options).then(response => {
        if (response.status == 200) {
            response.json().then((responseJson) => {
                var userAuth = responseJson;
                if(keepSigned.checked) localStorage.setItem("userAuth", JSON.stringify(userAuth));

                else sessionStorage.setItem("userAuth", JSON.stringify(userAuth));
                buscarUsuario(userAuth);
            })
        }

        else {
            response.json().then((responseJson) => {
                passwordSignIn.value = "";
                passwordSignIn.focus();
                displayAlert("Email address / password combinations is incorrect.", "alert-danger");

            })
        }
      });
});


function displayAlert(header, divStyle, jsonMsg) {
    clearAlertDiv();
    alertDiv.style.display = "block";
    alertDiv.classList.add(divStyle);
    alertHeading.innerText = header;
    listJsonMessages(jsonMsg);
}

function listJsonMessages(jsonMsg) {
    if(jsonMsg === null || undefined) return;
    jsonMsg.forEach(text => {
        let line = document.createElement('hr');
        let paragraph = document.createElement('p');
        paragraph.innerText = text;
        alertDiv.appendChild(line);
        alertDiv.appendChild(paragraph)
    });
}

function clearAlertDiv(){
    document.querySelectorAll('#alertDiv > p,hr').forEach(el => {
        el.parentNode.removeChild(el)
    })
    alertDiv.classList.remove('alert-warning');
    alertDiv.classList.remove('alert-success');
    alertDiv.classList.remove('alert-danger');
    alertDiv.classList.remove('alert-info');
}

// Show/hide Login e cadastro
showSignUp.addEventListener("click", function(){
    divSingIn.style.display = "none";
    divSignUp.style.display = "block";
});

showSignIn.addEventListener("click", function(){
    divSignUp.style.display = "none";
    divSingIn.style.display = "block";
});

//Alert Close and clear
btnCloseAlert.addEventListener("click", function(){
    alertDiv.style.display = "none";
});