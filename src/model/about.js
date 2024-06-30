const {sequelize} = require('../config/dbconfig')
const {DataTypes, Sequelize} = require('sequelize')

const About = sequelize.define('about', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram:{
        type: DataTypes.STRING,
        allowNull: true
    },
    facebook:{
        type: DataTypes.STRING,
        allowNull: true
    },
    tokopedia:{
        type: DataTypes.STRING,
        allowNull: true
    },
    shoppee:{
        type: DataTypes.STRING,
        allowNull: true
    },
    tiktok:{
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "about",
    timestamps: true,
    paranoid: true
})

module.exports = About