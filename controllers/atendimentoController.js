var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1SfIWbNeGu63oqezhLNfBcgg20T8DQf1nSEoSyhaTlUw";
const doc = new GoogleSpreadsheet(spreedsheetId);

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
        Esse método requer o um objeto atendimento
        req.body: {
            processo: string
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

module.exports.buscar = async (req, res, next) => {
  const processo = req.body.processo;
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0]
  const linhas = await promisify(folhaDeDados.getRows)({
      query: 'processo = ' + processo
  })

  if(linhas.length !== 'undefined' || linhas.length > 0){
    res.json(linhas[0]);;
  }else{
    res.json([]);
  }
  
}

