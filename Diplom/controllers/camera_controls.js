const errorHandler = require('../utils/errorHandel')
const http = require('http')

cameras = [
    { ip : '10.0.0.161', port : '10001' }
]
camera_result = "";

module.exports.get_result = async function(req, res) {
    resul.status(200).json({data : camera_result})
}

module.exports.start = async function(req, res) {
    //get_image()
    resul.status(200).json({data : ""})
}



module.exports.get_image = async function(req, resul) {
    try{
        console.log('u000u');
        const ata = JSON.stringify({ })
        const options = {
            hostname: '127.0.0.1',
            port: 10001,
            path: '/get_b64_frame_json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': ata.length
            },
            json: true
        }
        console.log("ddd");
        const rq = http.request(options,
            (res) => {
                console.log(`statusCode: ${res.statusCode}`)
                res.on('data', (d) => {
                    this.camera_result = d.toString('utf8');
                    //console.log(camera_result);
                    resul.status(200).json({data : d.toString('utf8')});
                    //console.log(camera_result);
                })
            })
        rq.on('error', (error) => {
            console.error(error);
            console.log('ploho');
            resul.status(500).json({error : error })
        })
        rq.end();
    }catch (e) {
        resul.status(500).json({error : e })
    }
}
module.exports.set_image = async function(req, res) {
    try {
        res.status(200).json({d:"d"})
    } catch (e) {
        errorHandler(res, e)
    }
}