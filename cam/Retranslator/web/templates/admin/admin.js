
$(document).ready(function() {
    //  Убрать обводку кнопки
    $(".btn_no_focus").focus(function(){
        this.blur()
    })

    //  Сокеты
    socket.on('message', function(data){
        console.log(data)
    })

    socket.on('error', function(data){
        let text = data['text']
        let action = data['action']
        swal({
            text: text,
            icon: "error"
        })
        init_action(action)
    })

    socket.on('action', function(data){
        let action = data['action']
        init_action(action)
    })
})

//  Эл-ты страницы
var display = $("#display")[0]
var enable_display_btn = $("#enable_display_btn")[0]
var disable_display_btn = $("#disable_display_btn")[0]
var span_status = $("#span_status")[0]
var span_status_values = {
    0: "выключен",
    1: "запущен"
}
var start_btn = $("#start_btn")[0]
var refresh_btn = $("#refresh_btn")[0]
var stop_btn =  $("#stop_btn")[0]

//  Эл-ты страницы - конфиг
var mode_variable_div = $("#mode_variable")[0]
var cfg_spans = {}
var cfg_changed = {}
for (let cfg_span of $("#config_box").find("span,.param")){
    let param_name = $(cfg_span).data("param_name")
    cfg_spans[param_name] = cfg_span
    cfg_changed[param_name] = false
}


//  Сокет
var socket = io()

//  Переменные
var fps = 10
var display_update_i = 1/fps*1000
var display_enabled = false
var started = false


//  Сокеты
function init_action(action){
    switch(action){
        case "stop":
            on_stopped()
            break
        default:
            break
    }
}


//  Изображение
function request_display_image(){
    $.post('get_b64_frame_json', function(response){
        let status = response["status"]
        if(status=="success"){
            let data = response["data"]
            update_display(data)
            if(display_enabled){
                setTimeout(()=>{request_display_image()}, display_update_i)
            }
        }else if(status=="error"){
            swal({
                text: "Ошибка получения изображения",
                icon: "error"
            })
            disable_display()
        }
    })
}

function update_display(data){
    let frame = data["b64_frame"]
    if(display_enabled){
        display.src = "data:image/jpeg;base64," + frame
    }else{
        display.src = "web/common/img/no_image.jpg"
    }
}

function enable_display(){
    if(started){
        display_enabled = true
        request_display_image()
        enable_display_btn.disabled = true
        disable_display_btn.disabled = false
    }
}

function disable_display(){
    display_enabled = false;
    enable_display_btn.disabled = false
    disable_display_btn.disabled = true
    display.src = "web/common/img/no_image.jpg"
}


//  Управление
function request_start(){
    $.post('start', function(response){
        let status = response["status"]
        if(status=="success"){
            on_started()
        } else if (status=="error"){
            on_stopped()
        }
    })
}

function on_started(){
    started = true
    start_btn.disabled = true
    refresh_btn.disabled = true
    stop_btn.disabled = false
    set_span_status(1)
}

function request_stop(){
    $.post('stop', function(response){
        let status = response["status"]
        if(status=="success"){
            on_stopped()
        }
    })
}

function on_stopped(){
    started = false
    start_btn.disabled = false
    refresh_btn.disabled = false
    stop_btn.disabled = true
    set_span_status(0)
}


function set_span_status(status_id){
    span_status.innerText = span_status_values[status_id]
}

function show_req_info(){
    let text_to_show = `POST /get_b64_frame \n возвращает байт-строку b64\n
        POST /get_b64_frame_json \n возвращает json-строку вида:\n {"status":"success","data":{"b64_frame":b64}}`
    swal({
        text: text_to_show,
        buttons: {
            confirm: "ОК"
        }
    });

}

function request_refresh(){
    $.post('refresh', function(response){
        let status = response["status"]
        if (status == "success"){
            swal({
                text: "Конфигурация обновлена",
                icon: "success"
            })
        }else if (status == "error"){
            swal({
                text: "Конфигурация не обновлена",
                icon: "error"
            })
        }
    })
}


//  Конфигурация


function get_cfg_value(param_name){
    let node = cfg_spans[param_name]
    let data_param_value = $(node).data("param_value")
    if (data_param_value){
        return data_param_value
    }else{
        return node.innerText
    }
}

