
# Ambiente de desenvolvimento ou produção
NODE_ENV=development

# JWT para autenticação (mantenha isso em segredo!)
JWT_SECRET=iakibackend

# Senha do certificado digital A1 (.pfx)
CERT_PASSWORD=1234  

# URL pública base usada no QR Code gerado
# Substitua abaixo pela URL: https://seu-projeto.up.railway.app final do backend após deploy
PUBLIC_REPORT_URL=http://localhost:3333

# Caminho absoluto ou relativo ao certificado
CERT_PATH=src/certs/certificado.pfx  

# Banco de dados PostgreSQL 
# Localhost para dev — em produção use a URL fornecida pelo Railway
DATABASE_URL="postgresql://janio:j2240@localhost:5432/apilabmoura?schema=public"
