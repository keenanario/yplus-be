const { Sequelize } = require('sequelize')
const config = require('./config')

const sequelize = new Sequelize(config.dbName, config.dbUsername, config.dbPassword, {
    host: config.dbHost,
    dialect: config.dbDialect,
    timezone: '+07:00',
    port: 8889,
    dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: function (field, next){
            if(field.type === "DATETIME"){
                return field.string()
            }
            return next()
        },
    },
})

sequelize.authenticate().then(() => {
    console.log('Database connection success')
})
.catch((err) => {
    console.error('Unable to connect to the database: ', err)
})

module.exports = { sequelize }