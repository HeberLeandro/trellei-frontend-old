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
var spanUsername = document.getElementById("spanUsername");

//Modal que abre ao clicar no card
var modalCard = document.getElementById("modalCard");
var resizeCardTitle = document.getElementById("resizeCardTitle");
var textTitleCard = document.getElementById("textTitleCard");
var comentsList = document.getElementById("comentsList");
var resizeTextComent = document.getElementById("resizeTextComent");
var textComent = document.getElementById("textComent");
var inputData = document.getElementById("dataCard");
var tagInfo = document.getElementById("bg-info");
var tagSuccess = document.getElementById("bg-success");
var tagWarning = document.getElementById("bg-warning");
var tagDanger = document.getElementById("bg-danger");
var addTag = document.getElementById("addTag");
var selectList = document.getElementById("selectList");
var formDadosCard = document.getElementById("formDadosCard");
var spanCard;

var Listas;
var Board;
var token;
var CardClicked;

verificaSessao();

function verificaSessao() {
    if (sessionStorage.getItem("token")) {
        token = JSON.parse(sessionStorage.getItem("token"));
    } else if (localStorage.getItem("token")) {
        token = JSON.parse(localStorage.getItem("token"));
    } else {
        window.location = "../index.html";
    }
    var user = JSON.parse(sessionStorage.getItem("user"));
    var name = user.name;
    var tmp = name.split(" ");
    for (let i = 0; i < tmp.length && i < 2; i++) {
        spanMenuUser.innerHTML += tmp[i][0];
    }
    spanMenuUser.setAttribute("title", name + "(" + user.username + ")");
    spanUsername.innerText = "(" + user.username + ")";
    H6Name.innerText = user.name;

    if (sessionStorage.getItem("BoardClicked")) {
        Board = JSON.parse(sessionStorage.getItem("BoardClicked"));
        background.style.background = Board.color;
        title[0].innerText = Board.name + " | Trellei";
        spanName.innerText = Board.name;
    } else {
        window.location = "../index.html";
    }
    getListas();
}

function getListas() {
    var url = "https://tads-trello.herokuapp.com/api/trello/lists/" + token + "/board/" + Board.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            Listas = JSON.parse(this.responseText);
            for (let i = 0; i < Listas.length; i++) {
                adicionarLista(Listas[i]);

            }

        } else if (this.readyState == 4 && this.status == 400) {
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
    liLista.setAttribute("name", lista.name);

    var divNomeLista = document.createElement("div");
    divNomeLista.setAttribute("class", "divNomeLista align-items-center");
    var h6AuxSize = document.createElement("h6");
    h6AuxSize.setAttribute("class", "nome-lista-resize");
    h6AuxSize.setAttribute("id", "textNameResize" + lista.id);
    divNomeLista.appendChild(h6AuxSize);
    var textarea = document.createElement("textarea");
    textarea.setAttribute("class", "nome-lista");
    textarea.setAttribute("id", "textName" + lista.id);
    textarea.setAttribute("spellcheck", "false");
    textarea.setAttribute("maxlength", "100");
    textarea.setAttribute("name", lista.name);
    textarea.value = lista.name;
    h6AuxSize.innerText = textarea.value;
    divNomeLista.appendChild(textarea);
    var btnExcluirLista = document.createElement("button");
    btnExcluirLista.setAttribute("class","btn delete-icon");
    btnExcluirLista.setAttribute("type", "button");
    btnExcluirLista.setAttribute("data-toggle", "modal");
    btnExcluirLista.setAttribute("data-target", "#excluirLista");
    btnExcluirLista.setAttribute("id", "excluir"+lista.id);
    btnExcluirLista.innerHTML = '<img src="../imagens/delete.png">';
    divNomeLista.appendChild(btnExcluirLista);
    liLista.appendChild(divNomeLista);
    var divCards = document.createElement("div");
    divCards.setAttribute("class", "overflow-auto div-cards");
    divCards.setAttribute("id", "divCards" + lista.id);
    liLista.appendChild(divCards);
    //add card/ div collapse
    var divAddCard = document.createElement("div");
    divAddCard.setAttribute("class", "card add-card text-nao-selecionavel");
    divAddCard.setAttribute("id", "divAddCard" + lista.id);
    divAddCard.setAttribute("onclick", "hideOrShow('spanAddCard" + lista.id + "', 'none')");
    divAddCard.setAttribute("data-toggle", "collapse");
    divAddCard.setAttribute("href", "#divFormCard" + lista.id);
    divAddCard.innerHTML = '<span id="spanAddCard' + lista.id + '" class="span-Add-Card">+ Adicionar Cartão</span>' +
        '<div class="collapse px-0 position-relative"  id="divFormCard' + lista.id + '" onclick="event.stopPropagation()">' +
        '<form method="post" id="formNovoCard' + lista.id + '">' +
        '<h6 class="resize-textarea" id="resizeTextarea' + lista.id + '"></h6>' +
        '<textarea autofocus class="form-control mr-1 textarea-nome-do-card" id="inputNomeDoCard' + lista.id + '" placeholder="Titulo do cartão..." required maxlength="100"></textarea>' +
        '<div class="d-flex justify-content-between">' +
        '<input type="submit" class="mt-2 form-control btn-Criar-Card btn" id="btnCriarCard' + lista.id + '" value="Criar">' +
        '<button type="button" class="close mr-1" aria-label="Close" onclick="resetForm(\'spanAddCard' + lista.id + '\',\'btnCriarCard' + lista.id + '\', \'formNovoCard' + lista.id + '\', \'divFormCard' + lista.id + '\')">' +
        '<span aria-hidden="true">&times;</span> </button> </div> </form> </div>';

    liLista.appendChild(divAddCard);
    addLista.insertAdjacentElement("beforebegin", liLista);
    h6AuxSize.style.width = getComputedStyle(textarea).width;
    textarea.style.height = window.getComputedStyle(h6AuxSize).height;
    addEvents(lista.id);
    getCards(lista.id, divCards);
}

