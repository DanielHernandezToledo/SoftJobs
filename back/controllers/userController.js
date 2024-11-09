
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { usuarioExistente, crear } = require('../models/userModel')
const {reportarErrores} = require('../helpers/helperUsuario')

const crearUsuario = async (req, res) => {
  try {

    const { email, password, rol, lenguage } = req.body
    const existeUsuario = await usuarioExistente(email)
    if (existeUsuario) {
      throw { code: 409, message: "El usuario ya existe." }
    }

    if (!email || !password || !rol || !lenguage) {
      return res.status(400).json({message: "Todos los campos son obligatorios"})
    }

    const bcryptPassword = await bcrypt.hashSync(password, 10)

    await crear(email, bcryptPassword, rol, lenguage)
    res.status(201).json({message: "Usuario creado con éxito"});
  } catch (error) {
    reportarErrores(error.message)
    res.status(500).json({message: "No fue posible crear el usuario"});
  }
}


const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({message: "El email y la contraseña son obligatorios"})
    }
    const usuario = await usuarioExistente(email)
    if (!usuario) {
      return res.status(404).json({message: "Usuario no encontrado"})
    }
    const passwordCoincide = await bcrypt.compare(password, usuario.password)

    if (!passwordCoincide) {
      return res.status(401).json({message: "Contraseña incorrecta"})
    }
    const token = jwt.sign({ email }, "clave_secreta")

    res.status(200).json({ token });

  } catch (error) {
    reportarErrores(error.message)
    res.status(500).json({message: "Error al iniciar sesión"})
  }
}

const datosUsuario = async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    if (!Authorization) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = Authorization.split("Bearer ")[1]
    if (!token) {
      return res.status(401).json({ message: "Token no válido" });
    }

    jwt.verify(token, "clave_secreta")
    const { email } = jwt.decode(token)
    const usuario = await usuarioExistente(email)
    const {rol, lenguage} = usuario
    res.status(200).json([{ email, rol, lenguage }])
  } catch (error) {
    await reportarErrores(error.message)
    res.status(403).json({ message: "Token inválido o expirado" });
  }
}


module.exports = { crearUsuario, iniciarSesion, datosUsuario }