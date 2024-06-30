const router = require('express').Router()
const apiHelper = require('../../helper/APIHelper')
const config = require('../../config/config')

const Product = require('../../model/product')
const ProductVariant = require('../../model/productvariant')
const ProductCategory = require('../../model/productcategory')

const adminAuth = apiHelper.cmsAuth()
const strHelper = require('../../helper/StringHelper')
const fs = require('fs')
const path = require('path')

// === PRODUCT ROUTE ===
router.post('/add', adminAuth, apiHelper.handleErrorAsync(async(req, res, next)=> {
    var submit = {}
    var imageToAdd = {}
    var fsStream

    if (!req.busboy) {
        return apiHelper.APIResponseBR(res, false, 'Data Tidak Boleh Kosong');
    }

    req.pipe(req.busboy)
    req.busboy.on('field', (field, val, info) => {
        if(field != "product_image")
            submit[field] = val;
    })

    req.busboy.on('file', async function(fieldName, file, info){
        if(fieldName != "product_image")
            return apiHelper.APIResponseBR(res, false, "Uploade image")
        
        try {
            const ext = path.extname(info.filename).toLowerCase()
            if(!['.jpg', '.jpeg', '.png'].includes(ext)){
                return apiHelper.APIResponseBR(res, false, "You can only upload image in JPG, JPEG, and PNG")
            }

            const fileAbsPath = path.join(config.uploadTempPath, 'product')
            await fs.promises.mkdir(fileAbsPath, {recursive: true})

            const fileName = "product_" + strHelper.removeSpaces(info.filename)
            const fullPath = path.join(fileAbsPath, fileName)
            const relativePath = path.join('/product', fileName)

            var normalizedFilePath = relativePath.split(path.sep).join('/')

            fsStream = fs.createWriteStream(fullPath)
            file.pipe(fsStream)
            fsStream.on('error', (error) => {
                console.error("error occured during file writting:", error)
            })

            imageToAdd = {
                name: fileName,
                mimetype: info.filename,
                path: normalizedFilePath
            }
        }catch (error) {
            console.error("error occured during file processing: ", error)
            return apiHelper.APIResponseErr(res, false, "Error during file processing")
        }
    })

    req.busboy.on('finish', async function() {
        if(!imageToAdd || Object.keys(imageToAdd).length === 0)
            return apiHelper.APIResponseBR(res, false, "Silahkan upload gambar")
        if(apiHelper.isEmptyObj(submit.name))
            return apiHelper.APIResponseBR(res, false, "Product name cannot be empty")
        if(apiHelper.isEmptyObj(submit.description))
            return apiHelper.APIResponseBR(res, false, "Description cannot be empty")
        if(apiHelper.isEmptyObj(submit.base_price) || submit.base_price <= 0)
            return apiHelper.APIResponseBR(res, false, "Base Price cannot be empty")
        if(apiHelper.isEmptyObj(submit.category_id) || submit.category_id <= 0)
            return apiHelper.APIResponseBR(res, false, "Please select the category")

        var saveData = {
            name: submit.name,
            category_id: submit.category_id,
            base_price: submit.base_price,
            image_path: imageToAdd.path,
            description: submit.description
        }

        try{
            const product = await Product.create(saveData)

            if(product){
                return apiHelper.APIResponseOK(res, true, "Product succesfully created", product)
            } else{
                return apiHelper.APIResponseErr(res, false, "Failed to create product");
            }
        }catch (error){
            return apiHelper.APIResponseErr(res, false, "Error requesting create product")
        }
    })
}))


