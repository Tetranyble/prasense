`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>

    <label>Your ID:</label><br/>
    <textarea id="yourId"></textarea><br/>
    <label>Other ID:</label><br/>
    <textarea id="otherId"></textarea>
    <button id="connect">connect</button><br/>

    <label>Enter Message:</label><br/>
    <textarea id="yourMessage"></textarea>
    <button id="send">send</button>
    <pre id="messages"></pre>

    <script src="bundle.js" charset="utf-8"></script>
  </body>
</html>
`

var getUserMedia = require('getusermedia')

getUserMedia({ video: true, audio: false }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })

  peer.on('signal', function (data) {
    console.log("signal")
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', function () {
      console.log("connect button clicked")
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', function () {
    console.log("send button")
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
      console.log("data")
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {
      console.log("stream")
    var video = document.createElement('video')
    document.body.appendChild(video)

    video.srcObject = stream
    video.play()
  })
})
