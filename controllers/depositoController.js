var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1KsiOkAmO58K2rXhRhC4n7OhX7muj32cvoNcd3ZMh7Rk";
const doc = new GoogleSpreadsheet(spreedsheetId);
const status = [
  "entrada",
  "recebido",
  "devolvido",
  "descartado",
  "doado",
  "leiloado",
  "impedido"
];

var sendJsonResponse = function(res, status, content) {
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

  var arr = [];
  var numero = req.body.numero;

  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const linhas = await promisify(folhaDeDados.getRows)({});

  linhas.forEach((linha, idlinha) => {
    var aux = linha.lacre.split(",");
    aux.forEach((lacre, idcoluna) => {
      let obj = {};
      obj["data"] = linha.data;
      obj["linha"] = idlinha;
      obj["coluna"] = idcoluna;
      obj["id"] = lacre.substring(0, 8);
      obj["pos"] = lacre.substring(9, 13);
      obj["processo"] = lacre.substring(14, 28);
      if (obj["processo"] === "00000000000000") {
        obj["processo"] = "Sem processo";
      }
      obj["status"] = lacre.substring(29, 31);
      obj["status"] = status[parseInt(obj["status"])];
      obj["atualizado"] = lacre.substring(32, 40);
      arr.push(obj);
    });
  });

  var filter = value => {
    return value.id === numero;
  };

  var index = arr.filter(filter);

  if (index.length === 0) {
    sendJsonResponse(res, 200, [{ response: false }]);
  } else {
    sendJsonResponse(res, 200, index);
  }
};

module.exports.atualizar = async (req, res, next) => {
  /*Esse método observa se houve atualização de:
        pos: posição do lacre
        processo: numero do processo
        status: status do lacre
        atualizado: data da última atualizaçã

        req.body: {
            pos: '',
            processo: '',
            status: '',
            atualizado: ''
        }
    */
  const arrLinhas = [];
  const info = await this.acessarPlanilha();
  const folhaDeDados = info.worksheets[0];
  const celLinhas = await promisify(folhaDeDados.getCells)({});
  const linhas = await promisify(folhaDeDados.getRows)({});
  var response = "";
  linhas.forEach(linha => {
    arrLinhas.push(linha.lacre);
  });

  let linha = parseInt(req.body.linha) + 2; //precisa somar um pois ele nas celulas conta a header como 1
  let coluna = parseInt(req.body.coluna);
  let batchId = "R" + linha.toString() + "C2";

  let filterId = celula => {
    return celula.batchId === batchId;
  };

  let celula = celLinhas.filter(filterId);

  let arrLacres = celula[0].value.split(",");

  if (req.body.pos) {
    let aux = arrLacres[coluna].replace(
      arrLacres[coluna].substring(9, 13),
      req.body.pos
    );
    arrLacres[coluna] = aux;
  }

  if (req.body.processo) {
    let aux = arrLacres[coluna].replace(
      arrLacres[coluna].substring(14, 28),
      req.body.processo
    );
    arrLacres[coluna] = aux;
  }

  if (req.body.status) {
    let aux = arrLacres[coluna].replace(
      arrLacres[coluna].substring(29, 32),
      req.body.status + ";"
    );
    arrLacres[coluna] = aux;
  }

  if (req.body.atualizado) {
    let aux = arrLacres[coluna].replace(
      arrLacres[coluna].substring(32),
      req.body.atualizado
    );

    arrLacres[coluna] = aux;
  }
  celula[0].value = arrLacres.toString();
  celula[0].save();
  folhaDeDados.bulkUpdateCells(celLinhas);

  //   sendJsonResponse(res, 200, {atualizado: true});
  sendJsonResponse(res, 200, batchId);
};
