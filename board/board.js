//Para criação da nova Lista
var inputNomeDaLista = document.getElementById("nomeDaLista");
var btnCriarLista = document.getElementById("btnCriarLista");
var formNovaLista = document.getElementById("formNovaLista");
var novaLista = document.getElementById("novaLista");

//div add Lista
var addLista = document.getElementById("divCriarLista");

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

var Listas;
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

    //getListas();
}

function adicionarLista(lista) {
    var divLista = document.createElement("div");
    divLista.setAttribute("class", "lista flex-column col-2");
    divLista.setAttribute("id", lista.id);

    var divNomeLista = document.createElement("div");
    divNomeLista.setAttribute("class", "divNomeLista align-items-center");
    var span = document.createElement("span");
    span.setAttribute("class", "nome-lista");
    span.innerText = lista.name;
    divNomeLista.appendChild(span);
    divLista.appendChild(divNomeLista);

    addLista.insertAdjacentElement("beforebegin", divLista);
    
}

function getListas(){
    var url =  " https://tads-trello.herokuapp.com/api/trello/lists/"+token+"/board/"+Board.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            Listas = JSON.parse(this.responseText);
            // console.log(Listas);
            for (let i = 0; i < Listas.length; i++) {
                adicionarLista(Listas[i]);
                
            }
            
        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao Buscar Listas");
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

//Abilitar/Desabilitar Botão quer Cria Lista
inputNomeDaLista.addEventListener("keypress", function(){
    btnCriarLista.disabled = false;
});
inputNomeDaLista.addEventListener("keyup", function(){
    if (inputNomeDaLista.value == "") {
        btnCriarLista.disabled = true;
    }
});
//criar nova Lista
formNovaLista.addEventListener("submit", function(e){
    e.preventDefault();
    var lista = {
        "name": inputNomeDaLista.value,
        "token": token,
        "board_id": Board.id
    }

    var url =  "https://tads-trello.herokuapp.com/api/trello/lists/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            adicionarLista(obj);
            novaListabg.style.display = "none";

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao criar nova lista");
            novaListabg.style.display = "none";
        }
    }
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(lista));
});