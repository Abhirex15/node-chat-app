const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined..'));

socket.emit('newMessage', {
  from:'Admin',
  text:'Welcome to the chat app'
});

socket.broadcast.emit('newMessage', {
  from:'Admin',
  text:'New user joined',
  createAt: new Date().getTime()
});

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
   io.emit('newMessage', generateMessage(message.from, message.text));

      // socket.broadcast.emit('newMessage', {
      //   from:message.from,
      //   text:message.text,
      //   createAt:new Date().getTime()
      // });
  });

  socket.on('disconnect', () =>{
    console.log('User was Disconnected');
  });
});

app.listen(port, () => {
  console.log('Server is up at port 3000');
});
