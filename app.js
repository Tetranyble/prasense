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
  rooms[req.params.room] = []
  res.render('index', {roomId: req.params.room})
})

/* io.on('connection', socket => {

   socket.on("call", caller => socket.emit('receiver', {signal: caller.initiatorSignal, from: caller.from }))
   socket.on('acceptedCall', acceptance => {
     console.log(acceptance)
     socket.emit('calledUserHasAcceptedCall', acceptance.initiatorSignal)
   })

}); */
//socket.on('connection', acceptance => socket.to(acceptance.to).emit('calledUserHasAcceptedCall', acceptance.initiatorSignal))
io.on('connection', socket => {
  socket.on('call', caller =>{
    if(!rooms[caller.roomId].length) socket.emit('newConversation', caller)
  })
  socket.on('classroom', user => {
    rooms[user.roomId].push(user)
    socket.join(user.roomId)
    socket.emit('joinClassroomRequest', user)

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

