const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { promisify } = require('util')

module.exports.gerarSenha = async (senha) => {
    return await promisify(bcrypt.hash)(senha, saltRounds);
}

module.exports.validarSenha = async (senha, hashSenha) => {
    return await promisify(bcrypt.compare)(senha, hashSenha)
}
