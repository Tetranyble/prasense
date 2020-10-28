'use strict';

//Look after different browser vendors' ways of calling the getUserMedia() API method:
//Opera --> getUserMedia
//Chrome --> webkitGetUserMedia
//Firefox --> mozGetUserMedia
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {
  const video = document.getElementById('localStream')
  video.srcObject = stream
  video.onloadedmetadata = ()=>{
    video.play()
  }
})
.catch(error => console.log(error))
