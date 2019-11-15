//Para criação da nova Lista
var inputNomeDaLista = document.getElementById("inputNomeDaLista");
var btnCriarLista = document.getElementById("btnCriarLista");
var formNovaLista = document.getElementById("formNovaLista");
var divFormList = document.getElementById("divFormLista");

//div add Lista
var addLista = document.getElementById("liCriarLista");

//Nav items
var homeIcon = document.getElementById("homeIcon");
var imgLogo = document.getElementById("imgLogo");

//Menu user
var spanName = document.getElementById("spanName");
var title = document.getElementsByTagName("title");
var divMenuUser = document.getElementById("divMenuUser");
var spanMenuUser = divMenuUser.firstElementChild;
var background = document.getElementById("background");

//Mudar nome do Quadro
var inputNomeQuadro = document.getElementById("inputNomeQuadro");
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
        background.style.background = Board.color;
        title[0].innerText = Board.name + " | Trellei";
        spanName.innerText = Board.name;
    }else{
        window.location = "../index.html";
    }

    getListas();
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

function adicionarLista(lista) {
    var liLista = document.createElement("li");
    liLista.setAttribute("class", "lista flex-column col col col-11 col-sm-5 col-md-3 col-lg-3 col-xl-2");
    liLista.setAttribute("id", lista.id);

    var divNomeLista = document.createElement("div");
    divNomeLista.setAttribute("class", "divNomeLista align-items-center");
    var span = document.createElement("span");
    span.setAttribute("class", "nome-lista");
    span.innerText = lista.name;
    divNomeLista.appendChild(span);
    liLista.appendChild(divNomeLista);

    //add card/ div collapse
    var divAddCard = document.createElement("div");
    divAddCard.setAttribute("class", "card add-card text-nao-selecionavel");
    divAddCard.setAttribute("id", "divAddCard"+lista.id);
    divAddCard.setAttribute("onclick", "hideOrShow('spanAddCard"+lista.id+"', 'none')");
    divAddCard.setAttribute("data-toggle", "collapse");
    divAddCard.setAttribute("href","#divFormCard"+lista.id);
    divAddCard.innerHTML = '<span id="spanAddCard'+lista.id+'" class="span-Add-Card">+ Adicionar cartão</span>' +
                            '<div class="collapse px-0" id="divFormCard'+lista.id+'" onclick="event.stopPropagation()">'+
                                '<form method="post" id="formNovoCard'+lista.id+'">'+
                                    '<h6 class="resize-textarea" id="resizeTextarea'+lista.id+'"></h6>'+
                                    '<textarea autofocus class="form-control mr-1 textarea-nome-do-card" id="inputNomeDoCard'+lista.id+'" placeholder="Titulo do cartão..." required maxlength="100"></textarea>' +
                                    '<div class="d-flex justify-content-between">'+
                                        '<input type="submit" class="mt-2 form-control btn-Criar-Card btn" id="btnCriarCard'+lista.id+'" value="Criar">'+
                                        '<button type="button" class="close mr-1" aria-label="Close" onclick="resetForm(\'spanAddCard'+lista.id+'\',\'btnCriarCard'+lista.id+'\', \'formNovoCard'+lista.id+'\', \'divFormCard'+lista.id+'\')">'+
                                            '<span aria-hidden="true">&times;</span> </button> </div> </form> </div>';

    liLista.appendChild(divAddCard);
    addLista.insertAdjacentElement("beforebegin", liLista);
    addEvents(lista.id);
    getCards(lista.id, divAddCard);

}

function getCards(lista_id, element){

    var url =  "https://tads-trello.herokuapp.com/api/trello/cards/"+token+"/list/"+lista_id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var cards = JSON.parse(this.responseText);
            for (let i = 0; i < cards.length; i++) {
                adicionarCard(cards[i], element);
            }

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro Buscar Cartões");
        }
    }
    
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));

}

//Adiciona Cards as suas respectivas Listas
function adicionarCard(card, element){
    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card text-nao-selecionavel");
    divCard.setAttribute("id", card.id);
    var span = document.createElement("span");
    span.innerText = card.name;

    divCard.appendChild(span);

    element.insertAdjacentElement("beforebegin", divCard);
}


