const router = require('express').Router()
const apiHelper = require('../../helper/APIHelper')

const Product = require('../../model/product')
const ProductCategory = require('../../model/productcategory')
const ProductVariant = require('../../model/productvariant')

router.get('/:category_id', apiHelper.handleErrorAsync(async(req, res, next) => {
    const categoryId = req.params.category_id

    try {
        const allCategoryIds = []
        async function fetchAllCategoryIds(catId) {
            allCategoryIds.push(catId)
            const subCategoryIds = await getSubCategory(catId)

            for(const subId of subCategoryIds){
                await fetchAllCategoryIds(subId)
            }
        }

        await fetchAllCategoryIds(categoryId)
        const products = await getProductsForCategories(allCategoryIds)

        if(apiHelper.isEmptyObj(products) || (await products).length === 0)
            return apiHelper.APIResponseNF(res, false, "Product not found")
    
        return apiHelper.APIResponseOK(res, true, "Product found", products)
    }catch (error){
        return apiHelper.APIResponseBR(res, false, "Error occur when searching product", error)
    } 
}))

router.get('/detail/:product_id', apiHelper.handleErrorAsync(async(req, res, next) => {
    const productId = req.params.product_id

    var data = await Product.findOne({
        where: {id: productId},
        include: [{model: ProductVariant}]
    })

    if(apiHelper.isEmptyObj(data))
        return apiHelper.APIResponseNF(res, false, "Product not found")
    

    var product = {
        product_id: data.id,
        product_name: data.name,
        product_desc: data.desc,
        product_image: data.image_path,
        product_base_price: data.base_price,
        product_variants: data.product_variants.map(variant => ({
            variant_id: variant.id,
            variant_name: variant.variant_name,
            variant_price: variant.variant_price,
            variant_image: variant.variant_image
        }))
    }
    
    return apiHelper.APIResponseOK(res, true, "Product data", product)
    
}))

async function getSubCategory(categoryId){
    const subCategory = await ProductCategory.findAll({
        where: {parent_id: categoryId},
        attributes: ['id']
    })

    return subCategory.map(sub => sub.id)
}

async function getProductsForCategories(categoryIds){
    const products = await Product.findAll({
        attributes: [['id', 'product_id'], ['name', 'product_name'], ['image_path', 'product_image'], ['base_price', 'product_price']],
        order: [['updatedAt', 'DESC']],
        where: {category_id: categoryIds}
    })

    return products
}

module.exports = router