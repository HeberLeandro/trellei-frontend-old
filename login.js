// Base URL
var BaseURL = "http://localhost:8080/api/v1/"


// Divs Login, Cadastro
var divLogin = document.getElementById("divLogin");
var divCadastro = document.getElementById("divCadastro");

//Alerts & Btns
var alertErroLogin = document.getElementById("alertErroLogin");
var alertErroCadastro = document.getElementById("alertErroCadastro");
var alertSucessoCadastro = document.getElementById("alertSucessoCadastro");
var btnErroLogin = document.getElementById("btnErroLogin");
var btnErroCadastro = document.getElementById("btnErroCadastro");
var btnSucessoCadastro = document.getElementById("btnSucessoCadastro");

// Forms
var formLogin = document.getElementById("formLogin");
var formCadastro = document.getElementById("formCadastro");

//Campos do form Cadastro
var firstnameCadastro = document.getElementById("firstnameCadastro");
var lastnameCadastro = document.getElementById("lastnameCadastro");
var emailCadastro = document.getElementById("emailCadastro");
var senhaCadastro = document.getElementById("senhaCadastro");

//Campos do form Login
var usernameLogin = document.getElementById("usernameLogin");
var senhaLogin = document.getElementById("senhaLogin");
var manterConectado = document.getElementById("manterConectado");

//elemeto a
var mostrarCadastro = document.getElementById("mostrarCadastro");
var mostrarLogin = document.getElementById("mostrarLogin");

verificaSessaoAberta();
/* Verifica sessão aberta */
function verificaSessaoAberta(){
    var token;
    if(sessionStorage.getItem("token")){
        token = JSON.parse(sessionStorage.getItem("token"));
    }else if (localStorage.getItem("token")) {
        token = JSON.parse(localStorage.getItem("token"));
    }else{
        return;
    }
    buscarUsuario(token);
}

//Pegar Nome do usuario
function buscarUsuario(token){
    var url = "https://tads-trello.herokuapp.com/api/trello/users/"+token;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var user = this.responseText;
            if(user != ""){
                sessionStorage.setItem("user",user);
                formLogin.submit();
            }
        }
    }
    
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url)); 
}

//evento do form Cadastro
formCadastro.addEventListener("submit",function(e){
    e.preventDefault();

    let url = BaseURL + "auth/register";

    let user = {
        "firstname": firstnameCadastro.value,
        "lastname": lastnameCadastro.value,
        "email": emailCadastro.value,
        "password": senhaCadastro.value
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
        if (response.ok) {
            response.json().then((responseJson) => {
                console.log(responseJson);
                alertSucessoCadastro.style.display = "block";
                formCadastro.reset();
                divCadastro.style.display = "none";
                divLogin.style.display = "block";
            })
        }

       else if (response.status == 400) {
            response.json().then((responseJson) => {
                console.log(responseJson);
            })
        }

       else if(response.status == 409) {
            response.json().then((responseJson) => {
                console.log(responseJson);
                alertErroCadastro.style.display = "block";
                emailCadastro.value = "";
                emailCadastro.focus();
            })
        }
      });
});

//evento do form Login
formLogin.addEventListener("submit",function(e){
    e.preventDefault();
    var usuario = {
        "username": usernameLogin.value,
        "password": senhaLogin.value
    }
    
    var url = "https://tads-trello.herokuapp.com/api/trello/login";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            var token = JSON.stringify(obj.token);
            if(manterConectado.checked) localStorage.setItem("token", token);

            else sessionStorage.setItem("token", token);
            buscarUsuario(JSON.parse(token));

        }else if (this.readyState == 4 && this.status == 400){
            alertErroLogin.style.display = "block";
            formLogin.reset();
            usernameLogin.focus();
        }
    }
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(usuario));
});


// Show/hide Login e cadastro
mostrarCadastro.addEventListener("click", function(){
    divLogin.style.display = "none";
    divCadastro.style.display = "block";
});

mostrarLogin.addEventListener("click", function(){
    divCadastro.style.display = "none";
    divLogin.style.display = "block";
});

//Alerts Close
btnErroLogin.addEventListener("click", function(){
    alertErroLogin.style.display = "none";
});

btnErroCadastro.addEventListener("click", function(){
    alertErroCadastro.style.display = "none";
});

btnSucessoCadastro.addEventListener("click", function(){
    alertSucessoCadastro.style.display = "none";
});