function getCards(listaId, element) {
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/" + token + "/list/" + listaId;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var cards = JSON.parse(this.responseText);
            for (let i = 0; i < cards.length; i++) {
                adicionarCard(cards[i], element);
            }

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro Buscar Cartões");
        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

//Adiciona Cards as suas respectivas Listas
function adicionarCard(card, element) {
    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card text-nao-selecionavel");
    divCard.setAttribute("data-toggle", "modal");
    divCard.setAttribute("data-target", "#modalCard");
    divCard.setAttribute("id", card.id);
    var divTags = document.createElement("div");
    divTags.setAttribute("class", "d-inline-block");
    divTags.setAttribute("id", "tags"+card.id);
    divCard.appendChild(divTags);
    var span = document.createElement("span");
    span.setAttribute("id", "span" + card.id);
    span.innerText = card.name;

    divCard.appendChild(span);
    //Envento para passa os dados do card para session
    divCard.addEventListener("click", function () {
        spanCard = document.getElementById("span" + card.id);
        if (!sessionStorage.getItem(card.id)) {
            sessionStorage.setItem(card.id, JSON.stringify(card));
        }
        CardClicked = JSON.parse(sessionStorage.getItem(card.id));
        setCardModal();
        //Funções do modal la no final
    });
    element.insertAdjacentElement("beforeend", divCard);
    //Busca das tags para adicionar ao card na tela
    getTags(card.id);
}

//função para resetar os form que cria lista e cartões
function resetForm(span, btn, form, div) {
    document.getElementById(form).reset();
    hideOrShow(document.getElementById(span), 'block');
    document.getElementById(div).className = "collapse";
}

//Função para mudar o display dos elementos
function hideOrShow(element, display) {
    if (display == 'block') {
        if (typeof (element) === 'string') {
            document.getElementById(element).classList.remove("display-none", "display-flex");
            document.getElementById(element).classList.add("display-block");
        } else {
            element.classList.remove("display-none", "display-flex");
            element.classList.add("display-block");
        }
    }
    else if (display == 'none') {
        if (typeof (element) === 'string') {
            document.getElementById(element).classList.remove("display-block", "display-flex");
            document.getElementById(element).classList.add("display-none");
        } else {
            element.classList.remove("display-block", "display-flex");
            element.classList.add("display-none");
        }
    }
    else if (display == 'flex') {
        if (typeof (element) === 'string') {
            document.getElementById(element).classList.remove("display-none", "display-block");
            document.getElementById(element).classList.add("display-flex");
        } else {
            element.classList.remove("display-none", "display-block");
            element.classList.add("display-flex");
        }
    }

}

//Função para adicionar eventos nos em elementos dentro da lista
function addEvents(listaId) {
    let textareaName = document.getElementById('textName' + listaId);
    let textNameResize = document.getElementById('textNameResize' + listaId);
    let form = document.getElementById('formNovoCard' + listaId);
    let inputText = document.getElementById('inputNomeDoCard' + listaId);
    let resizeTextarea = document.getElementById('resizeTextarea' + listaId);
    let btnExluirLista = document.getElementById('excluir' + listaId)

    //Criar Card
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        submitCard(inputText.value);
        inputText.value = "";
        inputText.blur();
    });

    inputText.addEventListener("input", function () {
        changeInputsize(resizeTextarea, inputText, false, true);
    });

    inputText.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {
            submitCard(inputText.value);
            inputText.value = "";
            inputText.blur();
        }
    });

    function submitCard(string) {
        var name = removeSpaces(string);
        if (name == "") {
            return;
        }
        var data = new Date();
        var AnoMesDia = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();

        var card = {
            "name": name,
            "data": AnoMesDia,
            "token": token,
            "list_id": listaId
        }

        var url = "https://tads-trello.herokuapp.com/api/trello/cards/new";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                adicionarCard(obj, document.getElementById("divCards" + listaId));


            } else if (this.readyState == 4 && this.status == 400) {
                alert("Erro ao criar novo Cartão");
            }
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(card));
    }

    //Renomear Lista
    //Funçoes para redemecionar a textArea
    var listIsFocused = false;
    textareaName.addEventListener("focusin", function () {
        listIsFocused = true;
        changeInputsize(textNameResize, textareaName, true, true);
    });

    textareaName.addEventListener("input", function () {
        changeInputsize(textNameResize, textareaName, false, true);
    });

    //Funçoes que chamam a alteração no nome da Lista
    textareaName.addEventListener("focusout", function (e) {
        if (listIsFocused) {
            changeNameList(textareaName.value, textareaName.getAttribute("name"));
            listIsFocused = false;
        }
    });

    textareaName.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {
            listIsFocused = false;
            textareaName.blur();
            changeNameList(textareaName.value, textareaName.getAttribute("name"));
        }
    });

    //Mudar nome da Lista
    function changeNameList(newName, oldName) {
        name = removeSpaces(newName);
        if (name != "" && name != oldName) {
            var newName = {
                "list_id": listaId,
                "name": name,
                "token": token
            }

            var url = "https://tads-trello.herokuapp.com/api/trello/lists/rename";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.responseText);
                    textareaName.setAttribute("name", obj.name);
                    document.getElementById(listaId).setAttribute("name", obj.name);
                    textareaName.value = obj.name;

                } else if (this.readyState == 4 && this.status == 400) {
                    alert("Erro ao Renomear Lista");
                }
            }

            xhttp.open("PATCH", url, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newName));
        } else {
            textareaName.value = textareaName.getAttribute("name");
            changeInputsize(textNameResize, textareaName, true, true);
        }
    }

    //Chamar modal para excluir a lista
    btnExluirLista.addEventListener("click", function(){
        sessionStorage.setItem("delete", JSON.stringify(listaId));
    });
}

