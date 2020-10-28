const express = require('express')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const path = require('path')
const { v4 } = require('uuid')
const dotenv = require('dotenv');
const { ExpressPeerServer: peer } = require('peer');

dotenv.config();


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(`/${v4()}`)
});
app.get('/:room', (req, res) => {
  res.render('index', {roomId: req.params.room})
})

io.on('connection', (socket) => {
  socket.on('classroom', (roomId, userId)=> {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnected', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
});
io.sockets.on("error", e => console.log(e));
const port = process.env.PORT || '5000';
http.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server running at: ${process.env.APP_URL}:${port}`)
  }
});
const peerServer = peer(http, {
  path: '/peer'
});
app.use('/peer', peerServer);
