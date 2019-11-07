var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1IuEDNCAfoL6Ra7b1KvTeooWA-QNoBqZVPFjXmMoelW8";
const doc = new GoogleSpreadsheet(spreedsheetId);
const status = [
  "entrada",
  "recebido",
  "devolvido",
  "descartado",
  "doado",
  "leiloado",
  "impedido",
  "requerido"
];

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.acessarPlanilha = async () => {
  try {
    const doc = new GoogleSpreadsheet(spreedsheetId);
    await promisify(doc.useServiceAccountAuth)(credentials);
    return await promisify(doc.getInfo)();
  } catch (err) {
    console.log(err);
  }
};

module.exports.salvar = async (req, res, next) => {
  /*
        Esse método requer o um objeto auto
        req.body: {
            numero: string,
            pos: string
        }

        e retorna:
        {
            salvo: boolean
        }
    */

  req.body.data = moment.time();

  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const response = await promisify(folhaDeDados.addRow)(req.body);
  if (response) {
    sendJsonResponse(res, 200, { salvo: true });
  } else {
    sendJsonResponse(res, 200, { salvo: false });
  }
};

module.exports.buscarAuto = async (req, res, next) => {
  /*
        Esse método requer o número do auto
        req.body: {
            numero: ''
        }

        e retorna:
        index: {
            "data": Date,
            "numero": string,
            "pos": string
        }
    */

  let arr = [];
  let numero = req.body.numero;
  let obj = {
    numero: '',
    pos: '',
    trm: []
  }

  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];

  const linhas = await promisify(folhaDeDados.getRows)({
    query: 'numero = ' + numero
  })

  if(linhas.length > 0){
    obj.trm = linhas[0].trm.split(';')
    obj.numero = linhas[0].numero;
    obj.pos = linhas[0].pos;
  }
 
  res.json(obj);
}

module.exports.contar = async (req, res, next) => {
  /*
       Retorna: a quantidade de autos salvos na planilha
    */

  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];

  const linhas = await promisify(folhaDeDados.getRows)({
  })


 
  sendJsonResponse(res, 200, {quantidade: linhas.length});
}

