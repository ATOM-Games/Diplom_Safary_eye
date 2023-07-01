const errorHandler = require('../utils/errorHandel')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const http = require('http');
const request = require('request');
const { stringify } = require('querystring');
const s = require('./database_controller')

var ip = require("ip");
const { log } = require('console');

module.exports.message_module = async function(req, res) {
	console.log("MMMM");
	console.log(req.body);
    if(_GLOBAL_MODULE.get(req.body[0].name)!= undefined) {
        _GLOBAL_MODULE.get(req.body[0].name).res = req.body[0];
    }
    if(_GLOBAL_MODULE.get(req.body[0].name).res.res.length>0){
        console.log(_GLOBAL_MODULE.get(req.body[0].name).res.res);
        if(Date.now() - _GLOBAL_MODULE.get(req.body[0].name).cool_daun*1000 > _GLOBAL_MODULE.get(req.body[0].name).last_send_message){
            OPOVESHENIE_VIBER(req.body[0].name);
            _GLOBAL_MODULE.get(req.body[0].name).last_send_message = Date.now();
        }
    }
    res.status(200).json({d:"d"});
}

module.exports.get_glob_res = async function(req, result) {
    try{
        if(_GLOBAL_MODULE.get(req.body.module).sub_stat && _GLOBAL_MODULE.get(req.body.module).res.res!=undefined){
            result.status(200).json({sts: ( (_GLOBAL_MODULE.get(req.body.module).res.res.length>0)? 1:0 ) });
        }else{
            result.status(200).json({sts: -1 });
        }
    } catch (E){
        if(_GLOBAL_MODULE.get(req.body.module).sub_stat){
            result.status(200).json({sts: 0 });
        }else{
            result.status(200).json({sts: -1 });
        }
    }
}

module.exports.submit = async function(req, result) {
    if(req.body.substat==='подписаться'){
        _GLOBAL_MODULE.get(req.body.module).sub_stat = true;
        try{
            const ata = JSON.stringify({
                address : "http://"+ip.address()+":2525/api/neyro/message_module/",
                method : "post"
            })
            const options = {
                hostname: req.body.ip,
                port: Number.parseInt(req.body.port),
                path: '/subscribe',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': ata.length
                },
                json: true
            }
            const rq = http.request(options,
                (res) => {
                    res.on('data', (d) => {
                        _GLOBAL_MODULE.get(req.body.module).sub_stat = true;
                        result.status(200).json({m : 'm'});
                    })
                })
            rq.on('error', (error) => {
                result.status(500).json({error : error })
            })
            rq.write(ata);
            rq.end();
        }catch(e){
            _GLOBAL_MODULE.get(req.body.module).sub_stat = false;
            result.status(500).json({error : e })
        }
    }else{
        _GLOBAL_MODULE.get(req.body.module).sub_stat = false;
        result.status(200).json({m : 'm1'});
    }
}

module.exports.getAllModules = async function(req, result) {
    console.dir ( ip.address() );
    try {
        await get_all_modules();
        const t = Object.fromEntries(_GLOBAL_MODULE);
        result.status(200).json({ map: t});
    } catch (e) {
        errorHandler(result, e)
    }
}

module.exports.getLocalIP = async function(req, res){
    try{
        res.status(200).json({ localIP : ip.address()});
    }catch(e){
        res.status(200).json({ localIP: 'locale IP-adress failed'});
    }
}

module.exports.getStatus = async function(req, result) {
    request.post(
        "http://"+req.body.ip+":"+Number.parseInt(req.body.port)+"/getStatus",
        { 
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                result.status(200).json({result : (body.status == 'OFF')? 'offline':'online'});
            }
            if(error){
                result.status(200).json({result : 'error'});
            }
        }
    );
}

module.exports.addModule = async function(req, res) {
    try{
        await add_all_modules(req.body.name, req.body.r_name, req.body.ip, req.body.port, req.body.cool, req.body.message);
        res.status(200).json({re : 'SUPER'});
    } catch(e){
        res.status(505).json({re : 'NE SUPER'});
    }
}
module.exports.editModule = async function(req, res) {
    try{
        await edit_all_modules(req.body.name, req.body.r_name, req.body.ip, req.body.port, req.body.cool, req.body.message);
        res.status(200).json({re : 'SUPER'});
    } catch(e){
        res.status(505).json({re : 'NE SUPER'});
    }
}
module.exports.deleteModule = async function(req, res) {
    try{
        await delete_all_modules(req.body.name);
        res.status(200).json({re : 'SUPER'});
    } catch(e){
        res.status(505).json({re : 'NE SUPER'});
    }
}
async function OPOVESHENIE_VIBER(name_module){
    let users = await get_all_numbers_by_module(name_module);
    users.forEach(user => {
        let str = "ВНИМАНИЕ! Уважаемый(ая) "+user.family+" "+user.name+". Уведомление модуля '"+_GLOBAL_MODULE.get(name_module).r_name+"'. "+_GLOBAL_MODULE.get(name_module).att_message
        console.log(str);
        let url = "https://api.ultramsg.com/"+_AUTH.instance+"/messages/chat"
        console.log(url);

        request.post(
            url,
            //"http://"+req.body.ip+":"+Number.parseInt(req.body.port)+"/getStatus",
            { 
                headers: {
                    'Content-Type': 'application/json',
                },
                json: {
                    token : _AUTH.token,
                    to:user.number,
                    body: str,
                    priority:10
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('sepur');
                    console.log(body);
                }
                if(error){
                    console.log(error);
                }
            }
        );
    });
}
