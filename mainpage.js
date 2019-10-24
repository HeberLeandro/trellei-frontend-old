
//Verificar Usuario Logado

if(!localStorage.getItem("token")){
    if(!sessionStorage.getItem("token")){
    window.location = "index.html";
    }
} 

var token = JSON.parse(localStorage.getItem("token"));

console.log(token);