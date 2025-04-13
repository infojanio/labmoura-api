# Requisitos do sistema para cadastro, consulta e validação de laudos de análise de água.

## RFs (Requisitos Funcionais)

- [x] Deve ser possível cadastrar o laudo da análise de água.
- [x] Deve ser possível fazer o upload do laudo.
- [x] Deve ser possível assinar digitalmente o PDF do laudo enviado.
- [x] Deve ser possível buscar o laudo pela chave id gerada.

## RNs (Regras de Negócio)

- [ ] Apenas administradores poderão cadastrar laudos.
- [ ] Apenas administradores poderão validar laudos.

## RNFs (Requisitos Não Funcionais)

- [x] As senhas dos usuários devem ser armazenadas de forma criptografada.
- [x] Os dados da aplicação devem ser persistidos em um banco de dados PostgreSQL.
- [ ] Todas as listas de dados exibidas na aplicação devem ser paginadas, com um máximo de 20 itens por página.
- [ ] O sistema deve identificar usuários autenticados por meio de JWT (JSON Web Token).
- [ ] O sistema deve implementar logs detalhados para o processo de validação de pedidos e cashback, garantindo rastreabilidade.
- [ ] O sistema deve oferecer alta disponibilidade e desempenho para suportar múltiplas requisições simultâneas.
- [ ] O aplicativo deve ser responsivo, garantindo uma boa experiência de usuário em diferentes tamanhos de tela.
