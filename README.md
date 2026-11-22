# 🧼 Sistema Norteador — Lavação Web

Exercício prático do **Instituto Federal de Santa Catarina (IFSC)** que simula o site de uma lavação de carros fictícia, a "Lavação Web".

O projeto começou com HTML, CSS, JS e PHP (ainda guardado na pasta `legado/`). Agora ele está dividido em:

| Pasta       | Tecnologia                                          | Função                                  |
|-------------|-----------------------------------------------------|-----------------------------------------|
| `frontend/` | React + Vite + TypeScript + Material UI + React Router | Site público, login e dashboard         |
| `backend/`  | Java 17 + Spring Boot 3 + Spring Data JPA           | API REST (substitui os arquivos PHP)    |
| `database/` | MySQL                                               | `dump.sql` com as tabelas e dados de teste |
| `legado/`   | HTML/CSS/JS/PHP                                     | Versão antiga, só para consulta         |

---

## 🗺️ Rotas

### Frontend (React Router)

| Rota                            | Acesso    | Antes (legado)         |
|---------------------------------|-----------|------------------------|
| `/`                             | público   | `index.html`           |
| `/cadastro`                     | público   | `cadastro.html`        |
| `/login`                        | público   | *(novo)*               |
| `/dashboard`                    | com login | *(novo)*: resumo       |
| `/dashboard/veiculos`           | com login | `listar_veiculos.html` |
| `/dashboard/veiculos/novo`      | com login | `veiculo.html` (agora é um modal sobre a lista de veículos) |
| `/dashboard/agendamentos`       | com login | *(novo)*               |
| `/dashboard/agendamentos/novo`  | com login | `agendamento.html`     |

### Backend (Java / Spring Boot), porta 8080

| Método | Rota                         | Acesso    | Substitui                  |
|--------|------------------------------|-----------|----------------------------|
| POST   | `/api/auth/login`            | público   | *(novo)*                   |
| GET    | `/api/auth/me`               | com token | *(novo)*                   |
| POST   | `/api/auth/logout`           | com token | *(novo)*                   |
| POST   | `/api/clientes`              | público   | `processa_cadastro.php`    |
| GET    | `/api/automoveis[?meus=true]`| com token | `listar_veiculos.php`      |
| POST   | `/api/automoveis`            | com token | `processa_automoveis.php`  |
| GET    | `/api/agendamentos`          | com token | *(novo)*                   |
| POST   | `/api/agendamentos`          | com token | `processa_agendamento.php` |
| GET    | `/api/marcas`                | com token | *(novo)*: marcas da FIPE + adicionadas |
| GET    | `/api/marcas/{codigo}/modelos` | com token | *(novo)*: modelos da marca (FIPE) |
| POST   | `/api/marcas`                | com token | *(novo)*: adiciona marca que não está na FIPE |

### Marcas e modelos: API gratuita da Tabela FIPE

