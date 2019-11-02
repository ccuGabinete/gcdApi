const nodemailer = require('nodemailer');
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

    async function main() {
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ccugabinete@gmail.com',
                pass: 'Ni244265@'
            }
        });

        let info = await transporter.sendMail({
            from: '"Gabinete" <ccugabinete@gmail.com>',
            to: 'ccugabinete@gmail.com',
            subject: 'Codigo ✔',
            text: codigo
        });

    }

    main()
    .then(data => {
        sendJsonResponse(res, 200, {codigo: codigo})
    })
    .catch(error => {
        sendJsonResponse(res, 500, error);
    });

};
