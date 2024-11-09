const path = require('path')
const fs = require('fs').promises

const reportarConsulta = async (req, res, next) => {
  const metodo = req.method;
  const url = req.url;
  const logMessage = `Se realizo una consulta a la url: ${url} con el método: ${metodo}`;

  console.log(logMessage)

  next();
}

const reportarErrores = async (error) => {
  const logPath = path.join(__dirname, '..', 'logs', 'log.txt')
  const logMessage = `Error: ${error}`

  try {
    await fs.appendFile(logPath, logMessage + '\n')
  } catch (e) {
    if (e.code === 'ENOENT') {
      await fs.writeFile(logPath, logMessage + '\n')
    } else {
      throw ("Error: " + e)
    }
  }
}

module.exports = {reportarConsulta, reportarErrores}