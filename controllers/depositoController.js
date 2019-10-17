var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1KsiOkAmO58K2rXhRhC4n7OhX7muj32cvoNcd3ZMh7Rk";
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
        Esse método requer o um objeto lacre
        req.body: {
            data: Date,
            lacre: arr.toString()
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

module.exports.buscarLacre = async (req, res, next) => {
  /*
        Esse método requer o número do lacre
        req.body: {
            numero: ''
        }

        e retorna:
        index: {
            "data": "",
            "linha": 0,
            "coluna": 0,
            "id": "",
            "pos": "",
            "processo": "",
            "status": "",
            "atualizado": ""
        }
    */

  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const linhas = await promisify(folhaDeDados.getRows)({});

  if (linhas.length === 0) {
    sendJsonResponse(res, 200, [{ response: false }]);
  } else {
    sendJsonResponse(res, 200, linhas);
  }
};


module.exports.atualizaCartorio = async (req, res, next) => {
  /*Esse método atualiza o lacre e o processo;

        req.body: {
            linha: string,
            lacre: string,
            processo: string
        }
    */
  var linha = parseInt(req.body.linha);
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const celLinhas = await promisify(folhaDeDados.getCells)({});
  const pos_lacre = (linha * 6) + 5;
  const pos_processo = (linha * 6) + 4;
  celLinhas[pos_processo].value = req.body.processo;
  celLinhas[pos_lacre].value = req.body.lacre;
  celLinhas[0].save();
  folhaDeDados.bulkUpdateCells(celLinhas);
  sendJsonResponse(res, 200, { atualizado: true });
};

module.exports.atualizaPlantao = async (req, res, next) => {
  /*Esse método atualiza o auto e sua posicao

        req.body: {
            linha: string,
            auto: string,
            pos: string
        }
    */
  var linha = parseInt(req.body.linha);
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const celLinhas = await promisify(folhaDeDados.getCells)({});
  const pos_auto = (linha * 6) + 2;
  const pos_pos = (linha * 6) + 1;
  celLinhas[pos_auto].value = req.body.auto;
  celLinhas[pos_pos].value = req.body.pos;
  
  celLinhas[0].save();
  folhaDeDados.bulkUpdateCells(celLinhas);

  sendJsonResponse(res, 200, { atualizado: true });
};

module.exports.buscarPos = async (req, res, next) => {
  /*
        Esse método requer a posição do auto
        req.body: {
            pos: ''
        }

        e retorna:
        index: {
            "data": "",
            "linha": 0,
            "coluna": 0,
            "id": "",
            "pos": "",
            "processo": "",
            "status": "",
            "atualizado": ""
        }
    */
  var arr = [];
  var pos = req.body.pos;

  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const linhas = await promisify(folhaDeDados.getRows)({
    query: 'pos = ' + pos
  });

  linhas.forEach((linha, idlinha) => {
    var aux = linha.lacre.split(",");
    aux.forEach((lacre, idcoluna) => {
      let obj = {};
      obj["data"] = linha.data;
      obj["linha"] = idlinha;
      obj["coluna"] = idcoluna;
      obj["id"] = lacre.substring(0, 8);
      obj["status"] = lacre.substring(9, 11);
      obj["atualizado"] = lacre.substring(12, 20);
      obj["pos"] = linha.pos;
      arr.push(obj);
    });
  });

  if (arr.length === 0) {
    sendJsonResponse(res, 200, [{ response: false }]);
  } else {
    sendJsonResponse(res, 200, arr);
  }
};

