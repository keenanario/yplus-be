const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const query = "SELECT * FROM products WHERE is_main = 1 AND date_deleted IS NULL"
    db.query(query, (err, rows) => {
        if(err){
            return res.status(500).json({
                status: 'error',
                message: 'internal server error'
            })
        }else if (rows.length <= 0){
            return res.status(404).json({
                status: 'error',
                message: 'no data found'
            })
        }else{
            return res.status(200).json({
                status: 'success',
                message: 'product data',
                data: rows
            })
        }
    })
})

module.exports = router