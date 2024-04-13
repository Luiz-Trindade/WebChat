// Objeto para armazenar as mensagens
var mensagens = {};

//  Chave para criptografar e descriptografar as mensagens no algoritmo AES
const secureKey = "keyTest1234";

//  Funções que criptografam e descriptografam as mensagens através de uma chave
function criptAES(msg){
    return CryptoJS.AES.encrypt(msg, secureKey).toString();
}
function decriptAES(msg){
    return CryptoJS.AES.decrypt(msg, secureKey).toString(CryptoJS.enc.Utf8);
}

//  Função que envia as mensagens para o banco de dados
function postMessage(){
    let message = document.getElementById("mensagem").value;
    let secureMessage = criptAES(message);

    let data = {
        "opcode" : 1,
        "message": secureMessage
    };
    
    axios.post("http://localhost/WebChat/dependences/engine.php", data)
    .then(response => {
            console.log(response.data);
            updateMessages();

            document.getElementById("mensagem").value = "";
            swal("Sucesso!", "Mensagem enviada com sucesso!", "success");
        })
        .catch(error => {
            console.error("Erro ao fazer a requisição: ", error);
            swal("Erro", "Erro ao fazer a requisição: "+error, "error");
        })
}

//  Função que atualiza as mensagens e as armazena em um objeto
function updateMessages(){
    data = {
        "opcode": 2
    }
    axios.post("http://localhost/WebChat/dependences/engine.php", data)
        .then(response => {
            //  Resetar as mensagens e guadar o conteúdo delas
            mensagens = {};
            mensagens = response.data;
            
            //  Chamar a função que lê as mensagens e exibe para o usuário
            readMessages();
        })
        .catch(error => {
            console.log("Erro ao ler as mensagens: ", error);
            swal("Erro", "Erro ao ler as mensagens: "+error, "error");
        })
}

//  Função criada para ler as mensagens
function readMessages(){
    var content = document.getElementById("mensagens_aba");
    content.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++){
        //console.log(mensagens[i]["conteudo"]);
        let decripted_messgae = decriptAES(mensagens[i]["conteudo"], secureKey)
        var new_content = "<p style='color: green; text-align: center; font-size: 16px; margin: 10px;'>-"+decripted_messgae+" (Enviada às: "+mensagens[i]["horario"]+")"+"</p>";
        content.innerHTML += new_content;
    }
}
   
//  Função que será executada ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada!");

    const wellcomeMessage = `
        Olá! Bem vindo ao meu webchat!
        -Criado por: Luiz Gabriel Magalhães Trindade.

        Como funciona?
        -Através do envio de textos para uma tabela em 
        um banco de dados MySQL e através da visualização
        desses textos.

        Para que serve?
        -Para criar uma seção de comentários de um site pessoal, 
        ou se quiser desenvolver mais, criar uma pequena ou média
        rede social através de LEFT JOIN com SQL para que cada 
        usuário seja uma tabela e que as mensagens trocadas entre
        esses usuários sejam trocadas entre tabelas e exibidas através
        de LEFT JOIN para unir as tabelas em uma só!

        E a segurança das mensagens?
        -Pode ser utilizado algorítmos de criptografia reversíveis, 
        como AES(Advanced Encryption Standard) por exemplo e uma chave
        para poder criptografar as mensagens no banco de dados.
    `;
    swal("Simples WebChat Baseado em banco de dados MySQL", wellcomeMessage, "success");
    
    updateMessages();
    console.log("Mensagens carregadas!");
});