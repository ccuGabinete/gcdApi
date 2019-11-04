const moment = require("moment-timezone");

module.exports.time = () => {
  var data = Date.now();
  var dt = moment(data);
 return dt.tz("America/Sao_Paulo").format("DD/MM/YYYY hh:mm:ss");
};
