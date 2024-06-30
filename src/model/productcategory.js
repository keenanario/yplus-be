const {sequelize} = require('../config/dbconfig')
const {DataTypes, Sequelize} = require('sequelize')

const ProductCategory = sequelize.define('product_category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: "m_product_category",
    timestamps: true,
    paranoid: true
})

module.exports = ProductCategory