require('dotenv').config() // .env file support for configuration
const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUI = require ('swagger-ui-express')
const swaggerJsDoc = require ('swagger-jsdoc')
const routes = require('./routes/router');

const swaggerOption = require ('./swagger')
const jsDoc = swaggerJsDoc (swaggerOption)

app.use ('/swagger', swaggerUI.serve, swaggerUI.setup(jsDoc))

const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000

// middlewares
app.use(cors());                // allow cors origin
app.use(express.json());        // accept json
app.use('/api', routes);         // route handler for '/cats'

// start app
app.listen(EXPRESS_PORT, () => console.log(`Example app listening on port ${EXPRESS_PORT}!`));
