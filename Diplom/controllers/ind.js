const errorHandler = require('../utils/errorHandel')


module.exports.ind = async function(req, res) {
    try {
        res.status(200).json({d:"d"})
    } catch (e) {
        errorHandler(res, e)
    }
}