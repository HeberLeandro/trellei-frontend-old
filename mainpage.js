//Menu user
var divMenuUser = document.getElementById("divMenuUser");
var spanMenuUser = divMenuUser.firstElementChild;

//Verificar se a sessão aberta e pega nome do user
function verificaSessao(){
    if(sessionStorage.getItem("token")){
        var token = JSON.parse(sessionStorage.getItem("token"));
    }else if (localStorage.getItem("token")) {
        var token = JSON.parse(localStorage.getItem("token"));
    }else{
        window.location = "index.html";
    }
    var user = JSON.parse(sessionStorage.getItem("user"));
    var name = user.name;
    var tmp = name.split(" ");
    for (let i = 0; i < tmp.length; i++){
        spanMenuUser.innerHTML += tmp[i][0];
    }
    spanMenuUser.setAttribute("title", name);
}


