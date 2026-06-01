const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares obrigatórios para segurança e parsing
app.use(cors());
app.use(express.json()); // Permite ler corpo de requisições em formato JSON

// Definição das rotas da API
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor ANT rodando com sucesso na porta ${PORT}`);
});
