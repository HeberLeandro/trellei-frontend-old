// Divs Login, Cadastro, Alerts
var divLogin = document.getElementById("divLogin");
var divCadastro = document.getElementById("divCadastro");

var alertErroLogin = document.getElementById("alertErroLogin");
var alertErroCadastro = document.getElementById("alertErroCadastro");
var alertSucessoCadastro = document.getElementById("alertSucessoCadastro");
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

//elemeto a
var mostrarCadastro = document.getElementById("mostrarCadastro");
var mostrarLogin = document.getElementById("mostrarLogin");

/*

            LEMBRAR DO MANTER CONECTADO NO LOGIN.

*/ 

//evento do form Cadastro
formCadastro.addEventListener("submit",function(e){
    e.preventDefault();
    var usuario = {
        "name": nomeCadastro.value,
        "username": usernameCadastro.value,
        "password": senhaCadastro.value
    }
        
        var url = "http://tads-trello.herokuapp.com/api/trello/users/new";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                alert("Usuário Cadastrado com sucesso!");
            }
        
            else if (this.readyState == 4 && this.status == 400) {
                alert("Este usuário ja foi cadastrado.");
                formCadastro.reset();
                nomeCadastro.focus();
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
        
        var url = "http://tads-trello.herokuapp.com/api/trello/login";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                console.log(obj);
                formLogin.reset();
                formLogin.submit();
            }
            else if (this.readyState == 4 && this.status == 400){
                alert("Login ou Senha incorretos.");
                formLogin.reset();
                usernameLogin.focus();
            }
        }
        
        console.log(JSON.stringify(usuario));
        
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