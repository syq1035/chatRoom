let express = require("express");
let app = express();
//创建一个服务器
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);  //引入socket.io模块并绑定到服务器

let users = [];  //存储登录用户昵称
let usersInfo = [];   //存储用户昵称和头像

// 路由为/默认client静态文件夹
app.use('/',express.static(__dirname + '/public'));

app.get('/',function(req, res){
    res.send(index);
})
//监听端口
server.listen(3000,function(){
    console.log("listen on 3000...");
})

io.on('connection', function(socket){
    //监听登录
    socket.on('login', (user)=>{
        // io.emit('displayUsers', usersInfo);

        //检查昵称是否存在
        if(users.indexOf(user.name)>-1){
            socket.emit('loginError');
        }else{
            users.push(user.name);  //存储用户昵称
            usersInfo.push(user);  //存储用户昵称和头像
            socket.nickName = user.name;
            socket.img = user.img;
            socket.emit('loginSuccess', user.img);  //触发当前客户端的登录成功事件
            io.emit('displayUsers', usersInfo);  //触发所有客服端渲染在线成员事件
            io.emit('systemPrompt', {
                name: user.name,
                status: "进入"
            });   //系统提示用户进入
            console.log(`${user.name} coming , ${users.length} user online now.`);   //打印连接人数
        }
    })
    socket.on('sendMassage', (data)=>{
        //
        socket.emit('receiveMassage', {
            name: socket.nickName,
            img: socket.img,
            massage: data.massage,
            side: 'right',
        })
        socket.broadcast.emit('receiveMassage', {
            name: socket.nickName,
            img: socket.img,
            massage: data.massage,
            side: 'left',
        })
    })
})