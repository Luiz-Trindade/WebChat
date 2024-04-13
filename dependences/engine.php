<?php
// Pequena latência para prevenir sobrecarga
/* sleep(rand(1, 2)); */

// Setar o fuso-horário
date_default_timezone_set('America/Sao_Paulo');

// Dados do banco de dados
$dsn = 'mysql:host=localhost;dbname=webchat_database';
$usuario = 'root';
$senha = '';

// Verifica se há dados enviados no corpo da requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os dados enviados no corpo da requisição POST
    $data = json_decode(file_get_contents("php://input"));

    // Verifica se a decodificação do JSON foi bem-sucedida
    if ($data !== null) {
        //  Definir o código de operação.
        $opcode = $data -> opcode;

        //  Se o código de operação for igual a 1, será o código de registro de usuário.
        if ($opcode === 1){
            try {
                // Conectando ao banco de dados usando PDO
                $conexao = new PDO($dsn, $usuario, $senha);
            
                // Definindo o modo de erro para exceções
                $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
                // Dados a serem inseridos
                $message = $data -> message;  
                $horario =  (String) date("H:i:s");
            
                // Preparando a consulta SQL usando um statement preparado
                $stmt = $conexao->prepare("INSERT INTO mensagens (conteudo, horario) VALUES (:message, :horario)");
            
                // Substituindo os parâmetros da consulta pelo valor real
                $stmt->bindParam(':message', $message);
                $stmt->bindParam(':horario', $horario);
            
                // Executando a consulta preparada
                $stmt->execute();
                echo("Mensagem enviada com sucesso!");
                $conexao = null;
            } 
            catch(PDOException $e) {
                echo("Erro ao enviar mensagem: " . $e->getMessage());
            }
        }

        //  Se o código de operação for igual a 2, será o código de login de usuário.
        else if ($opcode === 2){
            try {
                // Conectando ao banco de dados usando PDO
                $conexao = new PDO($dsn, $usuario, $senha);
            
                // Definindo o modo de erro para exceções
                $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);    
            
                // Preparando a consulta SQL usando um statement preparado
                $stmt = $conexao->prepare("SELECT * FROM mensagens;");
            
                // Executando a consulta preparada
                $stmt->execute();
                $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo(json_encode($resultado));

                $conexao = null;
            } 
            catch(PDOException $e) {
                echo("Erro ao exibir mensagens: " . $e->getMessage());
            }
        }

    } 
    else {
        // Se a decodificação falhou, você pode retornar um erro ou tratar de outra forma
        echo("Erro ao decodificar JSON.");
    }
} 
else {
    // Se a requisição não for do tipo POST, retorne um erro
    echo("Erro: Esta página suporta apenas requisições POST.");
}
?>
