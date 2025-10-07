-- fix-mysql-auth.sql
-- Comandos SQL para corrigir autenticação MySQL 8.0

-- 1. Verificar configuração atual
SELECT user, host, plugin FROM mysql.user WHERE user IN ('root', 'bluedelivery');

-- 2. Alterar plugin de autenticação 
ALTER USER 'bluedelivery'@'localhost' IDENTIFIED WITH mysql_native_password BY '~@#$121247EzPSI';

-- 3. Garantir privilégios (caso necessário)
GRANT ALL PRIVILEGES ON bluedelivery.* TO 'bluedelivery'@'localhost';

-- 4. Aplicar mudanças
FLUSH PRIVILEGES;

-- 5. Verificar resultado
SELECT user, host, plugin, authentication_string FROM mysql.user WHERE user = 'bluedelivery';

-- 6. Verificar database e tabelas
SHOW DATABASES LIKE 'bluedelivery';
USE bluedelivery;
SHOW TABLES;

-- 7. Verificar dados importantes
SELECT COUNT(*) as total_deliveries FROM deliveries;
SELECT DELIVERY_ID, DELIVERY_NOME, EMAIL FROM deliveries WHERE DELIVERY_ID = 1003;
SELECT COUNT(*) as total_produtos FROM produtos WHERE DELIVERY_ID = 1003;