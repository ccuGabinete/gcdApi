var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1dFzvtT4ksPOXKpP2pgxuwirq1kgSxObl4uD-Wekx0a8";
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

module.exports.atualizar = async (req, res, next) => {
  console.log(req.body);

  var linha = parseInt(req.body.id);
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const celLinhas = await promisify(folhaDeDados.getCells)({});
  console.log(celLinhas[0]);
  const pos = (linha * 5) + 4;
  celLinhas[pos].value = req.body.entregue;
  celLinhas[0].save();
  folhaDeDados.bulkUpdateCells(celLinhas);

  sendJsonResponse(res, 200, { pos: pos });
};

module.exports.listar = async (req, res, next) => {
  const processo = req.body.processo;
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0]
  const linhas = await promisify(folhaDeDados.getRows)({})

  if (linhas.length !== 'undefined' || linhas.length > 0) {
    res.json(linhas);;
  } else {
    res.json([]);
  }

}

