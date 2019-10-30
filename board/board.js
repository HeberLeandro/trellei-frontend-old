//Menu user
var title = document.getElementsByTagName("title");
var divMenuUser = document.getElementById("divMenuUser");
var spanMenuUser = divMenuUser.firstElementChild;
var background = document.getElementById("background");

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
    for (let i = 0; i < tmp.length; i++){
        spanMenuUser.innerHTML += tmp[i][0];
    }
    spanMenuUser.setAttribute("title", name + "("+ user.username +")");
    spanUsername.innerText = "("+ user.username + ")";
    H6Name.innerText = user.name;

    var url = window.location.href;
    var idBoard = url.split("?");

    console.log(idBoard[1]);
    console.log(token);

    if (idBoard[1] == null) {
        window.location = "../user/mainpage.html";
    }else{
        getBoard(idBoard[1]);
    }
}

function getBoard(idBoard){
    var url = "https://tads-trello.herokuapp.com/api/trello/boards/"+ token+"/"+idBoard;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            Board = JSON.parse(this.responseText);
            console.log(Board[0]);
            background.style.backgroundColor = Board[0].color;
            title[0].innerText = "Board | " + Board[0].name;

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro buscar quadro");
        }
    }
    
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

//sair da Conta
Logout.addEventListener("click", function(){
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    window.location = "../index.html";
});
