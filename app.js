const express = require('express')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const path = require('path')
const { v4 } = require('uuid')
const dotenv = require('dotenv');
dotenv.config();

const rooms = {}
// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(`/${v4()}`)
});
app.get('/:room', (req, res) => {
  if (rooms[req.params.room]) {
    const room = rooms[req.params.room]
    room.start = false
    console.log(room)
    res.render('index', { roomId: room } )
  }else{
    const roomConfig = {start: true, signal: "", roomId: req.params.room}
    rooms[req.params.room] = roomConfig
    res.render('index', { roomId: roomConfig })
    console.log(rooms)
  }

})
io.on('connection', socket => {

  socket.on('classroom', user => {
    if(!rooms[user.room]){
      rooms[user.roomId].push(user)
      console.log('room found')
    } else {
      socket.join(user.roomId)
      socket.to(user.roomId).broadcast.emit('joinClassroomRequest', user)
    }



  })
})

const port = process.env.PORT || '5000';
http.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server running at: ${process.env.APP_URL}:${port}`)
  }
});

