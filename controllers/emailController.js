require('dotenv').config({path: './.env'});
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

    var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
 
// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }
}
 
var nodemailerMailgun = nodemailer.createTransport(mg(auth));
 
nodemailerMailgun.sendMail({
  from: 'ccugabinete@gmail.com',
  to: 'ccugabinete@gmail.com',
  subject: 'Hey you, awesome!',
  'h:Reply-To': 'reply2this@company.com',
  //You can use "html:" to send HTML email content. It's magic!
  html: '<b>Wow Big powerful letters</b>',
  //You can use "text:" to send plain-text content. It's oldschool!
  text: 'Mailgun rocks, pow pow!'
}, function (err, info) {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    res.send(codigo);
    res.end();
  }
});
    
}
  
