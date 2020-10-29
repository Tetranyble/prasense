'use strict';

//Look after different browser vendors' ways of calling the getUserMedia() API method:
//Opera --> getUserMedia
//Chrome --> webkitGetUserMedia
//Firefox --> mozGetUserMedia
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
const Peer = require('simple-peer')


navigator.mediaDevices.getUserMedia({video: true, audio: false})
.then(stream => {
  playVideo(stream, 'localStream')
  const p = new Peer({
    initiator: location.hash ==='#1', trickle: false, stream
  })

  p.on('stream', friendStream => playVideo(friendStream, 'friendStream'))

  p.on('connect', () => {
    /* setInterval(() => {
      p.send(Math.random())
    }, 2000); */
  })

  p.on('data', data => console.log(data))

  p.on('signal', token => {
    document.getElementById('txtMySignal').textContent = JSON.stringify(token)
    console.log(token)
  })

  document.getElementById('btnConnect').addEventListener('click', event => {
    const friendsignal = JSON.parse(document.getElementById('txtFriendSignal').value)
    p.signal(friendsignal)
  })
})
.catch(error => console.log(error))

function playVideo(stream, idVideo) {
  const video = document.getElementById(idVideo)
  video.srcObject = stream
  video.onloadedmetadata = ()=>{
    video.play()
  }
}
