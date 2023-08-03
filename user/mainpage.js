// Base URL
var BaseURL = "http://localhost:8080/api/v1/"


var divUserHome = document.getElementById("divUserHome");
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
var userAuth;
var boardsList;
verificaSessao();

function verificaSessao(){
    if(sessionStorage.getItem("userAuth")){
        userAuth = JSON.parse(sessionStorage.getItem("userAuth"));
    }else if (localStorage.getItem("userAuth")) {
        userAuth = JSON.parse(localStorage.getItem("userAuth"));
    }else{
        window.location = "../index.html";
    }
    var user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user);
    let fullName = user.firstName+" "+user.lastName;
    spanMenuUser.innerText = user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
    spanMenuUser.setAttribute("title", fullName + "("+ user.email +")");
    spanUsername.innerText = "("+ user.email + ")";
    H6Name.innerText = fullName;
    getBoards();
}

function getBoards(){
    var url =  BaseURL + "boards/"+ userAuth.userId;

    fetch(url, {
        headers: {
            Authorization: 'Bearer '+userAuth.token,
        }}).then(resp => {
            if (resp.status == 200) {
                resp.json().then((boardListObj) => {
                    for (let i = 0; i < boardListObj.length; i++) {
                        listarNovoBoard(boardListObj[i]);
                    }
                })
            }    
            else {
              alert("Erro ao listar quadros");
            }
    });
}

function listarNovoBoard(board){
    var li = document.createElement("li");
    var div = document.createElement("div");
    var span = document.createElement("span");
    li.setAttribute("class", "col col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3 list-group-item");
    div.setAttribute("class", "quadro");
    span.innerHTML = board.name;
    div.style.backgroundColor = board.color;

    div.appendChild(span);
    li.appendChild(div);
    listaQuadros.insertAdjacentElement("afterbegin", li);

    div.addEventListener("click", function(){
        var BoardClicked = {
            "id":board.id,
            "name":board.name,
            "color":board.color
        };
        sessionStorage.setItem("BoardClicked", JSON.stringify(BoardClicked));
        window.location = "../board/board.html";
    });
}

//abre janela para criação do novo quadro
criarQuadro.addEventListener("click", function(){
    divUserHome.classList.remove("overflow-auto");
    hideOrShow(novoQuadrobg, 'flex');
    inputNomeDoQuadro.focus();
});

//criar novo quadro
formNovoQuadro.addEventListener("submit", function(e){
    e.preventDefault();

    cor = getComputedStyle(bgQuadro);
    var url =  BaseURL+"boards";

    var createBoard = {
        "name": inputNomeDoQuadro.value,
        "color": cor.backgroundColor
    }

        // Options to be given as parameter 
    // in fetch for making requests
    // other then GET
    let options = {
        method: 'POST',
        body: JSON.stringify(createBoard),
        headers: {"Content-type": "application/json; charset=UTF-8",  "Authorization": 'Bearer '+userAuth.token},
    }

    fetch(url, options).then(response => {
        if (response.status == 200) {
            response.json().then((boardResp) => {
            hideOrShow(novoQuadrobg, 'none');
            inputNomeDoQuadro.value = "";
            divUserHome.classList.add("overflow-auto");
            listarNovoBoard(boardResp);

            })
        } else {
            alert("Erro ao criar novo quadro");
            hideOrShow(novoQuadrobg, 'none');
            inputNomeDoQuadro.value = "";
            divUserHome.classList.add("overflow-auto");
        }
    });
});

//fecha criação do novo quadro
novoQuadrobg.addEventListener("click", function(){
    hideOrShow(this, 'none');
    inputNomeDoQuadro.value = "";
    divUserHome.classList.add("overflow-auto");
});

btnCloseNovoQuadro.addEventListener("click", function(){
    hideOrShow(novoQuadrobg, 'none');
    inputNomeDoQuadro.value = "";
    divUserHome.classList.add("overflow-auto");
});

formNovoQuadro.addEventListener("click",function(e){
    e.stopPropagation();
});

novoQuadro.addEventListener("click", function(e){
    e.stopPropagation();
});


//mudar Cor do Novo board
function mudarCor(btn){
    cor = getComputedStyle(btn);
    bgQuadro.style.backgroundColor = cor.backgroundColor;
}

function hideOrShow(element, display){
    if (display == 'block'){
        if(typeof(element)  === 'string'){
            document.getElementById(element).classList.remove("display-none", "display-flex");
            document.getElementById(element).classList.add("display-block");
        }else{
            element.classList.remove("display-none", "display-flex");
            element.classList.add("display-block");
        }
    } 
    else if (display == 'none'){
        if(typeof(element)  === 'string'){
            document.getElementById(element).classList.remove("display-block", "display-flex");
            document.getElementById(element).classList.add("display-none");
        }else{
            element.classList.remove("display-block", "display-flex");
            element.classList.add("display-none");
        }
    }
    else if (display == 'flex'){
        if(typeof(element)  === 'string'){
            document.getElementById(element).classList.remove("display-none", "display-block" );
            document.getElementById(element).classList.add("display-flex");
        }else{
            element.classList.remove("display-none","display-block");
            element.classList.add("display-flex");
        }
    }

}

//sair da Conta
Logout.addEventListener("click", function(){
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location = "../index.html";
});