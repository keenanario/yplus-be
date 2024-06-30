const {sequelize} = require('../config/dbconfig')
const {DataTypes, Sequelize} = require('sequelize')

const ProductVariant = sequelize.define('product_variant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    variant_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    variant_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    variant_image: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "product_variant",
    timestamps: true,
    paranoid: true
})

module.exports = ProductVariant