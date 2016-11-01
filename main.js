var nodemailer = require("nodemailer");
var fs=require("fs")

// 设置邮件内容
var content=require("./config.js")
var startQQ="";
fs.readFile('./number.txt', (err, data) => {
  if (err)console.log(err);
  startQQ=data.toString();

  fs.readFile('./bin.txt', (err, data) => {
    if (err)console.log(err);
    var option=JSON.parse(data.toString());
    console.log(option[0].name)
    send(option[0])
  });
});
//send(startQQ)
function send(option){
  var smtpTransport = nodemailer.createTransport('smtps://'+option.name+'%40'+option.domain+':'+option.pwd+'@smtp.'+option.domain+'');
  var mailOptions = {
    from: "Fred Foo <"+option.name+"@"+option.domain+">", // 发件地址
    to: startQQ+"@qq.com", // 收件列表
    subject: content.subName, // 标题
    html: content.html // html 内容
  }
 
  smtpTransport.sendMail(option.mailOptions, function(error, response){
    if(error){
      console.log(error+"数字:"+startQQ);
      if(error.toString().indexOf("limited")<0){
          setTimeout(function(){
            send(option)
          },1000)
      }else{
        writeNumber(startQQ);
        send(option)
      }
    }else{
      console.log("Message sent: " + response.message+"数字"+startQQ);
      setTimeout(function(){
        send(option)
      },1000)
    }
    smtpTransport.close(); // 如果没用，关闭连接池
  });
  startQQ++
}

function writeNumber(num){
    fs.writeFile('./number.txt', num, (err) => {
      if (err)consol.log("writeTxt:"+err);
      console.log('It\'s saved!');
    });
}
// 发送邮件