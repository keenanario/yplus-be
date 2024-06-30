const {sequelize} = require('../config/dbconfig')
const {DataTypes, Sequelize} = require('sequelize')

const Banner = sequelize.define('banner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    banner_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banner_image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    redirect_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    banner_type : {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        comment: "0 = top banner, 1 = bottom banner"
    }
}, {
    tableName: "banner",
    timestamps: true,
    paranoid: true
})

module.exports = Banner