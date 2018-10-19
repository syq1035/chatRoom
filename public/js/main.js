//客户端引入socket
var socket = io();

//点击登录确认键或回车键后，进行登录判断
$("#namesubmit").click(login);
$("#name").keyup(function(e){
    if(e.which == 13){
        login();
    }
})

//监听登录成功事件，隐藏登录层
socket.on('loginSuccess',(userImg)=>{
    $(".name").hide();
    // document.getElementById("userImg").setAttribute("src", userImg);
    $("#userImg").attr("src", userImg);
})

//监听登录错误
socket.on('loginError', ()=>{
    alert("该用户名被占用，请重新输入！");
    $("#name").val('');
    $("#name").focus();
})

//监听用户显示事件
socket.on('displayUsers',(usersInfo)=>{
    displayUsers(usersInfo);
})

socket.on('systemPrompt', (user)=>{
    let date = new Date().toTimeString().substr(0,8);
    $("#chatInfo").append(`<p class='system'>
        <span>${date}</span>
        <br>
        <span>${user.name} ${user.status}了聊天室</span>
    </p>
    `)
    //滚动条总是在最底部
    $('#chatInfo').scrollTop($('#chatInfo')[0].scrollHeight);
})

//处理用户显示
function displayUsers(usersInfo){
    $("#users").text('');      //每个用户都要重新渲染
    if(usersInfo.length){
        $(".onlineMember p").hide();
    }else{
        $(".onlineMember p").show();
    }
    $(".num").text(usersInfo.length);
    for(let user of usersInfo){
        $("#users").append(`<li>
            <img src=${user.img}>
            <span>${user.name}</span>
        </li>
        `)
    }
}
//处理登录
function login(){
    let imgN =Math.ceil(Math.random()*4);
    //检查昵称输入框是否为空
    if($("#name").val().trim() != ''){
        //不为空，则发起一个login事件并将输入的昵称发送到服务器
        socket.emit('login', {
            name: $("#name").val().trim(),
            img: 'image/user' + imgN + '.jpg',
        })
    }else{
        //为空，输入框获得焦点
        $("#name").focus();
    }
}

//------------------------------------------

//点击按钮或回车键发送消息
$("#sbm").click(function(e){
    e.preventDefault();   //禁止提交表单自动刷新
    sendMassage();
});
$("#mas").keyup(function(e){
    if(e.which == 13){
        sendMassage();
    }
})
//发送消息
function sendMassage(){
    if($("#mas").val()==''){
        alert("请输入内容");
        $("#mas").focus();
    }else{
        socket.emit('sendMassage', {
            massage: $("#mas").val()
        })
    }
    $("#mas").val('');
}
//接收消息并渲染入消息框
socket.on('receiveMassage', (data)=>{
    $("#chatInfo").append(`<li class=${data.side}>
        <img src=${data.img}>
        <div>
            <span>${data.name}</span>
            <p>${data.massage}</p>
        </div>
    </li>`)
    //滚动条总是在最底部
    $('#chatInfo').scrollTop($('#chatInfo')[0].scrollHeight);
})