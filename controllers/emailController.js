const nodeMailer = require('nodemailer');
const inicio = 43639;
const fim = 65536;
const reg = new RegExp(/[a-z]/i);
const max = 4;

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

const geraCodigo = () =>{
    let bol = false;
    let sorteado = '';
    let tamanho = 5;

    while (bol === false || tamanho !== max) {
      sorteado = Math.floor(Math.random() * fim + inicio).toString(16);
      bol = reg.test(sorteado);
      tamanho = sorteado.length;
    }
    return sorteado;
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

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ccugabinete@gmail.com',
            pass: 'Ni244265@'
        }
    });

    let mailOptions = {
        // should be replaced with real recipient's account
        to: 'ccugabinete@gmail.com',
        subject: 'Codigo',
        body: codigo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });

    res.send(codigo);
    res.end();
}
  