//Excluir Lista
function excluirLista(){
    var listId = JSON.parse(sessionStorage.getItem("delete"))
    var list = {
        "list_id": listId,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(listId).remove();
        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro! Não foi possivel excluir esse Quadro.");
        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(list));
}

//Excluir quadro
function excluirQuadro() {
    var board = {
        "board_id": Board.id,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "../user/mainpage.html";
        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro! Não foi possivel excluir esse Quadro.");
        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));
}

//voltar para home
imgLogo.addEventListener("click", function () {
    window.location = "../user/mainpage.html";
});

homeIcon.addEventListener("click", function () {
    window.location = "../user/mainpage.html";
});

//altera largura do input, para novo nome do quadro
inputNomeQuadro.addEventListener("keydown", function () {
    changeInputsize(spanSize, inputNomeQuadro, true, true);
});

function changeInputsize(sizeReference, element, changeWidth, changeHeight) {
    sizeReference.innerText = element.value;
    if (changeWidth) {
        element.style.width = window.getComputedStyle(sizeReference).width;
    }
    if (changeHeight) {
        element.style.height = window.getComputedStyle(sizeReference).height;
    }
}

//mostra o input para fazer a alteração do nome
spanName.addEventListener("click", function () {
    hideOrShow(spanName, 'none');
    hideOrShow(inputNomeQuadro, 'block');
    inputNomeQuadro.value = spanName.innerText;
    changeInputsize(spanSize, inputNomeQuadro, true, true);
    inputNomeQuadro.focus();
});

