const {sequelize} = require('../config/dbconfig')
const {DataTypes, Sequelize} = require('sequelize')
const ProductCategory = require('./productcategory')
const ProductVariant = require('./productvariant')

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_path: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    base_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_main: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "product",
    timestamps: true,
    paranoid: true
})

Product.belongsTo(ProductCategory, {foreignKey: 'category_id', as: 'category'})
Product.hasMany(ProductVariant, {foreignKey: 'product_id'})

module.exports = Product