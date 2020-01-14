var token = "";
var url = "https://api.telegram.org/bot" + token;
var WebAppUrl = "https://script.google.com/macros/s/AKfycbwMwPb8rOGahpyCfOF4aekAfKM-55CI1LVhe2v-Zjx_gj12GkU/exec";
var ssId = "1ghj9QjNs-y2Y3ETs9GjMWRVcrrPD8BO8SJDNtmHRnfQ";
var myId = "235955893";


function setWebhook() {
  var Response = UrlFetchApp.fetch(url + "/setWebhook?url=" + WebAppUrl);
  Logger.log(Response.getContentText());
}

function sendText(id, text) {
  var Response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text));
  Logger.log(Response.getContentText());
}

function forwardText(chat, from, message) {
  var Response = UrlFetchApp.fetch(url + "/forwardMessage?chat_id=" + chat + "&from_chat_id=" + from + "&message_id=" + message);
  Logger.log(Response.getContentText());
}

function sendAnimation(channel, gif) {
  var Response = UrlFetchApp.fetch(url + "/sendAnimation?chat_id=" + channel + "&animation=" + gif);
  Logger.log(Response.getContentText());
}

function sendSticker(channel, stick) {
  var Response = UrlFetchApp.fetch(url + "/sendSticker?chat_id=" + channel + "&sticker=" + stick);
  Logger.log(Response.getContentText());
}

function doPost(e){
  var contents = JSON.parse(e.postData.contents);    
  var sheet = SpreadsheetApp.openById(ssId);
  var sheetName = "Слив";
  var cont = contents.message;
  var id = cont.chat.id;
  try{
    if(id == myId){
      if(cont.reply_to_message.forward_from.is_bot == true){
        sendText(myId, "Не робит");
      }else{
        if("animation" in cont){
          sendAnimation(cont.reply_to_message.forward_from.id, cont.animation.file_id);
        }else if("text" in cont){
          sendText(cont.reply_to_message.forward_from.id, cont.text);
        }else if("sticker" in cont){
          sendSticker(cont.reply_to_message.forward_from.id, cont.sticker.file_id);
        }
      }   
    }else if("sticker" in cont || "document" in cont){
      sendText(cont.from.id, "Это телефон, только текстовые мемы!");
    }else{
      var text = cont.text;
      if(text == "/start"){
        sendText(cont.from.id, "Жду прикольных переделок или чего там захочет хозяин");
      }else{
        forwardText(myId, id, cont.message_id);
        if("text" in cont){
          sheet.getSheetByName(sheetName).appendRow([text, cont.chat.username]);
        }
      }
    }
  }catch(e){
      sendText(myId, JSON.stringify(e,null,4));
  }
}
