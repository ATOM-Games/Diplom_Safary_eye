const sqlite = require('sqlite') 
const sqlite3 = require('sqlite3') 

let _GLOBAL_BAZA_DATA_DB = undefined;

sqlite.open({
    filename: 'C://Users/1/PycharmProjects/Diplom/diplom.db',
    driver: sqlite3.Database
  }).then((db) => {
    _GLOBAL_BAZA_DATA_DB = {};
    _GLOBAL_BAZA_DATA_DB = db;
    get_all_modules();
    get_auth_messager();
  });


_AUTH = {instance:'', token:''};

// - auth
registrate = async function(login, password, f_name, s_name) {
  await _GLOBAL_BAZA_DATA_DB.exec("insert into users (login, password, f_name, s_name) values ('"+login+"', '"+password+"', '"+f_name+"', '"+s_name+"') ");
}
getUserByLogin = async function(login){
  let ress = await _GLOBAL_BAZA_DATA_DB.get("select * from users where login='"+login+"'");
  return ress;
}


// - модули
_GLOBAL_MODULE = new Map();
get_all_modules = async function() {
  let ress = await _GLOBAL_BAZA_DATA_DB.all('select * from module');
  _GLOBAL_MODULE.clear();
  ress.forEach(oneres => {
    _GLOBAL_MODULE.set(oneres.name, { 
      name:oneres.name,
      r_name:oneres.r_name,
      ip:oneres.ip,
      port : oneres.port,
      sub_stat:false,
      res:{},
      last_send_message: -1,
      online_status: oneres.online_status,
      cool_daun: oneres.MessageCoolDawn,
      att_message: oneres.Message_Attention
    });
  });

}
add_all_modules = async function(name, r_name, ip, port, cool, message) {
  console.log("add "+name+" - "+ip+" : "+port);
  await _GLOBAL_BAZA_DATA_DB.exec("insert into module (name, r_name, ip, port, online_status, MessageCoolDawn, Message_Attention) values ('"+name+"', '"+r_name+"', '"+ip+"', "+port+", 'offline', "+cool+", '"+message+"') ");
}
edit_all_modules = async function(name, r_name, ip, port, cool, message) {
  console.log("edit "+name+" - "+ip+" : "+port);
  await _GLOBAL_BAZA_DATA_DB.exec("update module set name='"+name+"', r_name='"+r_name+"', ip='"+ip+"', port="+port+", online_status='offline', MessageCoolDawn="+cool+", Message_Attention='"+message+"' where name = '"+name+"' ");
}
delete_all_modules = async function(name) {
  console.log("delete "+name);
  await _GLOBAL_BAZA_DATA_DB.exec("delete from module where name='"+name+"'");
}


// - номера телефонов (подписчики)
_GLOBAL_NUMBERS = new Map();
get_all_numbers = async function() {
  let ress = await _GLOBAL_BAZA_DATA_DB.all('select * from phone_numbers');
  _GLOBAL_NUMBERS.clear();
  ress.forEach(oneres => {
    _GLOBAL_NUMBERS.set(oneres.number, { 
      number : oneres.number,
      name : oneres.name,
      family : oneres.family
    });
  });
}
getUserByNumber = async function(login){
  let ress = await _GLOBAL_BAZA_DATA_DB.get("select * from phone_numbers where number="+login+"");
  return ress;
}
add_all_numbers = async function(number, name, family) {
  await _GLOBAL_BAZA_DATA_DB.exec("insert into phone_numbers (number, name, family) values ("+number+", '"+name+"', '"+family+"') ");
}
edit_all_numbers = async function(number, name, family){
  await _GLOBAL_BAZA_DATA_DB.exec("update phone_numbers set name='"+name+"', family='"+family+"' where number = "+number+" ");
}
delete_all_numbers = async function(number) {
  await _GLOBAL_BAZA_DATA_DB.exec("delete from phone_numbers where number="+number+"");
}


// - подписки
get_all_numbers_by_module = async function(name_of_module){
  let ress = await _GLOBAL_BAZA_DATA_DB.all("select * from phone_numbers where number in (select phone from subscriptions_number_to_module where name_module='"+name_of_module+"')");
  return ress;
}
get_all_module_by_numbers = async function(number){
  let ress = await _GLOBAL_BAZA_DATA_DB.all("select name_module from subscriptions_number_to_module where phone="+number+"");
  let List = [];
  _GLOBAL_MODULE.forEach(mod=>{
    List.push({
      id : mod.name,
      name : mod.r_name,
      subs : isSubs(mod.name, ress)
    });
  });
  return List;
}
function isSubs(mame, ress) {
  b = false;
  for(let i=0; i<ress.length; i++){
    if(ress[i].name_module === mame){
      b = true;
      break;
    }
  }
  return b
}
podpiska = async function(number, mane){
  await _GLOBAL_BAZA_DATA_DB.exec("insert into subscriptions_number_to_module (name_module, phone) values ('"+mane+"', "+number+") ");
}
otpiska = async function(number, mane){
  await _GLOBAL_BAZA_DATA_DB.exec("delete from subscriptions_number_to_module where phone="+number+" and name_module='"+mane+"'");
}

// -- seckret
get_auth_messager = async function(){
  _AUTH = await _GLOBAL_BAZA_DATA_DB.get("select * from messanger_acc");
}