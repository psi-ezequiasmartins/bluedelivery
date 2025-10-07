#!/bin/bash
# reset-mysql-root-password.sh
# Script para resetar senha do root MySQL 8.0 Ubuntu

echo "=== RESET SENHA ROOT MYSQL 8.0 ==="

echo "1. Parando MySQL..."
sudo systemctl stop mysql

echo "2. Iniciando MySQL em modo seguro..."
sudo mkdir -p /var/run/mysqld
sudo chown mysql:mysql /var/run/mysqld
sudo mysqld_safe --skip-grant-tables --skip-networking &

echo "3. Aguardando MySQL iniciar..."
sleep 5

echo "4. Conectando e resetando senha..."
mysql -u root << 'EOF'

-- Usar database mysql
USE mysql;

-- Resetar senha do root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysql';

-- ou se não funcionar:
-- UPDATE user SET authentication_string=PASSWORD('mysql') WHERE User='root' AND Host='localhost';
-- UPDATE user SET plugin='mysql_native_password' WHERE User='root' AND Host='localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Sair
EXIT;
EOF

echo "5. Parando MySQL modo seguro..."
sudo pkill mysqld_safe
sudo pkill mysqld
sleep 3

echo "6. Reiniciando MySQL normal..."
sudo systemctl start mysql

echo "7. Testando nova senha..."
mysql -u root -p -e "SELECT 'Senha funcionando!' as status;"

echo ""
echo "=== SENHA ROOT RESETADA PARA: mysql ==="
echo "Agora use: mysql -u root -p"
echo "Senha: mysql"