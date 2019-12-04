var GoogleSpreadsheet = require("google-spreadsheet");
const moment = require("../time");
const { promisify } = require("util");
const credentials = require("../credentials.json");
const spreedsheetId = "1rZ-Gq-3FISuy_KKqZgPvASQQJppRV1Mkzdqim96mvBY";
const doc = new GoogleSpreadsheet(spreedsheetId);
const go = console.log;

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


module.exports.buscarId = async (req, res, next) => {

    var id = req.params.id;

    const info = await this.acessarPlanilha();
    const folhaDeDados = info.worksheets[0];

    const linhas = await promisify(folhaDeDados.getRows)({
        query: 'id = ' + id
    })

    const obj = {}
    obj.id = linhas[0].id;
    obj.nome = linhas[0].nome;
    obj.idade = linhas[0].idade;
    obj.mae = linhas[0].mae;
    obj.contato = linhas[0].contato;
    obj.status = linhas[0].status;
    obj.foto = linhas[0].foto;

    go(obj);;

   
    res.json(obj);
}
