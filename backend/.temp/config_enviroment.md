# Configurações de Ambiente - Documentação

## 📋 **CREDENCIAIS POR AMBIENTE**

### 🏠 **AMBIENTE LOCAL (AMPPS/XAMPP)**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysql
DB_NAME=deliverybairro
```

### 🌐 **AMBIENTE REMOTO (SERVIDOR DE PRODUÇÃO)**
```env
DB_HOST=localhost (ou IP do servidor MySQL)
DB_USER=deliverybairro
DB_PASSWORD=AB4EEAD4187EF4602BFC2E353D459195BAC1695E
DB_NAME=deliverybairro
```

### 🔐 **JWT SECRETS**
```env
JWT_SECRET=#AB4EEAD4187EF4602BFC2E353D459195BAC1695
JWT_REFRESH_SECRET=#AB4EEAD4187EF4602BFC2E353D459195BAC1695REFRESH
```

### 💳 **PIX CONFIGURAÇÃO**
```env
PIX_RECEIVER_NAME=psi-software
PIX_RECEIVER_CITY=Belo Horizonte MG
PIX_KEY=ezequiasmartins@gmail.com
```

## ⚠️ **IMPORTANTE:**
- O arquivo `.env` nunca deve ser commitado no Git
- Use `.env.example` como template
- Copie `.env.example` para `.env` e ajuste as credenciais conforme o ambiente
- Mantenha sempre este arquivo `ENVIRONMENT_CONFIG.md` atualizado

## 🚀 **DEPLOY:**
Ao fazer deploy para produção:
1. Copie o `.env.example` para `.env` no servidor
2. Ajuste as credenciais para o ambiente remoto
3. Reinicie o serviço


-------------------------- backend ----------------------------
Bom dia!  
Aqui estão os comandos para rodar via SSH no backend do seu servidor:

```sh
rm -rf node_modules
rm -f yarn.lock
yarn install
pm2 restart psi-backend
```

Se for iniciar o backend pela primeira vez com PM2, use:

```sh
pm2 start src/index.js --name psi-backend
```

Esses comandos removem as dependências, reinstalam e reiniciam o backend com PM2.