const io = require('socket.io-client')
//const Peer = require('peerjs')
const socket = io()

const peer = new Peer(undefined,{
  host: '/peer/peer',
  port: '3000'
})
const peers = {}
const videoContainer = document.getElementById('video-grid')
const addVideoStream = (video, stream) =>{
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoContainer.append(video)
}
const connectToNewUser = (userId, stream)=>{
  const call = peer.call(userId, stream)
  const video = deocument.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () =>{
    video.remove()
  })
  peers[userId] = call
}



const video = document.createElement('video')
video.muted = true
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(video, stream)

  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId,stream)
  })
})
socket.on('user-disconnected', userId => {
  if(peers[userId]) peers[userId].close()
})

peer.on('open', id =>{
  socket.emit('classroom', ROOM_ID, id)
})




