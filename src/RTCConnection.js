'use strict';

//Look after different browser vendors' ways of calling the getUserMedia() API method:
//Opera --> getUserMedia
//Chrome --> webkitGetUserMedia
//Firefox --> mozGetUserMedia
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
const Peer = require('simple-peer')
const io = require('socket.io-client')
const { v4 } = require('uuid')
const socket = io('/')

let stream = ''
const peer = {}
const attachStreamToContainer = videoElement => document.getElementById('video-grid').append(videoElement)

const playStream = (stream, streamContainer) => {
  const video = document.createElement('video')
  video.muted
  video.srcObject = stream
  video.onloadedmetadata = () =>{
   streamContainer(video)
    video.play()
  }
}

const acceptCall = (caller,stream) =>{

  const peer = new Peer({initiator:false, trickle: false, stream: stream})
  peer.on('signal', signal => socket.emit('acceptedCall', { to: caller.from, initiatorSignal: signal }))
  peer.on('stream', stream => playStream(stream, attachStreamToContainer))
  peer.signal(caller.initiatorSignal)
  peer.on('error', err => console.log('error', err))
}

//const inboundCall = (caller) => console.log(caller)

const openStream = (cb)=> {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
.then(stream => {
  stream = stream
  cb(stream)
})
.catch(error => console.log(error))
}






  /**
   * Called when a user/student tries to call this peer
   * this notifies this peer of inbound call
   */
socket.on('receiver', caller => acceptCall(caller, stream))
const startCall = (stream, user) => {
  /*const p = new Peer({
        initiator: location.hash ==='#1', trickle: false, stream
      })  */
      const peer = new Peer({
        initiator: true, trickle: false, stream
      })
      /**
     * On return from the simple-peer server this method is call
     * with peer configuration token for another user/student
     * to use it's configuration to find itself on the stun/turn server
     * on which the other user will use and connect to this peer
     *
     */
    peer.on('signal', token => socket.emit('classroom', { room: roomId , token: token, from: v4() }))
}

socket.on('joinClassroomRequest', caller => {
  openStream( stream => {
    //playVideo(stream, 'localStream')
    const video = document.createElement('video')
    video.muted
    video.srcObject = stream
    attachStreamToContainer(video)
    video.onloadedmetadata = () => {
      video.play()
    }
    const peer = new Peer({
      initiator: true, trickle: false, stream
    })
    peer.on('signal', token => socket.emit('classroom', { roomId: roomId , token: token, from: v4() }))
    peer.on('stream', friendStream => playStream(friendStream, attachStreamToContainer))

})



socket.emit('call', {roomId: roomId, conversionStartBy: v4()})
socket.on('newConversation', call => {
  openStream(stream => {
    //playVideo(stream, 'localStream')
    const video = document.createElement('video')
    video.muted
    video.srcObject = stream
    attachStreamToContainer(video)
    video.onloadedmetadata = ()=>{
      video.play()
    }
    const peer = new Peer({
      initiator: true, trickle: false, stream
    })
    peer.on('signal', token => socket.emit('classroom', { roomId: roomId , token: token, conversionStartBy: call.conversionStartBy }))
    peer.signal(signal)
})


    /**
     * called on success connection
     * the other user/student data/stream is sent down
     */
   /*  peer.on('stream', friendStream => playStream(friendStream, attachStreamToContainer))
  socket.on('calledUserHasAcceptedCall', signal => {
    console.log(signal)
    peer.signal(signal)
  })
  peer.on('error', err => console.log('error', err))

  peer.on('connect', () => {
    console.log('connected')
  })

  peer.on('data', data => console.log(data)) */



  /*  document.getElementById('btnConnect').addEventListener('click', event => {
    const friendsignal = JSON.parse(document.getElementById('txtFriendSignal').value)
    peer.signal(friendsignal)
  }) */
})

/* function playVideo(stream, idVideo) {
  const video = document.getElementById(idVideo)
  video.srcObject = stre0am
  video.onloadedmetadata = ()=>{
    video.play()
  }
} */
