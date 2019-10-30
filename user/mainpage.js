//Menu user
var divMenuUser = document.getElementById("divMenuUser");
var spanMenuUser = divMenuUser.firstElementChild;

//Dropdowns itens
var Logout = document.getElementById("Logout");
var H6Name = document.getElementById("H6Name");
var spanUsername= document.getElementById("spanUsername");

//lista de quadros
var listaQuadros = document.getElementById("listaQuadros");
var listaDeEventos;

//btns de cores
var btnCorAzul = document.getElementById("btnCorAzul");

//quadros
var criarQuadro = document.getElementById("criarQuadro");
var novoQuadro = document.getElementById("novoQuadro");
var novoQuadrobg = document.getElementById("novoQuadrobg");
var btnCloseNovoQuadro = document.getElementById("btnCloseNovoQuadro");

//form para novo quadro e campos
var formNovoQuadro = document.getElementById("formNovoQuadro");
var inputNomeDoQuadro = document.getElementById("nomeDoQuadro");
var btnCriarQuadro = document.getElementById("btnCriarQuadro");
var bgQuadro = document.getElementById("bgQuadro");

//Verificar se a sessão aberta e pega nome do user
var token;
var boardsList;
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
    getBoards();
}

function getBoards(){
    var url =  "http://tads-trello.herokuapp.com/api/trello/boards/"+token;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            boardsList = JSON.parse(this.responseText);
            for (let i = 0; i < boardsList.length; i++) {
                listarNovoBoard(boardsList[i]);
            }

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao listar quadros");
        }
    }
    
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

function listarNovoBoard(board){
    var li = document.createElement("li");
    var div = document.createElement("div");
    var span = document.createElement("span");
    li.setAttribute("class", "col col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3 list-group-item");
    div.setAttribute("class", "quadro");
    div.setAttribute("id", board.id);
    span.innerHTML = board.name;
    div.style.backgroundColor = board.color;

    div.appendChild(span);
    li.appendChild(div);
    listaQuadros.insertAdjacentElement("afterbegin", li);
    div.addEventListener("click", function(){
        window.location = "../board/board.html?" + this.getAttribute("id");
    });
}

//Abilitar/Desabilitar Botão
inputNomeDoQuadro.addEventListener("keyup", function(){
    if(inputNomeDoQuadro.value == "") btnCriarQuadro.disabled = true;
    else btnCriarQuadro.disabled = false;
});

//abre janela para criação do novo quadro
criarQuadro.addEventListener("click", function(){
    novoQuadrobg.style.display = "flex";
    inputNomeDoQuadro.focus();
});

//criar novo quadro
formNovoQuadro.addEventListener("submit", function(e){
    e.preventDefault();
    cor = getComputedStyle(bgQuadro);
    var quadro = {
        "name": inputNomeDoQuadro.value,
        "color": cor.backgroundColor,
        "token": token
    }

    var url =  "https://tads-trello.herokuapp.com/api/trello/boards/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            listaQuadros[length] = obj;
            listarNovoBoard(obj);
            novoQuadrobg.style.display = "none";

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao criar novo quadro");
            novoQuadrobg.style.display = "none";
        }
    }
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(quadro));
});

//fecha criação do novo quadro
novoQuadrobg.addEventListener("click", function(){
    this.style.display = "none";
    inputNomeDoQuadro.value = "";
});

btnCloseNovoQuadro.addEventListener("click", function(){
    novoQuadrobg.style.display = "none";
    inputNomeDoQuadro.value = "";
    btnCriarQuadro.disabled = true;
});

formNovoQuadro.addEventListener("click",function(e){
    e.stopPropagation();
});

novoQuadro.addEventListener("click", function(e){
    e.stopPropagation();
});

btnCorAzul.addEventListener("click", function(e){
    e.stopPropagation();
    cor = getComputedStyle(btnCorAzul);
    bgQuadro.style.backgroundColor = cor.backgroundColor;

});

//mudar Cor do Novo board
function mudarCor(btn){
    cor = getComputedStyle(btn);
    bgQuadro.style.backgroundColor = cor.backgroundColor;
}

//sair da Conta
Logout.addEventListener("click", function(){
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    window.location = "../index.html";
});