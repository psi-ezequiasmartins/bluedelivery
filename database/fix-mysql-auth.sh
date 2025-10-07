#!/bin/bash
# fix-mysql-auth.sh
# Script para corrigir autenticação MySQL 8.0 com Node.js

echo "=== CORREÇÃO AUTENTICAÇÃO MYSQL BLUEDELIVERY ==="

echo "1. Conectando ao MySQL..."
mysql -u root -p << 'EOF'

-- Verificar usuários atuais
SELECT user, host, plugin FROM mysql.user WHERE user IN ('root', 'bluedelivery');

-- Alterar plugin de autenticação para mysql_native_password
ALTER USER 'bluedelivery'@'localhost' IDENTIFIED WITH mysql_native_password BY '~@#$121247EzPSI';

-- Se não existir, criar o usuário
-- CREATE USER IF NOT EXISTS 'bluedelivery'@'localhost' IDENTIFIED WITH mysql_native_password BY '~@#$121247EzPSI';

-- Garantir privilégios
GRANT ALL PRIVILEGES ON bluedelivery.* TO 'bluedelivery'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar resultado
SELECT user, host, plugin, authentication_string FROM mysql.user WHERE user = 'bluedelivery';

-- Testar se database existe
SHOW DATABASES LIKE 'bluedelivery';

-- Verificar tabelas
USE bluedelivery;
SHOW TABLES;

-- Contar registros na tabela deliveries
SELECT COUNT(*) as total_deliveries FROM deliveries;

-- Verificar se existe delivery 1003
SELECT DELIVERY_ID, DELIVERY_NOME, EMAIL FROM deliveries WHERE DELIVERY_ID = 1003;

EOF

echo "2. Reiniciando backend..."
pm2 restart bluedelivery-backend

echo "3. Testando API..."
sleep 2
curl -s http://localhost:33570/api/ping

echo ""
echo "4. Testando listar deliveries..."
curl -s http://localhost:33570/api/listar/deliveries

echo ""
echo "=== CORREÇÃO CONCLUÍDA ==="