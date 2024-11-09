const express = require('express')
const router = express.Router()
const {reportarConsulta} = require('../helpers/helperUsuario')


const {crearUsuario, iniciarSesion, datosUsuario} = require('../controllers/userController')

router.post('/usuarios', reportarConsulta, crearUsuario)

router.post('/login', reportarConsulta, iniciarSesion)

router.get('/usuarios', reportarConsulta, datosUsuario)

module.exports = router