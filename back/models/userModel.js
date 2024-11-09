const pool = require('../config/db')

const usuarioExistente = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1"
  const valores = [email]
  const { rows } = await pool.query(consulta, valores)
  if (rows) {
    return rows[0]
  }
  return false
}

const crear = async (email, password, rol, lenguage) => {
  const consulta = "INSERT INTO usuarios (id, email, password, rol, lenguage) VALUES (Default, $1, $2, $3, $4)"
  const valores = [email, password, rol, lenguage]
  const { rowCount } = await pool.query(consulta, valores)
  if (!rowCount) {
    throw { code: 404, message: "No fue posible crear el usuario." }
  }
  return { email, rol, lenguage };
}

module.exports = { usuarioExistente, crear }