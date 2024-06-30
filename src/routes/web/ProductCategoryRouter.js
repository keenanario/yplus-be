const config = require('../../config/config')
const router = require('express').Router()
const StringHelper = require("../../helper/StringHelper")
const apiHelper = require('../../helper/APIHelper')


const ProductCategory = require('../../model/productcategory')

router.get('/all', apiHelper.handleErrorAsync(async(req, res, next) => {
    var data = await ProductCategory.findAll()

    if(apiHelper.isEmptyObj(data))
        return apiHelper.APIResponseNF(res, false, "Category Not Found")

    const newData = StringHelper.transformCategory(data)

    return apiHelper.APIResponseOK(res, true, "Category found", newData)
}))

module.exports = router