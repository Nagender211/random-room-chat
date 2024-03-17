const path = require('path');
const express=require('express');
const http =require('http');
const socket=require('socket.io');
const {formateMessage} =require('./ulits/messages');
const {joinUser,currentUser, userLeavs,
    userRoom} =require('./ulits/user');

//  const moment=require('moment');

const app=express();
const server=http.createServer(app);

const io=socket(server);

const botName='chatBot';

io.on('connection', socket =>{
    socket.on('joinRoom',({username,room})=>{
        const user=joinUser(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formateMessage(botName,'Welcome to ChatBot'));
        socket.broadcast.to(user.room).emit('message',formateMessage(botName,`${user.username} is joined`));
        io.to(user.room).emit('roomUser',{
            room:user.room,
            users: userRoom(user.room),
        });
    

    });
    console.log('New WS as benn connected');
   
    
    socket.on('chatMessage',msg=>{

        const user=currentUser(socket.id);
        io.to(user.room).emit('message',formateMessage(`${user.username}`,msg));
    });
    socket.on('disconnect',() =>{
        const user=userLeavs(socket.id);
        if(user){
            io.to(user.room).emit('message',formateMessage(botName,`${user.username} is left from the group`));
            io.to(user.room).emit('roomUser',{
                room:user.room,
                users:userRoom(user.room),
            });

        }
        
    });
});

const PORT=3000 || process.env.PORT;

app.use(express.static(path.join(__dirname,'public')));

server.listen(PORT,()=>{
    console.log(`listening the ${PORT}...`);
});