As marcas e os modelos vêm da [API FIPE](https://deividfortuna.github.io/fipe/) (`parallelum.com.br/fipe`), que é **gratuita e não precisa de cadastro nem de chave**. Quem chama a FIPE é o backend Java (`FipeService`), que:

- guarda as respostas em memória por 24 horas, para não estourar o limite de requisições da API gratuita;
- simplifica os nomes dos modelos ("Gol 1.0 Mi Total Flex 8V" vira "Gol");
- junta as marcas da FIPE com as marcas adicionadas pelo modal "Adicionar marca" (tabela `marcas_personalizadas`);
- se a FIPE estiver fora do ar, devolve as marcas populares, e o modelo pode ser digitado à mão.

A tabela `marcas_personalizadas` é criada **automaticamente** pelo backend ao iniciar (`backend/src/main/resources/schema.sql`), sem apagar dados. O arquivo `database/marcas_personalizadas.sql` faz a mesma coisa, caso prefira criar à mão.

> 🌐 O backend precisa de **internet** para buscar marcas e modelos na FIPE. Sem internet, aparecem só as marcas populares e o modelo é digitado à mão.

As rotas "com token" exigem o cabeçalho `Authorization: Bearer <token>`, com o token devolvido pelo login.
Os dados são enviados e recebidos em **JSON**. Em caso de erro a resposta é `{ "status": 400, "message": "..." }`.

Exemplo de login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"lucas","senha":"1234"}'
```

---

## 🚀 Como rodar

O sistema tem **três partes**, que precisam estar ligadas ao mesmo tempo: o **banco MySQL**, o **backend Java** e o **frontend React**. Siga os passos na ordem.

### ✅ Pré-requisitos

| Ferramenta | Versão | Para quê | Como conferir |
|------------|--------|----------|---------------|
| MySQL      | 8+ (ou o MariaDB do XAMPP) | Banco de dados | `mysql --version` |
| JDK (Java) | 17 ou mais novo | Rodar o backend | `java -version` |
| Maven      | 3.9+ | Compilar e subir o backend | `mvn -v` |
| Node.js    | 20+ | Rodar o frontend | `node -v` |

> 💡 Quem usa o **IntelliJ IDEA** não precisa instalar Java nem Maven separadamente: abra a pasta `backend/` no IntelliJ, que ele baixa o JDK e já traz o Maven.

---

### 1. Banco de dados

1. Ligue o MySQL:
   - **XAMPP:** abra o painel do XAMPP e clique em *Start* no **MySQL** (o Apache não é necessário).
   - **MySQL Server instalado no Windows:** o serviço normalmente já inicia sozinho com o computador.
2. Importe o arquivo `database/dump.sql`, que cria o banco `sistema_norteador` com as tabelas e os dados de teste:
   - **phpMyAdmin:** aba *Importar* → escolha `database/dump.sql` → *Executar*.
   - **MySQL Workbench:** *Server* → *Data Import* → *Import from Self-Contained File*.
   - **Script pronto (Windows):** acha o `mysql.exe` sozinho, pede a senha e importa com os acentos certos:

     ```powershell
     powershell -ExecutionPolicy Bypass -File database\recriar-banco.ps1
     ```
   - **Terminal** (na pasta raiz do projeto). Tire o `-p` se o root não tiver senha (padrão do XAMPP):

     ```bash
     # Git Bash, Linux, macOS ou Prompt de Comando (cmd)
     mysql -u root -p --default-character-set=utf8mb4 < database/dump.sql
     ```

     ```powershell
     # PowerShell (ele não aceita o "<", por isso o cmd /c)
     cmd /c "mysql -u root -p --default-character-set=utf8mb4 < database\dump.sql"
     ```

> ⚠️ O dump **apaga e recria** as tabelas do banco `sistema_norteador`. Outros bancos não são alterados.

---

### 2. Backend Java (porta 8080)

O backend se conecta ao MySQL com o usuário `root` **sem senha** (padrão do XAMPP). Se o seu MySQL tiver senha, informe pelas variáveis de ambiente `DB_USER` e `DB_PASS` antes de subir:

**PowerShell (Windows):**

```powershell
cd backend
$env:DB_PASS = "senha_do_mysql"     # só se o root tiver senha
mvn spring-boot:run
```

**Git Bash / Linux / macOS:**

```bash
cd backend
export DB_PASS=senha_do_mysql       # só se o root tiver senha
mvn spring-boot:run
```

**Sem Maven instalado, usando o Maven que vem com o IntelliJ** (PowerShell). Ajuste os caminhos para a versão instalada no seu computador:

```powershell
cd backend
$env:JAVA_HOME = "C:\Users\SEU_USUARIO\.jdks\openjdk-25"   # pasta do JDK (a que contém bin\java.exe)
$env:DB_PASS = "senha_do_mysql"                            # só se o root tiver senha
& "C:\Program Files\JetBrains\IntelliJ IDEA 2025.2.1\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
```

**IntelliJ IDEA:** abra a pasta `backend/`, espere o Maven baixar as dependências e rode a classe `NorteadorApplication` (botão ▶). Para informar a senha do banco: *Run* → *Edit Configurations* → *Environment variables* → `DB_PASS=senha_do_mysql`.

> As variáveis `$env:` valem só para aquele terminal: ao abrir um terminal novo, defina de novo.

O backend está pronto quando aparecer no terminal:

```
Started NorteadorApplication in ... seconds
```

Para testar se a API está no ar, abra outro terminal e faça o login de teste (deve voltar um `token`):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/login -ContentType "application/json" -Body '{"usuario":"lucas","senha":"1234"}'
```

> Também dá para mudar usuário e senha direto em `backend/src/main/resources/application.properties`, mas **não faça commit da sua senha**: prefira a variável `DB_PASS`.

---

### 3. Frontend React (porta 5173)

Abra **outro terminal** (o do backend precisa continuar aberto):

```bash
cd frontend
npm install      # só na primeira vez (e sempre que o package.json mudar)
npm run dev      # ou: npm start
```

O frontend está pronto quando aparecer `Local: http://localhost:5173/`.

---

### 4. Acessar o sistema

Abra **http://localhost:5173** no navegador e entre com um dos usuários de teste:

| Usuário     | Senha      |
|-------------|------------|
| `lucas`     | `1234`     |
| `joaosilva` | `senha456` |

> 🎓 **Login para a correção do professor:** usuário `lucas` e senha `1234`.