function request_save_cfg(){

    let changed_cfg = {}
    let is_changed = false
    for (let key in cfg_changed){
        if (cfg_changed[key]){
            is_changed = true
            changed_cfg[key] = get_cfg_value(key)
        }
    }

    if (!is_changed){
        swal({
            text: "Конфигурация не была изменена",
            icon: "error"
        })
        return
    }

    let request_data = {
        "changed_cfg": JSON.stringify(changed_cfg)
    }
    $.post('save_config', request_data, function(response){
        let status = response["status"]
        if (status == "success"){
            swal({
                text: "Сохранено",
                icon: "success"
            })
            for (let key in cfg_changed){
                cfg_changed[key] = false
            }
        }else if (status == "error"){
            swal({
                text: "Не сохранено",
                icon: "error"
            })
        }
    })
}

function set_host(){
    let param_name = "host"
    let node = cfg_spans[param_name]
    let old_value = node.innerText
    let input = $('<input type="text" class="form-control input_gray" placeholder="127.0.0.1">')[0]
    input.value = old_value
    swal({
        title: "Введите адрес",
        content: input
    }).then((resp)=>{
        if (resp == null){
            return
        }
        let value = input.value
        if (value!=""){
            node.innerText = input.value
        }
        if (value != old_value){
            cfg_changed[param_name] = true
        }
    })
}

function set_port(){
    let param_name = "port"
    let node = cfg_spans[param_name]
    let old_value = node.innerText
    let input = $('<input type="number" class="form-control input_gray" placeholder="10000" min="0" max="65535">')[0]
    input.value = old_value
    swal({
        title: "Введите порт",
        content: input
    }).then((resp)=>{
        if (resp == null){
            return
        }
        let value = input.value
        if (value < input.min){
            value = input.min
        }else if (value > input.max){
            value = input.max
        }
        if(value!=""){
            node.innerText = input.value
        }
        if (value != old_value){
            cfg_changed[param_name] = true
        }
    })
}

function set_fps(){
    let param_name = "fps"
    let node = cfg_spans[param_name]
    let old_value = node.innerText
    let input = $('<input type="number" class="form-control input_gray" placeholder="10" min="0" max="60">')[0]
    input.value = old_value
    swal({
        title: "Введите частоту",
        content: input
    }).then((resp)=>{
        if (resp == null){
            return
        }
        let value = input.value
        if (value < input.min){
            value = input.min
        }else if (value > input.max){
            value = input.max
        }
        if (value!=""){
            node.innerText = input.value
        }
        if (value != old_value){
            cfg_changed[param_name] = true
        }
    })
}

function set_mode(){
    let param_name = "mode"
    let node = cfg_spans[param_name]
    let old_value = $(node).data("param_value")
    let select = $(`
        <select class="form-select input_gray">
            <option value="device">подключенная камера</option>
            <option value="screen">экран монитора</option>
            <option value="ip-camera">IP-камера</option>
        </select>
    `)[0]
    select.value = old_value
    swal({
        title: "Выберите источник",
        content: select
    }).then((resp)=>{
        if (resp == null){
            return
        }
        let value = select.value
        let text = $(select).find("option:selected")[0].innerText
        $(node).data("param_value", value)
        node.innerText = text

        for(let i=0; i<mode_variable_div.children.length; i++){
            let child = mode_variable_div.children[i]
            $(child).addClass("d-none")
        }
        switch(value){
            case "device":
                $(cfg_spans["device_id"]).parent().removeClass("d-none")
                break
            case "ip-camera":
                $(cfg_spans["ip_camera_address"]).parent().removeClass("d-none")
                break
            default:
                break
        }

        if (value != old_value){
            cfg_changed[param_name] = true
        }
    })
}

function set_device_id(){
    let param_name = "device_id"
    let node = cfg_spans[param_name]
    let old_value = node.innerText
    let input = $('<input type="number" class="form-control input_gray" placeholder="0" min="0" max="10">')[0]
    input.value = old_value
    swal({
        title: "Введите идентификатор",
        content: input
    }).then((resp)=>{
        if (resp == null){
            return
        }
        let value = input.value
        if (value < input.min){
            value = input.min
        }else if (value > input.max){
            value = input.max
        }
        if (value!=""){
            node.innerText = input.value
        }
        if (value != old_value){
            cfg_changed[param_name] = true
        }
    })
}

function set_ip_camera_address(){
    let param_name = "ip_camera_address"
    let node = cfg_spans[ip_camera_address]
    let old_value = node.innerText
    let input = $('<input type="text" class="form-control input_gray" placeholder="http://127.0.0.1:10000">')[0]
    input.value = old_value
    swal({
        title: "Введите адрес IP-камеры",
        content: input
    }).then((resp)=>{
        if (resp == null){
            return
        }
        let value = input.value
        if (value!=""){
            node.innerText = input.value
        }
        if (value != old_value){
            cfg_changed[param_name] = true
        }
    })
}
