// Controlador responsável pela lógica de verificação
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // [ESPAÇO PRONTO PARA SEU BANCO DE DADOS]
        // Exemplo de integração futura com ORM (Sequelize/Prisma):
        // const user = await User.findOne({ where: { email } });
        
        // Simulação de validação estática idêntica aos dados da UI enviada
        if (email === "fulano.souza@gmail.com" && password === "12345678") {
            return res.status(200).json({
                success: true,
                message: "Autenticação realizada com sucesso!",
                token: "JWT_TOKEN_SIMULADO_AQUI",
                user: { name: "Empreendedor Fulano de Souza", empresa: "Fulano Calçados" }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "E-mail ou senha incorretos."
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
};
