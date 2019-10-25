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
var nomeCadastro = document.getElementById("nomeCadastro");
var usernameCadastro = document.getElementById("usernameCadastro");
var senhaCadastro = document.getElementById("senhaCadastro");

//Campos do form Login
var usernameLogin = document.getElementById("usernameLogin");
var senhaLogin = document.getElementById("senhaLogin");
var manterConectado = document.getElementById("manterConectado");

//elemeto a
var mostrarCadastro = document.getElementById("mostrarCadastro");
var mostrarLogin = document.getElementById("mostrarLogin");

/* Verifica sessão aberta */
function validaToken(){
    var tokenValido = false;
    if(localStorage.getItem("token")){
        var token = JSON.parse(localStorage.getItem("token"));
        var url = "https://tads-trello.herokuapp.com/api/trello/users/"+token;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var user = this.responseText;
                sessionStorage.setItem("user", user);
                tokenValido = true;
            }
            else if (this.readyState == 4 && this.status == 400) {
                localStorage.removeItem("token");
            }
        }
    
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(url));
    }

    if(sessionStorage.getItem("token")){
        var token = JSON.parse(sessionStorage.getItem("token"));
        var url = "https://tads-trello.herokuapp.com/api/trello/users/"+token;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var user = this.responseText;
                sessionStorage.setItem("user", user);
                tokenValido = true;
                if (tokenValido) {
                    formLogin.submit();
                }
            }
            else if (this.readyState == 4 && this.status == 400) {
                sessionStorage.removeItem("token");
            }
        }
    
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(url));
    }
};

//evento do form Cadastro
formCadastro.addEventListener("submit",function(e){
    e.preventDefault();
    var usuario = {
        "name": nomeCadastro.value,
        "username": usernameCadastro.value,
        "password": senhaCadastro.value
    }
        
    var url = "https://tads-trello.herokuapp.com/api/trello/users/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            alertSucessoCadastro.style.display = "block";
            formCadastro.reset();
            nomeCadastro.focus();
        }
    
        else if (this.readyState == 4 && this.status == 400) {
            alertErroCadastro.style.display = "block";
            usernameCadastro.value = "";
            usernameCadastro.focus();
        }
    }
    
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(usuario));

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
            if(manterConectado.checked) localStorage.setItem("token", JSON.stringify(obj.token));

            else sessionStorage.setItem("token", JSON.stringify(obj.token));
            
            formLogin.reset();
            formLogin.submit();
        }
        else if (this.readyState == 4 && this.status == 400){
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