const crypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const key = require('../config/keys')
const errorHandler = require('../utils/errorHandel')
const jwt_decode = require('jwt-decode')
const s = require('./database_controller')

module.exports.login = async function(req, res) {
    let user = await getUserByLogin(req.body.login);
    if(user){
        if(user.password === req.body.password){
            res.status(200).json({
                token : 'Bearer '+user.login,
            })
        }else {
            res.status(401).json({ message : "неверный пароль" });
        }
    }else{
        res.status(404).json({ message : "пользователь не найден" });
    }
}

module.exports.register = async function(req, res) {
    let user = await getUserByLogin(req.body.login);
    if(user){
        res.status(404).json({message:"пользователь с ником '"+user.login+"' уже есть"});
    } else {
        await registrate(req.body.login, req.body.password, req.body.f_name, req.body.s_name);
        res.status(200).json({
            token : 'Bearer '+req.body.login,
        })
    }
}

module.exports.getByToken = async function(req, res) {
    let user = await getUserByLogin(req.body.login);
    const cond = {
        f_name:"Антонов",
        s_name:"Владимир"
    };//await User.findOne({ login : decoded.login });
    if(user) { // с таким логином уже есть
        res.status(200).json({ us : user });
    } else {
        res.status(404).json({ message : "пользователь не найден" });
    }

}