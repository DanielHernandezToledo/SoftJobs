const express = require('express')
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/userRoutes')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

app.listen(3000, () => console.log('Listening on port 3000'));
app.use(cors())
app.use(express.json())

app.use('/', userRoutes)