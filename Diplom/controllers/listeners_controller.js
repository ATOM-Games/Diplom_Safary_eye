const errorHandler = require('../utils/errorHandel')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const http = require('http');
const request = require('request');
const { stringify } = require('querystring');
const s = require('./database_controller')


module.exports.getAllListeners = async function(req, result) {
    try {
        await get_all_numbers();
        const t = Object.fromEntries(_GLOBAL_NUMBERS);
        result.status(200).json({ map: t});
    } catch (e) {
        errorHandler(result, e)
    }
}
module.exports.addListener = async function(req, res) {
    let user = await getUserByNumber(req.body.number);
    if(user){
        res.status(505).json({error : 'такой номер уже зарегестрирован'});
    }else{
        try{
            await add_all_numbers(req.body.number, req.body.name, req.body.family);
            res.status(200).json({re : 'SUPER'});
        } catch(e){
            res.status(505).json({error : 'ERROR'});
        }
    }
}

module.exports.get_all_names_module_by_phone = async function(req, res) {
    let ress = await get_all_module_by_numbers(req.body.number);
    console.log('reeeees');
    console.log(ress);
    res.status(200).json({result : ress});
}
module.exports.podpiska = async function(req, res) {
    try{
        await podpiska(req.body.number, req.body.name);
        res.status(200).json({re : 'SUPER'});
    } catch(e){
        res.status(505).json({error : 'ERROR'});
    }
}
module.exports.otpiska = async function(req, res) {
    try{
        await otpiska(req.body.number, req.body.name);
        res.status(200).json({re : 'SUPER'});
    } catch(e){
        res.status(505).json({error : 'ERROR'});
    }
}