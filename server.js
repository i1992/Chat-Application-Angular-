const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let users = [];

/*
  Use  express to access the directory
*/

app.use(express.static(path.join(__dirname, 'public')));

/*
  Socket connection open using io.on method
*/

io.on('connection', function(socket){

    socket.on('users_get', function() {
        socket.emit('users_ll', users);
    });


    /*
      Use the drawing method to tramsit the data through socket server
    */
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));




  /*

    "join" method is used for add a new user into the  socket server
    //new user

  */
  socket.on('join', function(data){
      console.log(data);
      console.log(users);
      //User name
      socket.user_name = data.user_name;
      users[socket.user_name] = socket; 
      let userObj = {
        user_name: data.user_name,
        socketid: socket.id
    };

    users.push(userObj);
    io.emit('users_ll', users);
  });

  /*

    send-message basically doing send the message into server and received
    //new message

  */
  socket.on('send-message', function(data) {

      io.emit('message-received', data);
  });

  /*

    Socket connection close also we check the username is not same.

  */


 socket.on('disconnect', function(){

        users = users.filter(function(subdata) {
            return subdata.user_name !== socket.user_name;
        });
        io.emit('users_ll', users);
  });

});

/*

  our localhost run on 4000 port

*/


server.listen(4000, function() {
    console.log('server is running on port 4000!');
});
