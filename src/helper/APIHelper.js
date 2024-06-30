const config = require('../config/config')


exports.APIResponse  = (isOk, message, data) => {
    return JSON.stringify({
        "status": isOk,
        "message": message,
        "data": data
    })
}

exports.APIResponseOK = (res, isOk, message, data) => {
    res.status(200).contentType("application/json").send(this.APIResponse(isOk, message, data))
}

exports.APIResponseUnAuth = (res, isOk, message, data) => {
    res.status(401).contentType("application/json").send(this.APIResponse(isOk, message, data))
}

exports.APIResponseErr = (res, isOk, message, data) => {
    if(data != null)
        res.status(500).contentType("application/json").send(this.APIResponse(isOk, message, data))

    res.status(500).contentType("application/json").send(this.APIResponse(isOk, message))
}

exports.APIResponseNF = (res, isOk, message, data) => {
    res.status(404).contentType("application/json").send(this.APIResponse(isOk, message, data))
}

exports.APIResponseBR = (res, isOk, message, data) => {
    res.status(400).contentType("application/json").send(this.APIResponse(isOk, message, data))
}

exports.handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
}


exports.isEmptyObj = (obj) => {
    if (!Boolean(obj))
        return true;

    if (Array.isArray(obj)) {
        if (obj.length == 0)
            return true;
    } else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
    }
    return false;
}

exports.cmsAuth = () => {
    return (req, res, next) => {
        try {
            var token = ""
            console.log(token)
            if(req.headers.authorization != null)
                token = req.headers.authorization.split(' ')[1]
            else
                token = req.query.token
            if(token != process.env.cmsKey){
                console.log(token)
                console.log(process.env.cmsKey)
                this.APIResponseUnAuth(res, false, "Invalid User Access S")
            }else
                next()
        } catch(err){
            this.APIResponseErr(res, false, err.toString())
        }
    }
}