//Fechar o input mostra o name de volta
inputNomeQuadro.addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
        changeNameBoard(inputNomeQuadro.value);
        hideOrShow(inputNomeQuadro, 'none');
        hideOrShow(spanName, 'block');
    }
});

inputNomeQuadro.addEventListener("focusout", function (e) {
    if (inputNomeQuadro.classList.contains("display-block")) {
        changeNameBoard(inputNomeQuadro.value);
        hideOrShow(inputNomeQuadro, 'none');
        hideOrShow(spanName, 'block');
    }
});

//Serve para limpar espaços extras numa string
function removeSpaces(string) {
    var corte = string.split(" ");
    var name = "";
    for (let i = 0; i < corte.length; i++) {
        if (corte[i] != "" && corte[i] != "\n") {
            if (i == 0) {
                name += corte[i];
            } else {
                name += " " + corte[i];
            }
        }
    }
    return name.trim();
}

//Muda o nome do Quadro
function changeNameBoard(newName) {
    var name = removeSpaces(newName);
    if (name != spanName.innerText && name != "") {
        var newName = {
            "board_id": Board.id,
            "name": name,
            "token": token
        }

        var url = "https://tads-trello.herokuapp.com/api/trello/boards/rename";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                Board.name = obj.name;
                sessionStorage.setItem("BoardClicked", JSON.stringify(Board));
                spanName.innerText = name;
                title[0].innerText = name + " | Trellei";

            } else if (this.readyState == 4 && this.status == 400) {
                alert("Erro ao Renomear Quadro");
            }
        }

        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(newName));

    }
}

//Mudar Cor do Quadro
function changeColor(btn) {

    cor = getComputedStyle(btn);
    if (cor.backgroundColor == Board.color) {
        return;
    }
    var newColor = {
        "board_id": Board.id,
        "color": cor.backgroundColor,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/newcolor";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            Board.color = background.style.backgroundColor = cor.backgroundColor;
            sessionStorage.setItem("BoardClicked", JSON.stringify(Board));

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao mudar cor do Quadro");
        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newColor));

}

//criar nova Lista
formNovaLista.addEventListener("submit", function (e) {
    e.preventDefault();
    var lista = {
        "name": inputNomeDaLista.value,
        "token": token,
        "board_id": Board.id
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            adicionarLista(obj);
            resetForm('spanAddLista', 'btnCriarLista', 'formNovaLista', 'divFormLista');

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao criar nova lista");
        }
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(lista));
});

//sair da Conta
Logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location = "../index.html";
});

