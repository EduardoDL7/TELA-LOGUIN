// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear JSON e URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos (CSS, JS, etc.) - assumindo que o HTML está na pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Array de usuários (JSONs fictícios) - armazenado no servidor
// Use esses para testar: joao@example.com / senha123 (sucesso) - SEM ESPAÇOS!
const users = [
    {
        name: "João Silva",
        email: "joao@example.com",
        password: "senha123",
        cpf: "123.456.789-00"
    },
    {
        name: "Maria Oliveira",
        email: "maria@example.com",
        password: "abc456",
        cpf: "987.654.321-00"
    },
    {
        name: "Pedro Santos",
        email: "pedro@example.com",
        password: "xyz789",
        cpf: "456.789.123-00"
    }
];

// Log para confirmar que o array carregou
console.log('Usuários carregados:', users.length, 'usuários disponíveis.');

// Rota para servir a página principal (HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para processar o login (POST)
app.post('/login', (req, res) => {
    console.log('=== LOGIN TENTADO ===');
    console.log('Dados recebidos do form:', req.body);  // Log: Mostra { email: '...', password: '...' }

    const { email, password } = req.body;
    const trimmedEmail = (email || '').trim().toLowerCase();  // Remove espaços e converte para minúscula
    const trimmedPassword = (password || '').trim();  // Remove espaços

    console.log('Email processado:', trimmedEmail);
    console.log('Senha processada:', trimmedPassword);

    // Buscar usuário no array (comparação case-insensitive para email)
    const user = users.find(u => 
        u.email.toLowerCase() === trimmedEmail && 
        u.password === trimmedPassword
    );

    console.log('Usuário encontrado?', user ? 'SIM: ' + user.name : 'NÃO');
    console.log('=== FIM DO LOGIN ===\n');

    if (user) {
        // Sucesso: redireciona para uma página de sucesso
        res.redirect(`/success?name=${encodeURIComponent(user.name)}`);
    } else {
        // Falha: redireciona para uma página de erro
        res.redirect('/error?message=Credenciais inválidas');
    }
});

// Rota para página de sucesso
app.get('/success', (req, res) => {
    const userName = req.query.name || 'Usuário';
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sucesso</title>
            <style>
                body { 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    background-color: #f6f5f7; 
                    font-family: Arial, sans-serif; 
                }
                .message { 
                    text-align: center; 
                    padding: 40px; 
                    background: #fff; 
                    border-radius: 10px; 
                    box-shadow: 0 0 15px rgba(0,0,0,0.2); 
                    max-width: 400px;
                }
                .message h2 { color: teal; margin-bottom: 10px; }
                .message p { color: #333; margin-bottom: 20px; }
                .message button { 
                    padding: 12px 25px; 
                    background: teal; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    font-size: 16px;
                }
                .message button:hover { background: #006666; }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>Usuário logado com sucesso!</h2>
                <p>Bem-vindo, ${userName}!</p>
                <button onclick="window.location.href='/'">Voltar ao Login</button>
            </div>
        </body>
        </html>
    `);
});

// Rota para página de erro
app.get('/error', (req, res) => {
    const message = req.query.message || 'Erro desconhecido';
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro</title>
            <style>
                body { 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    background-color: #f6f5f7; 
                    font-family: Arial, sans-serif; 
                }
                .message { 
                    text-align: center; 
                    padding: 40px; 
                    background: #fff; 
                    border-radius: 10px; 
                    box-shadow: 0 0 15px rgba(0,0,0,0.2); 
                    max-width: 400px;
                }
                .message h2 { color: red; margin-bottom: 10px; }
                .message p { color: #333; margin-bottom: 20px; }
                .message button { 
                    padding: 12px 25px; 
                    background: teal; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    font-size: 16px;
                }
                .message button:hover { background: #006666; }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>${message}</h2>
                <p>Tente novamente com credenciais corretas.</p>
                <button onclick="window.location.href='/'">Tentar Novamente</button>
            </div>
        </body>
        </html>
    `);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Credenciais de teste:');
    console.log('- joao@example.com / senha123');
    console.log('- maria@example.com / abc456');
    console.log('- pedro@example.com / xyz789');
});
