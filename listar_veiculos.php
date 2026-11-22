<?php
header('Content-Type: application/json; charset=utf-8');

// Include com a conexão ao banco de dados (PDO)
require_once 'config.php';

try {
    // Todos os campos de cada veículo cadastrado + nome do cliente dono
    $sql = "SELECT a.id, a.marca, a.modelo, a.placa, a.cliente_id, a.criado_em,
                   c.nome AS cliente_nome
              FROM automoveis a
              LEFT JOIN clientes c ON c.id = a.cliente_id
             ORDER BY a.id";

    $stmt = $pdo->query($sql);
    $veiculos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'dados' => $veiculos]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
