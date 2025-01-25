# Requisitos do Aplicativo de Cashback

## RFs (Requisitos Funcionais)

- [x] Deve ser possível o usuário se cadastrar.
- [] Deve ser possível o usuário cadastrar o seu endereço.
- [] Deve ser possível o usuário editar seu cadastro.
- [] Deve ser possível o usuário alterar a senha.
- [x] Deve ser possível o usuário se autenticar.
- [x] Deve ser possível obter o perfil do usuário logado.
- [x] Deve ser possível obter o saldo do usuário logado.
- [x] Deve ser possível cadastrar uma loja.
- [] Deve ser possível o usuário cadastrar o endereço de sua loja.
- [x] Deve ser possível cadastrar o produto.
- [] Deve ser possível cadastrar a categoria do produto.
- [] Deve ser possível cadastrar a subcategoria do produto.
- [x] Deve ser possível o usuário consultar o histórico de pedidos.
- [x] Deve ser possível o usuário realizar pedidos em uma loja.
- [x] Deve ser possível o usuário buscar lojas pelo nome.
- [x] Deve ser possível o usuário buscar lojas próximas (até 20 km) com base em sua localização.
- [ ] Deve ser possível validar o cashback.
- [ ] Deve ser possível o usuário buscar subcategorias por categoria.
- [ ] Deve ser possível o usuário buscar produtos por subcategoria.
- [ ] Deve ser possível o usuário buscar produtos pelo nome.
- [x] Deve ser possível validar o pedido (cashback) de um usuário.
- [ ] Deve ser possível verificar e validar os itens do pedido, assegurando que os itens adicionados no app correspondem aos itens pagos na loja física.
- [ ] Deve ser possível agregar o cashback validado ao saldo do cliente.

## RNs (Regras de Negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado.
- [x] O usuário não pode fazer 2 pedidos na mesma hora do mesmo dia;
- [x] O usuário não poderá fazer pedidos se não estiver a uma distância máxima de 10.000m da loja.
- [x] O pedido só poderá ser validado até 48 horas após sua criação.
- [ ] Apenas administradores poderão validar pedidos.
- [ ] Apenas administradores poderão cadastrar lojas.
- [ ] Apenas administradores poderão cadastrar produtos com cashback.
- [ ] Durante a validação do pedido, o sistema deve comparar os itens do pedido com os itens efetivamente pagos na loja física antes de aprovar o cashback.
- [ ] O cashback validado deve ser automaticamente creditado no saldo do cliente após a validação bem-sucedida.

## RNFs (Requisitos Não Funcionais)

- [x] As senhas dos usuários devem ser armazenadas de forma criptografada.
- [x] Os dados da aplicação devem ser persistidos em um banco de dados PostgreSQL.
- [ ] Todas as listas de dados exibidas na aplicação devem ser paginadas, com um máximo de 20 itens por página.
- [ ] O sistema deve identificar usuários autenticados por meio de JWT (JSON Web Token).
- [ ] O sistema deve implementar logs detalhados para o processo de validação de pedidos e cashback, garantindo rastreabilidade.
- [ ] O sistema deve oferecer alta disponibilidade e desempenho para suportar múltiplas requisições simultâneas.
- [ ] O aplicativo deve ser responsivo, garantindo uma boa experiência de usuário em diferentes tamanhos de tela.

## Tabelas e Campos

1. users (Tabela de Usuários)

   id (String, PK, UUID, único)
   name (String, obrigatório)
   email (String, único, obrigatório)
   password (String, obrigatório, criptografado)
   role (Enum: USER | ADMIN, padrão: USER)
   created_at (DateTime, padrão: now)
   updatedAt (DateTime, atualizado automaticamente)

2. stores (Tabela de Lojas)

   id (String, PK, UUID, único)
   name (String, obrigatório)
   location (JSON ou campos específicos de latitude/longitude, obrigatório)
   created_at (DateTime, padrão: now)
   updatedAt (DateTime, atualizado automaticamente)

3. products (Tabela de Produtos)

   id (String, PK, UUID, único)
   name (String, obrigatório)
   description (String, opcional)
   price (Decimal, obrigatório)
   cashbackPercentage (Float, obrigatório, ex.: 0.05 para 5%)
   storeId (String, FK para stores.id)
   created_at (DateTime, padrão: now)
   updatedAt (DateTime, atualizado automaticamente)

4. orders (Tabela de Pedidos)

   id (String, PK, UUID, único)
   userId (String, FK para users.id)
   storeId (String, FK para stores.id)
   totalAmount (Decimal, obrigatório)
   created_at (DateTime, padrão: now)
   validatedAt (DateTime, opcional, usado para registrar a validação do pedido)
   status (Enum: PENDING | VALIDATED | EXPIRED, padrão: PENDING)

5. orderItems (Tabela de Itens do Pedido)

   id (String, PK, UUID, único)
   orderId (String, FK para orders.id)
   productId (String, FK para products.id)
   quantity (Integer, obrigatório)
   subtotal (Decimal, obrigatório)

6. cashbacks (Tabela de Cashback)

   id (String, PK, UUID, único)
   userId (String, FK para users.id)
   orderId (String, FK para orders.id, opcional, usado para vincular o cashback ao pedido correspondente)
   amount (Decimal, obrigatório)
   creditedAt (DateTime, padrão: now)
