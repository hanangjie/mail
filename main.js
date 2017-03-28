var nodemailer = require("nodemailer");
var fs=require("fs")

// 设置邮件内容
var content=require("./config.js")
var startQQ="",optionIndex=0;
var errorNum=0,successNum=0;
fs.readFile('./number.txt', (err, data) => {
  if (err)console.log(err);
  startQQ=data.toString();

  fs.readFile('./bin.txt', (err, data) => {
    if (err)console.log(err);
    var option=JSON.parse(data.toString());
    send(option)
  });
});

function send(option){
  writeNumber(startQQ);
  var opt=option;
  option=option[optionIndex]
  var smtpTransport = nodemailer.createTransport('smtps://'+option.name+'%40'+option.domain+':'+option.pwd+'@smtp.'+option.domain+'');
  var mailOptions = {
    from: "Fred Foo <"+option.name+"@"+option.domain+">", // 发件地址
    to: startQQ+"@qq.com", // 收件列表
    subject: content.subName, // 标题
    html: content.html // html 内容
  }
 
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      errorNum++
      console.log(error+"\n error sent: from:" +option.name+"@"+option.domain+",to:"+startQQ);
      if(error.toString().indexOf("limited")<0){
          //startQQ++
          setTimeout(function(){
            send(opt)
          },1000)
      }else{
        optionIndex++;
        if(opt[optionIndex]){
          send(opt)
        }else{
          writeNumber(startQQ);
        }
      }
    }else{
      successNum++;
      console.log("Message sent: from:" +option.name+"@"+option.domain+",to:"+startQQ);
      startQQ++
      setTimeout(function(){
        send(opt)
      },1000)
    }
    smtpTransport.close(); // 如果没用，关闭连接池
  });
}

function writeNumber(num){
    fs.writeFile('./number.txt', num, (err) => {
      if (err)consol.log("writeTxt:"+err);
      console.log('It\'s saved!'+num+"error:"+errorNum+",success:"+successNum);
    });
}
// 发送邮件