/* MODAL DO CARD */
//Limpar as antigas tags no modal
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
//funçao que prepara o modal de acordo com o card clicado
function setCardModal() {
    removeElementsByClass("comment");
    removeElementsByClass("select-op");
    setSelectList();
    getComents();
    let tags = document.getElementById("tags"+CardClicked.id).children;
    removeElementsByClass("tag");
    for (let i = 0; i < tags.length; i++) {
        let li = document.createElement("li");
        li.setAttribute("class", "d-inline-block m-1 p-0 tag");
        li.setAttribute("id", tags[i].getAttribute("name"));
        let btn = document.createElement("button");
        btn.setAttribute("class","btn btn-tags");
        btn.style.backgroundColor = getComputedStyle(tags[i]).backgroundColor;
        li.appendChild(btn);
        addTag.insertAdjacentElement("beforebegin", li);
    }
    textTitleCard.value = CardClicked.name;
    inputData.value = CardClicked.data;
    modalCard.addEventListener("mouseover", function () {
        changeInputsize(resizeCardTitle, textTitleCard, true, true);
        modalCard.removeEventListener("mouseover", function () { });
    });
}
//Redimencionar a text Area do comment
textComent.addEventListener("input", function(e){
    changeInputsize(resizeTextComent, textComent, false, true);
});

textComent.addEventListener("keydown", function(e){
    if (e.keyCode == 13) {
        saveComment(textComent.value);
    }
});

//Funçoes para redemecionar a textaera do titulo do card
textTitleCard.addEventListener("input", function () {
    changeInputsize(resizeCardTitle, textTitleCard, true, true);
});

var cardIsFocused = false;
textTitleCard.addEventListener("focusin", function () {
    cardIsFocused = true;
    changeInputsize(resizeCardTitle, textTitleCard, true, true);
});

//Funçoes que chamam a alteração no nome
textTitleCard.addEventListener("focusout", function (e) {
    if (cardIsFocused) {
        changeNameCard(textTitleCard.value, CardClicked.name);
        cardIsFocused = false;
    }
});

textTitleCard.addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
        cardIsFocused = false;
        textTitleCard.blur();
        changeNameCard(textTitleCard.value, CardClicked.name);
    }
});

//Ao submeter o form, Realiza mundança na data do Card e muda-o de Lista
formDadosCard.addEventListener("submit", function(e){
    var closeM = document.getElementById("closeModal");
    e.preventDefault();
    if (inputData.value != CardClicked.data) {
        changeDateCard(CardClicked.id, inputData.value);
    }
    if (selectList.value != CardClicked.trelloListId) {
        changeListCard(CardClicked.id, selectList.value);
    }
    closeM.click();
});

//Mudar Data do Card
function changeDateCard(cardId, data){
    var newDate = {
        "token": token,
        "card_id": cardId,
        "data": data,
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/newdata";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            sessionStorage.setItem(obj.id, JSON.stringify(obj));

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao mudar a data do cartão");
        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newDate));
}

//Mudar Card de Lista
function changeListCard(cardId, listId){
    var newList = {
        "token": token,
        "card_id": cardId,
        "list_id": listId,
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/changelist";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            sessionStorage.setItem(obj.id, JSON.stringify(obj));
            document.getElementById(obj.id).remove();
            adicionarCard(obj, document.getElementById("divCards"+obj.trelloListId));

        } else if (this.readyState == 4 && this.status == 400) {
           alert("Erro ao mudar o cartão de Lista");
        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newList));
}

//Select List para mudar card de lista
function setSelectList(){
    var listas = document.getElementsByClassName("lista");
    for (const i of listas) {
        var op = document.createElement("option");
        op.setAttribute("class","select-op");
        op.value = i.getAttribute("id");
        op.innerText = i.getAttribute("name");
        if (i.id == CardClicked.trelloListId) {
            op.innerText += " (Lista Atual)";
            op.setAttribute("selected", "selected");
        }
        selectList.appendChild(op);
    }
}

//Mudar no do Card
function changeNameCard(newName, oldName) {
    name = removeSpaces(newName);
    if (name != "" && name != oldName) {
        var newName = {
            "token": token,
            "card_id": CardClicked.id,
            "name": name,
        }

        var url = "https://tads-trello.herokuapp.com/api/trello/cards/rename";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                CardClicked = obj;
                spanCard.innerText = obj.name;

                sessionStorage.setItem(CardClicked.id, JSON.stringify(CardClicked));

            } else if (this.readyState == 4 && this.status == 400) {
                alert("Erro ao Renomear Card");
            }
        }

        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(newName));
    } else {
        textTitleCard.value = CardClicked.name;
        changeInputsize(resizeCardTitle, textTitleCard, true, true);
    }
}

