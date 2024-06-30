require('dotenv').config()
const PORT = process.env.PORT || 3000

const express = require('express')
const bodyParser = require('body-parser')
const {sequelize} = require('./src/config/dbconfig')
const config = require('./src/config/config')
const cors = require('cors')
const session = require('express-session')
const morgan = require('morgan')
const busboy = require('connect-busboy')
const apiHelper = require('./src/helper/APIHelper')

const productRouter = require('./src/routes/web/ProductRouter')
const categoryRouter = require('./src/routes/web/ProductCategoryRouter')

const adminProductRouter = require('./src/routes/admin/AdminProductRouter')

const app = express()

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

app.use(cors())
app.use(busboy())
app.use(morgan('tiny'))

// Cross-Origin
const allowCrossDomain = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
}
app.use(allowCrossDomain)

app.get('/', (req, res) => {
    res.send("Hello World")
})

// Folder Path
app.use('/upload', express.static(config.uploadTempPath))
app.use('/asset', express.static(config.assetTempPath))
app.use('/public', express.static(config.publicTempPath))

// Routes
app.use('/product', productRouter)
app.use('/category', categoryRouter)

// Admin Routes
app.use('/admin/product', adminProductRouter)

// Error Handling Middleware
function errorHandler(err, req, res, next){
    console.error(err.stack)
    apiHelper.APIResponseErr(res, false, err.toString(), null)
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        console.error(err.stack);
        apiHelper.APIResponseErr(res, false, err.toString(), null)
    } else {
        next(err);
    }
}

function logErrors(err, req, res, next) {
    apiHelper.APIResponseErr(res, false, err.toString(), null)
    console.error(err.stack)
    next(err);
}

app.use(errorHandler);
app.use(clientErrorHandler);
app.use(logErrors);

// Starting the server
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    });
});