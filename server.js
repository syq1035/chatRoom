let express = require("express");
let app = express();
//创建一个服务器
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);  //引入socket.io模块并绑定到服务器

// 路由为/默认client静态文件夹
app.use('/',express.static(__dirname + '/public'));

app.get('/',function(req, res){
    res.send(index);
})
//监听端口
server.listen(3000,function(){
    console.log("listen on 3000...");
})