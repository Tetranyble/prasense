'use strict';

const Peer = require('simple-peer')
const io = require('socket.io-client')
const { v4 } = require('uuid')
const socket = io('/')

let localStream;
const remoteStrem = {}
const peer = {};


const receiveCall = (caller,stream) =>{

  const peer = new Peer({initiator:false, trickle: false, stream: stream})
  peer.signal(caller.signal)
  peer.on('signal', signal => socket.emit('acceptedCall', { to: caller.from, signal: signal }))
  peer.on('stream', stream => video(stream, attachStreamToContainer))

  peer.on('error', err => console.log('error', err))
}
/**
 * Handles video tag creation and attachment to the DOM and start playing onload
 *
 * @param { video srcObject } stream
 * @param { function } streamContainer
 */
const video = (stream, streamContainer) => {
  const video = document.createElement('video')
  video.muted
  video.srcObject = stream
  streamContainer(video)
  video.onloadedmetadata = () =>{
    video.play()
  }
}
/**
 * Handles attachment of video element to video container array
 *
 * @param { Element } videoElement
 */
const attachStreamToContainer = videoElement => document.getElementById('video-grid').append(videoElement)
/**
 * Starts the request of the camera and microphone
 *
 * @param {Object} callbacks
 */
const requestLocalVideo = callbacks => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
   navigator.mozGetUSerMedia;
   //request audio and video
   if(navigator.getUserMedia){
    navigator.getUserMedia({audio: false, video: true},
      callbacks.success, callbacks.error)
   }
}
/**
 * Handles initation of call
 *
 * @param { srcObject } stream
 */
const startCall = (config, stream) => {
  const peer = new Peer({
    initiator: config.start,
    trickle: false,
    config: {

      iceServers: [
          {
              urls: "stun:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "98376683"
          },
          {
              urls: "turn:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "98376683"
          }
      ]
  },
    stream: stream,
  })

   /**
     * On return from the simple-peer server this method is call
     * with peer configuration token for another user/student
     * to use it's configuration to find itself on the stun/turn server
     * on which the other user will use and connect to this peer
     */
    peer.on('signal', token => socket.emit('classroom', { room: config.roomId , token: token, from: v4() }))
    peer.on('error', error => console.log(error))
    peer['initiator'] = peer
    socket.on("joinClassroomRequest", signal => {
      peer.signal(signal.token);
    })
}
/**
 * handles pop up message
 *
 * @param {Object} data
 */
const handleMessage = data => {
  let orientation = "text-left"
  let messageHtml = `<div class="fromMe"><label style="float:right"></label>${data.from}
   <br>${data.text}</div>`

   //if the message is yours, set text to right !
   if(data.from == username){
    messageHtml = `<div class="fromOther"><label style="float:right"></label>${data.from}
    <br>${data.text}</div>`
    orientation = "text-right"
   }

   document.getElementById('message').innerHTML += messageHtml
}
const recoverConfig = () =>{
  return {start: start, signal: signal, roomId: roomId}
}
requestLocalVideo({success: stream => {
  video(stream, attachStreamToContainer)
  localStream = stream
  console.log(recoverConfig())
  receiveCall(recoverConfig, stream)
}, error: error => console.log(`${error.name}:`, error)})







  /**
   * Called when a user/student tries to call this peer
   * this notifies this peer of inbound call
   */
socket.on('receiver', caller => callReceiver(caller, stream))



socket.on('joinClassroomRequest', caller => {
  peer['initiator'].signal(call.token)
  /* openStream( stream => {
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
  }) */
})




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
})