Também é possível criar uma conta nova pela página **Cadastro**.

> As senhas do dump estão em texto puro só para facilitar os testes. No primeiro login, o backend troca cada uma por um hash **BCrypt**. Novos cadastros já são salvos com hash.
>
> ⚠️ Essas senhas são as **do site**, não a senha do MySQL.

Em desenvolvimento, o Vite encaminha as chamadas para `/api` ao backend em `http://localhost:8080`, então não é preciso configurar a URL da API.

---

### 🛠️ Problemas comuns

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| Backend mostra `Access denied for user 'root'@'localhost'` | O MySQL tem senha e ela não foi informada | Defina `DB_PASS` (passo 2) |
| Backend mostra `Unknown database 'sistema_norteador'` | O dump não foi importado | Faça o passo 1 |
| Backend mostra `Communications link failure` | O MySQL está desligado | Ligue o MySQL (passo 1) |
| `mvn` ou `java` não é reconhecido | Java/Maven não estão instalados ou não estão no PATH | Instale o JDK 17+ e o Maven, ou rode pelo IntelliJ |
| `The JAVA_HOME environment variable is not defined correctly` | `JAVA_HOME` aponta para uma pasta errada | Aponte `JAVA_HOME` para a pasta do JDK (a que contém `bin\java.exe`) |
| `Port 8080 was already in use` | Outro programa usa a porta 8080 | Feche o outro programa (ou rode com `SERVER_PORT=8081` e ajuste o proxy em `frontend/vite.config.ts`) |
| `Port 5173 is already in use` | Outro projeto Vite está aberto | Feche o outro projeto, ou use outra porta: `npm run dev -- --port 5180` |
| Login dá `403` / `Invalid CORS request` | O site foi aberto por um endereço que não é `localhost` nem `127.0.0.1` | Abra pelo `http://localhost:PORTA`, ou libere o endereço com `APP_CORS_ORIGIN=http://endereco:porta` ao subir o backend |
| "Usuário ou senha inválidos" | Senha errada (ex.: usar a senha do MySQL) | Use os usuários de teste da tabela do passo 4 |
| `Plugin caching_sha2_password could not be loaded` ao importar | O cliente `mysql` do XAMPP é antigo para um MySQL 8+ | Use o `mysql.exe` do próprio MySQL Server (o script `recriar-banco.ps1` já faz isso), o Workbench ou o phpMyAdmin |
| Login no site dá **Erro HTTP 502** | O backend não está rodando (o Vite não tem para onde mandar a chamada) | Suba o backend (passo 2) e espere o `Started NorteadorApplication` |
| `npm error Missing script: "start"` | `package.json` antigo | Use `npm run dev` |
| Lista de **marcas vazia** | Backend sem internet (a FIPE não respondeu) ou backend desatualizado | Confira a internet e reinicie o backend |
| Acentos quebrados (ex.: `├ôleo`) | O dump foi importado com a codificação errada | Importe de novo pelo `recriar-banco.ps1`, phpMyAdmin ou com `--default-character-set=utf8mb4` |

---

## 📁 Estrutura

```
database/
├── dump.sql                    # Cria o banco com tabelas e dados de teste (apaga os dados atuais)
├── marcas_personalizadas.sql   # Cria só a tabela de marcas adicionadas
└── recriar-banco.ps1           # Script do Windows que importa o dump.sql

backend/src/main/java/br/edu/ifsc/norteador/
├── config/       # AuthInterceptor (protege as rotas), CORS, tratamento de erros
├── controller/   # Rotas REST: Auth, Cliente, Automovel, Agendamento, Marca
├── dto/          # Objetos de entrada/saída da API
├── model/        # Entidades JPA (clientes, automoveis, agendamentos, marcas_personalizadas)
├── repository/   # Acesso ao banco (Spring Data JPA)
└── service/      # Regras de negócio, login, tokens e FipeService (API da Tabela FIPE)

backend/src/main/resources/
├── application.properties      # Porta, banco, CORS e URL da FIPE
└── schema.sql                  # Cria tabelas que faltarem ao iniciar

frontend/src/
├── auth/         # Contexto de login e rota protegida
├── components/   # Layouts, modais (veículo, marca) e campos de marca/modelo
├── hooks/        # useCarregar (busca de dados)
├── pages/        # Home, Login, Cadastro e páginas do dashboard
├── api.ts        # Chamadas à API Java
├── servicos.ts   # Catálogo de serviços de lavação e utilitários
├── theme.ts      # Tema Material UI (cores neon do projeto original)
└── types.ts      # Tipos TypeScript dos dados
```

---

## 👤 Desenvolvedora

* **Aluna:** Sabrina Miyamoto