//Busca dos Coments 
function getComents() {
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/" + token + "/" + CardClicked.id + "/comments";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            for (const iterator of obj) {
                adicionarComments(iterator.comment);
            }

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao Buscar Comentários");
        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

//Busca das Tags
function getTags(cardId) {
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/" + token + "/" + cardId + "/tags";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            for (let i = 0; i < obj.length; i++) {
                adicionarTag(obj[i].id, obj[i].trello_cards[0].id, false);
            }

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao Buscar Tags");
        }
    }
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

//Adiciona tag no card (na tela)
function adicionarTag(tagId, cardId, addInModal) {
    var tag;
    if (tagId == "2") {
        tag = "info";
    }
    else if (tagId == "12") {
        tag = "success";
    }
    else if (tagId == "22") {
        tag = "danger";
    }
    else if (tagId == "32") {
        tag = "warning";
    }
    var divTag = document.createElement("div");
    divTag.setAttribute("class", "card d-inline-block w-min bg-"+tag);
    divTag.setAttribute("name", tag);
    document.getElementById("tags"+cardId).appendChild(divTag);

    if (addInModal) {
        let li = document.createElement("li");
        li.setAttribute("class", "d-inline-block m-1 p-0 tag");
        li.setAttribute("id", tag);
        let btn = document.createElement("button");
        btn.setAttribute("class","btn btn-tags bg-"+tag);
        li.appendChild(btn);
        addTag.insertAdjacentElement("beforebegin", li);
    }
}

function setTag(tagId){
    var Tag = {
        "card_id": CardClicked.id, 
        "tag_id": tagId, 
        "token": token,
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/addtag";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            adicionarTag(obj.trelloTagId, obj.trelloCardId, true);

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Erro ao colocar Etiqueta!");    
        }
    }
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(Tag));
}

tagInfo.addEventListener("click", function () {
    if (!document.getElementById("info")) {
        setTag("2");
    }else{
        alert("Essa Etiqueta já foi colocada nesse cartão");
    }
});

tagDanger.addEventListener("click", function () {
    if (!document.getElementById("danger")) {
        setTag("22");
    }else{
        alert("Essa Etiqueta já foi colocada nesse cartão");
    }
});

tagSuccess.addEventListener("click", function () {
    if (!document.getElementById("success")) {
        setTag("12");
    }else{
        alert("Essa Etiqueta já foi colocada nesse cartão");
    }
});

tagWarning.addEventListener("click", function () {
    if (!document.getElementById("warning")) {
        setTag("32");
    }else{
        alert("Essa Etiqueta já foi colocada nesse cartão");
    }
});

function saveComment(comment){
    comment = removeSpaces(comment);
    if (comment != "") {
        var newComment = {
            "card_id": CardClicked.id,
            "comment": comment,
            "token": token
        }
        var url = "https://tads-trello.herokuapp.com/api/trello/cards/addcomment";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
                adicionarComments(obj.comment);
                textComent.value = "";
                textComent.blur();

            } else if (this.readyState == 4 && this.status == 400) {
                alert("Erro ao Renomear Card");
            }
        }

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(newComment));
    } else {
        textComent.value = "";
        textComent.blur();
    }
}

function adicionarComments(comment){
    var li = document.createElement("li");
    li.setAttribute("class", "list-group-item flex-column align-items-start comment");
    var p = document.createElement("p");
    p.setAttribute("class", "mb-1");
    p.innerText = comment;
    li.appendChild(p);
    comentsList.appendChild(li);
}

//Excluir Card
function excluirCard(){
    var card = { 
        "card_id": CardClicked.id, 
        "token": token 
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/delete";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            var card = document.getElementById(CardClicked.id);
            card.parentNode.removeChild(card);

        } else if (this.readyState == 4 && this.status == 400) {
            alert("Não foi possivel Excluir o card");
        }
    }
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));
}