var defApp = '/var/www/html/app/.git';
var defApi = '/var/www/html/api/.git';
var defNode = '/var/www/html/node/.git';

var TELEGRAMTOKEN = '';
var NOMBREBOT = ''; //@nombreBot


var Bot = require('node-telegram-bot');
var exec = require('child_process').exec;

console.log('Inicio del Bot');
var bot = new Bot({
    token: TELEGRAMTOKEN
}).on('message', function (message) {
        console.log(message);
        if(typeof message.new_chat_participant != "undefined") return nuevoParticipante(message);
        if(typeof message.left_chat_participant != "undefined") return salidaParticipante(message);
        if(typeof message.text != "undefined") return leeMensaje(message);

    })
    .start();

function nuevoParticipante(datos){
    opciones = {chat_id:datos.chat.id, text: 'Hola! '+datos.new_chat_participant.first_name+'...'};
    bot.sendMessage(opciones,function(){
        console.log('mensaje enviado');
    });
}

function salidaParticipante(datos){
    opciones = {chat_id:datos.chat.id, text: 'Usuario '+datos.left_chat_participant.first_name+' ha salido...'};
    bot.sendMessage(opciones,function(){
        console.log('mensaje enviado');
    });
}

function leeMensaje(datos){
    var mensaje = datos.text.replace(NOMBREBOT+' ','');
    msjStatus = mensaje.split(" ");

    switch (msjStatus[0]) {
        case '/ayuda':
            comandos.ayuda(datos);
            break;
        case '/gitpull':
            comandos.gitpull(datos, msjStatus[1]);
            break;
        case '/gitstatus':
            comandos.gitstatus(datos, msjStatus[1]);
            break;
    }

}


function ejecutarBash(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

function imprimeResultBash(datos){

}



var comandos = {
    ayuda: function(datos){
        opciones = {chat_id:datos.chat.id, text: 'Para poder hacer pull utiliza el siguiente comando:\n /gitpull _nombre-proyecto_ \n \n Para poder revisar el status de un proyecto:\n /gitstatus _nombre-proyecto_. \n \n Ves como esta bien fácil... \n '};
        bot.sendMessage(opciones,function(){ });
    },
    gitpull: function(datos,proyecto){
        var repo;
        switch (proyecto) {
            case 'App':
                repo = defApp;
                break;
            case 'Api':
                repo = defApi;
                break;
            case 'Node':
                repo = defNode;
                break;
            default :
                repo = false;
                break;
        }
        if(repo){
            ejecutarBash('git --git-dir '+repo+' pull', function(bashResult){
                opciones = {chat_id:datos.chat.id, text: bashResult};
                bot.sendMessage(opciones,function(){ });
            });
        }else{
            opciones = {chat_id:datos.chat.id, text: 'El proyecto no es valido... :/'};
            bot.sendMessage(opciones,function(){ });
        }
    },
    gitstatus: function(datos,proyecto){
        var repo;
        switch (proyecto) {
            case 'App':
                repo = defApp;
                break;
            case 'Api':
                repo = defApi;
                break;
            case 'Node':
                repo = defNode;
                break;
            default :
                repo = false;
                break;
        }
        if(repo){
            ejecutarBash('git --git-dir '+repo+' log -1', function(bashResult){
                opciones = {chat_id:datos.chat.id, text: bashResult};
                bot.sendMessage(opciones,function(){ });
            });
        }else{
            opciones = {chat_id:datos.chat.id, text: 'El proyecto no es valido... :/'};
            bot.sendMessage(opciones,function(){ });
        }
    }
};