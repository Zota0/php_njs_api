<?php

require_once 'vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

function isAuthorized($data) {
    return isset($data['authorization_key']) && $data['authorization_key'] === $_ENV["auth_key"];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Invalid JSON input']);
        http_response_code(400);
        exit;
    }

    if (isAuthorized($data)) {
        $category = filter_var($data['category'], FILTER_SANITIZE_STRING);
        $minPrice = filter_var($data['price_min'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $maxPrice = filter_var($data['price_max'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

        $conn = new mysqli("localhost", "dev", "dev", "products");

        if ($conn->connect_error) {
            echo json_encode(['error' => 'Database connection failed']);
            http_response_code(500);
            exit;
        }

        $sql = "SELECT * FROM products WHERE category = ? AND price >= ? AND price <= ?";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            echo json_encode(['error' => 'SQL prepare statement failed']);
            $conn->close();
            http_response_code(500);
            exit;
        }

        $stmt->bind_param("sdd", $category, $minPrice, $maxPrice);
        $stmt->execute();

        $result = $stmt->get_result();
        $products = $result->fetch_all(MYSQLI_ASSOC);

        $stmt->close();
        $conn->close();

        echo json_encode($products);
    } else {
        echo json_encode(['error' => 'Unauthorized']);
        http_response_code(401);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
    http_response_code(405);
}