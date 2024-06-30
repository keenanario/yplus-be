module.exports = {
    dbName: process.env.dbName,
    dbUsername: process.env.dbUsername,
    dbPassword: process.env.dbPassword,
    dbHost: process.env.dbHost,
    dbDialect: process.env.dbDialect,

    cmsKey: process.env.cmsKey,

    sessionSecret: process.env.sessionSecret,
    uploadTempPath: process.env.folderUploadPath,
    assetTempPath: process.env.folderAssetPath,
    publicTempPath: process.env.folderPublicPath,
}