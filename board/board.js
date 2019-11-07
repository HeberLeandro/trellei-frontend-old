//Nav items
var homeIcon = document.getElementById("homeIcon");
var imgLogo = document.getElementById("imgLogo");

//Menu user
var spanName = document.getElementById("spanName");
var title = document.getElementsByTagName("title");
var divMenuUser = document.getElementById("divMenuUser");
var spanMenuUser = divMenuUser.firstElementChild;
var background = document.getElementById("background");

//Change Name
var inputChangeName = document.getElementById("changeName");
var spanSize = document.getElementById("spanSize");

//Dropdowns itens
var Logout = document.getElementById("Logout");
var H6Name = document.getElementById("H6Name");
var spanUsername= document.getElementById("spanUsername");

var Board;
var token;
function verificaSessao(){
    if(sessionStorage.getItem("token")){
        token = JSON.parse(sessionStorage.getItem("token"));
    }else if (localStorage.getItem("token")) {
        token = JSON.parse(localStorage.getItem("token"));
    }else{
        window.location = "../index.html";
    }
    var user = JSON.parse(sessionStorage.getItem("user"));
    var name = user.name;
    var tmp = name.split(" ");
    for (let i = 0; i < tmp.length && i < 2; i++){
        spanMenuUser.innerHTML += tmp[i][0];
    }
    spanMenuUser.setAttribute("title", name + "("+ user.username +")");
    spanUsername.innerText = "("+ user.username + ")";
    H6Name.innerText = user.name;

    if (sessionStorage.getItem("BoardClicked")) {
        Board = JSON.parse(sessionStorage.getItem("BoardClicked"));
        background.style.background = Board.bg;
        title[0].innerText = Board.name + " | Trellei";
        spanName.innerText = Board.name;
    }else{
        window.location = "../index.html";
    }
}

//sair da Conta
Logout.addEventListener("click", function(){
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    window.location = "../index.html";
});

//voltar para home
imgLogo.addEventListener("click", function(){
    window.location = "../user/mainpage.html";
});

homeIcon.addEventListener("click", function(){
    window.location = "../user/mainpage.html";
});

//mudar nome do quadro
inputChangeName.addEventListener("keydown", function(){
    spanSize.innerText = inputChangeName.value;
    console.log(window.getComputedStyle(spanSize).width);
    inputChangeName.style.width = window.getComputedStyle(spanSize).width;
});