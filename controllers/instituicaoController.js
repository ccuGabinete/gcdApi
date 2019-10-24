var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1vVvxlyw2a911JIHUc7ovmDQ8D-nt-6gCidIMIDRaTxo";
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
            razaosocial: string;
            chpj: string;
            responsavel: string;
            cpf: string;
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string;
            bairro: string;
            municipio: string;
            estado: string;
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
  console.log(req.body);
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0]
  const linhas = await promisify(folhaDeDados.getRows)({
      query: 'processo = ' + processo
  })

  res.json(linhas);
}

module.exports.atualizar = async (req, res, next) => {
  /*Esse método atualiza o codigo;

        req.body: {
            linha: string,
            codigo: string,
        }
    */
  var linha = parseInt(req.body.linha);
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const celLinhas = await promisify(folhaDeDados.getCells)({});
  const pos_codigo = ((linha) * 15) + 15;
  celLinhas[pos_codigo].value = req.body.codigo;
  celLinhas[0].save();
  folhaDeDados.bulkUpdateCells(celLinhas);
  sendJsonResponse(res, 200, { atualizado: true });
};


