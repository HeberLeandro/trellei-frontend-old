//Verificar se a sessão aberta
function verificaSessao(){
    if(!localStorage.getItem("token") && !sessionStorage.getItem("token")){
        //window.location = "index.html";
        console.log("desgraça");
    }  
}