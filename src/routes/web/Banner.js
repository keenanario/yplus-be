const router = require('express').Router()
const apiHelper = require('../../helper/APIHelper')

const Banner = require('../../model/banner')

router.get('/top', apiHelper.handleErrorAsync(async(req, res, next) => {
    var data = await Banner.findAll({
        where: {is_active: 1, banner_type: 0}
    })

    if(apiHelper.isEmptyObj(data))
        return apiHelper.APIResponseNF(res, false, "Banner not found")

    return apiHelper.APIResponseOK(res, true, "Banner data", data)
}))

router.get('/bot', apiHelper.handleErrorAsync(async(req, res, next)=> {
    var data = await Banner.findOne({
        where: {is_active: 0, banner_type: 1}
    })

    if(apiHelper.isEmptyObj(data))
        return apiHelper.APIResponseNF(res, false, "Banner not found")

    return apiHelper.APIResponseOK(res, true, "Banner data", data)
}))