#!/bin/bash
# reset-all-passwords.sh
# Script para executar quando conseguir acesso root

echo "=== RESET COMPLETO DE SENHAS - BLUEDELIVERY ==="

echo "1. Resetando senha do usuário ezequias..."
echo "ezequias:123456" | chpasswd
echo "✅ Nova senha ezequias: 123456"

echo ""
echo "2. Resetando MySQL e criando configurações..."

# Parar MySQL
systemctl stop mysql

echo "3. Iniciando MySQL modo seguro..."
mysqld_safe --skip-grant-tables --skip-networking &
sleep 5

echo "4. Configurando MySQL..."
mysql -u root << 'MYSQL_COMMANDS'

-- Resetar root MySQL
USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';

-- Criar/recriar usuário bluedelivery
DROP USER IF EXISTS 'bluedelivery'@'localhost';
CREATE USER 'bluedelivery'@'localhost' IDENTIFIED WITH mysql_native_password BY '~@#$121247EzPSI';

-- Criar database se não existir
CREATE DATABASE IF NOT EXISTS bluedelivery;

-- Dar privilégios
GRANT ALL PRIVILEGES ON bluedelivery.* TO 'bluedelivery'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Mostrar usuários
SELECT user, host, plugin FROM mysql.user WHERE user IN ('root', 'bluedelivery');

EXIT;
MYSQL_COMMANDS

echo "5. Finalizando MySQL modo seguro..."
pkill mysqld_safe
pkill mysqld
sleep 3

echo "6. Reiniciando MySQL..."
systemctl start mysql

echo "7. Testando acessos..."
echo "Testando root MySQL..."
mysql -u root -p123456 -e "SELECT 'Root MySQL OK!' as status;"

echo "Testando usuário bluedelivery..."
mysql -u bluedelivery -p'~@#$121247EzPSI' -e "SELECT 'Bluedelivery MySQL OK!' as status;"

echo ""
echo "=== CONFIGURAÇÃO COMPLETA! ==="
echo "✅ Senha SSH ezequias: 123456"
echo "✅ Senha MySQL root: 123456"  
echo "✅ Senha MySQL bluedelivery: ~@#$121247EzPSI"
echo ""
echo "COMANDOS PARA TESTAR:"
echo "ssh ezequias@148.163.73.195"
echo "mysql -u root -p123456"
echo "mysql -u bluedelivery -p'~@#$121247EzPSI'"