//função para resetar os form que cria lista e cartões
function resetForm(span, btn, form, div){
    document.getElementById(form).reset();
    hideOrShow(document.getElementById(span), 'block');
    document.getElementById(div).className = "collapse";
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

//Função para adicionar eventos nos forms das listas, para criação de cards
function addEvents(lista_id){
    let form = document.getElementById('formNovoCard'+lista_id);
    let inputText = document.getElementById('inputNomeDoCard'+lista_id);
    let resizeTextarea = document.getElementById('resizeTextarea'+lista_id);

    //Criar Card
    form.addEventListener("submit", function(e){
        e.preventDefault();
        submitCard();
    });

    inputText.addEventListener("input", function(e){
        resizeTextarea.innerText = inputText.value;
        resizeTextarea.style.width = getComputedStyle(inputText).width;
        console.log(getComputedStyle(inputText).width);
        inputText.style.height = window.getComputedStyle(resizeTextarea).height;
    });

    inputText.addEventListener("keypress",function(e){
        if (e.keyCode == 13) {
            submitCard();
        }
    });

    function submitCard(){
        inputText.value = inputText.value.trim();
        var corte = inputText.value.split(" ");
        var name = "";
        for (let i = 0; i < corte.length; i++) {
            if (corte[i] != "" && corte[i] != "\n") {
                if (i == 0) {
                    name += corte[i];
                }else{
                    name += " " + corte[i];
                }
            }
        }
        if (name == "") {
            inputText.value="";
            inputText.focus();
            return;
        }
        var data = new Date();
        var DiaMesAno = data.getDate() + "/" + (data.getMonth()+1) + "/" + data.getFullYear();

        var card = {
            "name": name,
            "data": DiaMesAno,
            "token": token,
            "list_id": lista_id
        }
    
        var url =  "https://tads-trello.herokuapp.com/api/trello/cards/new";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                inputText.value = "";
                adicionarCard(obj, document.getElementById("divAddCard"+lista_id));

    
            }else if (this.readyState == 4 && this.status == 400){
                alert("Erro ao criar novo Cartão");
            }
        }
        
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(card));
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

//altera largura do input, para novo nome do quadro
inputNomeQuadro.addEventListener("keydown", function(){
    changeInputsize();
});

function changeInputsize(){
    spanSize.innerText = inputNomeQuadro.value;
    inputNomeQuadro.style.width = window.getComputedStyle(spanSize).width;
}

//mostra o input para fazer a alteração do nome
spanName.addEventListener("click", function(){
    hideOrShow(spanName, 'none');
    hideOrShow(inputNomeQuadro, 'block');
    inputNomeQuadro.value = spanName.innerText;
    changeInputsize();
    inputNomeQuadro.focus();
});

//Fechar o input mostra o name de volta
inputNomeQuadro.addEventListener("keyup", function(e){
    if (e.keyCode == 13) {
        changeName();    
        hideOrShow(inputNomeQuadro, 'none');
        hideOrShow(spanName, 'block');
    }
});

inputNomeQuadro.addEventListener("focusout", function(e){
    if(inputNomeQuadro.classList.contains("display-block")){
        changeName();    
        hideOrShow(inputNomeQuadro, 'none');
        hideOrShow(spanName, 'block');
    }
});

//Muda o nome do Quadro
function changeName(){
    var corte = inputNomeQuadro.value.split(" ");
    var name = "";
    for (let i = 0; i < corte.length; i++) {
        if (corte[i] != "") {
            if (i == 0) {
                name += corte[i];
            }else{
                name += " " + corte[i];
            }
        }
    }
    if(name == spanName.innerText){
        return;
    } else {
        if (name != "") {
            var newName = {
                "board_id": Board.id,
                "name": name,
                "token": token
            }
    
            var url =  "https://tads-trello.herokuapp.com/api/trello/boards/rename";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.responseText);
                    Board.name = obj.name;
                    sessionStorage.setItem("BoardClicked", JSON.stringify(Board));
                    spanName.innerText = name;
    
                }else if (this.readyState == 4 && this.status == 400){
                    alert("Erro ao Renomear Quadro");
                }
            }
            
            xhttp.open("PATCH", url, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newName));
         
         }
    }
}

//Mudar Cor do Quadro
function changeColor(btn){

    cor = getComputedStyle(btn);
    if (cor.backgroundColor == Board.color) {
        return;
    }
    var newColor = {
        "board_id": Board.id,
        "color": cor.backgroundColor,
        "token": token
    }

    var url =  "https://tads-trello.herokuapp.com/api/trello/boards/newcolor";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            Board.color = background.style.backgroundColor = cor.backgroundColor;
            sessionStorage.setItem("BoardClicked", JSON.stringify(Board));

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao Renomear Quadro");
        }
    }
    
    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newColor));

}

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
            resetForm('spanAddLista','btnCriarLista', 'formNovaLista', 'divFormLista');

        }else if (this.readyState == 4 && this.status == 400){
            alert("Erro ao criar nova lista");
        }
    }
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(lista));
});