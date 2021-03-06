const nodeMailer = require('nodemailer');
const inicio = 43639;
const fim = 65536;
const reg = new RegExp(/[a-z]/i);
const max = 4;
const go = console.log;

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

const geraCodigo = () => {
    let bol = false;
    let sorteado = '';
    let tamanho = 5;
    let restodivisao = 0;

    while (bol === false || tamanho !== max || restodivisao !== 0) {
        sorteado = Math.floor(Math.random() * fim + inicio).toString(16);
        bol = reg.test(sorteado);
        tamanho = sorteado.length;
        restodivisao = restodivisao = parseInt(sorteado, 16) % 5;
        go(sorteado);
        go(restodivisao);
    }
    return parseInt(sorteado, 16);
}

module.exports.enviar = async (req, res, next) => {
    /*
          Esse método requer o um objeto email
          req.body: {
              codigo: string
          }
  
          e retorna:
          {
              salvo: boolean
          }
      */

    const codigo = geraCodigo();

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'ccugabinete@gmail.com',
        from: 'app148641805@heroku.com',
        subject: 'Código',
        text: codigo.toString(),
        html: '<strong>' + codigo + '</strong>'
    };
    sgMail.send(msg);

    res.send({ codigo: codigo });

}

