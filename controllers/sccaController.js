const request = require('request');
const iconv = require('iconv-lite');
URL_OF_WEBSITE = 'http://scca.rio.rj.gov.br/index.php/online?im=';
var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}


module.exports.getScca = (req, res, next) => {
    let notificado = {
        "matricula": "",
        "concessao": "",
        "isento": "",
        "equipamento": "",
        "local": "",
        "situacao": "",
        "nome": "",
        "cpf": "",
        "nomeaux": "",
        "cpfaux": ""
    };
    request.get({
        uri: URL_OF_WEBSITE + req.body.matricula,
        encoding: null
    },
        function (err, resp, body) {
            if (err) {
                sendJsonResponse(res, 500, err)
            } else {
                let bodyWithCorrectEncoding = iconv.decode(body, 'iso-8859-1');
                let bodyText = JSON.stringify(bodyWithCorrectEncoding);
                if (bodyText.length < 1000) {
                    sendJsonResponse(res, 400, notificado);
                } else {                   
                   
                    let result = bodyText.match(/<span>(.*?)<\/span>/g).map(function (val) {
                        let campos = val.replace(/<\/?span>/g, '');
                        return campos;
                    });

                    notificado['matricula'] = result[0];
                    notificado['concessao'] = result[1];
                    notificado['isento'] = result[2];
                    notificado['equipamento'] = result[3];
                    notificado['local'] = result[4];
                    notificado['situacao'] = result[5];
                    notificado['nome'] = result[6];
                    notificado['cpf'] = result[7];

                    if (result.length < 11) {
                        notificado['nomeaux'] = '';
                        notificado['cpfaux'] = '';
                    } else {
                        notificado['nomeaux'] = result[8];
                        notificado['cpfaux'] = result[9];
                    }

                    sendJsonResponse(res, 200, notificado)
                }
            }


        });


}