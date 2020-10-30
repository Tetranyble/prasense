const express = require('express');
const app = express()

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4 } = require('uuid')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

/* eslint-disable no-console */
/*
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); */
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(`/${v4()}`)
});

app.get('/:room', (req, res) => {
  res.render('index', {roomId: req.params.room})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId)=> {
    console.log(roomId, userId)
    socket.on('disconnect', ()=> {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const port = process.env.PORT || '5000';
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server running at: ${process.env.APP_URL}:${port}`)
  }
});