// === PRODUCT VARIANT ROUTE ===
router.post('/variant/add', adminAuth, apiHelper.handleErrorAsync(async(req, res, next)=> {
    var submit = {}
    var imageToAdd = {}
    var fsStream

    if (!req.busboy) {
        return apiHelper.APIResponseBR(res, false, 'Data Tidak Boleh Kosong');
    }

    req.pipe(req.busboy)
    req.busboy.on('field', (field, val, info) => {
        if(field != "variant_image")
            submit[field] = val;
    })
    
    req.busboy.on('file', async function(fieldName, file, info){
        if(fieldName != "variant_image")
            return apiHelper.APIResponseBR(res, false, "Uploade image")
        
        try {
            const ext = path.extname(info.filename).toLowerCase()
            if(!['.jpg', '.jpeg', '.png'].includes(ext)){
                return apiHelper.APIResponseBR(res, false, "You can only upload image in JPG, JPEG, and PNG")
            }

            const fileAbsPath = path.join(config.uploadTempPath, 'product/variant')
            await fs.promises.mkdir(fileAbsPath, {recursive: true})

            const fileName = "product_variant_" + strHelper.removeSpaces(info.filename)
            const fullPath = path.join(fileAbsPath, fileName)
            const relativePath = path.join('/product/variant', fileName)

            var normalizedFilePath = relativePath.split(path.sep).join('/')

            fsStream = fs.createWriteStream(fullPath)
            file.pipe(fsStream)
            fsStream.on('error', (error) => {
                console.error("error occured during file writting:", error)
            })

            imageToAdd = {
                name: fileName,
                mimetype: info.filename,
                path: normalizedFilePath
            }
        }catch (error) {
            console.error("error occured during file processing: ", error)
            return apiHelper.APIResponseErr(res, false, "Error during file processing")
        }
    })

    req.busboy.on('finish', async function() {
        if(!imageToAdd || Object.keys(imageToAdd).length === 0)
            return apiHelper.APIResponseBR(res, false, "Silahkan upload gambar")
        if(apiHelper.isEmptyObj(submit.variant_name))
            return apiHelper.APIResponseBR(res, false, "Product name cannot be empty")
        if(apiHelper.isEmptyObj(submit.product_id) || submit.product_id <= 0)
            return apiHelper.APIResponseBR(res, false, "Please select the product")
        if(apiHelper.isEmptyObj(submit.variant_price) || submit.base_price <= 0)
            return apiHelper.APIResponseBR(res, false, "Variant Price cannot be empty")

        var saveData = {
            variant_name: submit.variant_name,
            product_id: submit.product_id,
            variant_price: submit.variant_price,
            variant_image: imageToAdd.path,
        }

        try{
            const product = await ProductVariant.create(saveData)

            if(product){
                return apiHelper.APIResponseOK(res, true, "Product Variant succesfully created", product)
            } else{
                return apiHelper.APIResponseErr(res, false, "Failed to create product variant");
            }
        }catch (error){
            return apiHelper.APIResponseErr(res, false, "Error requesting create product variant")
        }
    })
}))


// === PRODUCT CATEGORY ROUTE ===
router.post('/category/add', adminAuth, apiHelper.handleErrorAsync(async(req, res, next) => {
    var data = req.body
    console.log(data)
    var parent_id = null
    if(apiHelper.isEmptyObj(data.name))
        return apiHelper.APIResponseBR(res, false, "Category name cannot be empty")


    if(!apiHelper.isEmptyObj(data.parent_id))
        parent_id = data.parent_id

    var saveData = {
        name: data.name,
        parent_id: parent_id
        }

        try {
            const category = await ProductCategory.create(saveData)

            if(category){
                return apiHelper.APIResponseOK(res, true, "Category successfully created", category)
            }else{
                return apiHelper.APIResponseErr(res, false, "Failed to create category");
            }
        }catch (error){
            return apiHelper.APIResponseErr(res, false, "Error requesting create category", error)
        }
}))

router.patch('/category/edit/:category_id', adminAuth, apiHelper.handleErrorAsync(async( req, res, next) => {
    var data = req.body
    var categoryId = req.params.category_id

    if(Object.keys(data).length === 0)
        return apiHelper.APIResponseBR(res, false, "No input found")

    const categoryData = await ProductCategory.findByPk(categoryId)

    if(apiHelper.isEmptyObj(categoryData))
        return apiHelper.APIResponseNF(res, false, "Category not found")

    // TODO: blm selesai
}))

router.get("/category/all", adminAuth, apiHelper.handleErrorAsync(async(req, res, next) => {
    var data = await ProductCategory.findAll()

    if(apiHelper.isEmptyObj(data))
        return apiHelper.APIResponseNF(res, false, "Category Not Found")

    const resultData = strHelper.transformCategory(data)

    return apiHelper.APIResponseOK(res, true, "Category found", resultData)
}))

module.exports = router