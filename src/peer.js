const Peer = require('peerjs')
const { v4 } = require('uuid')

const config = {host: 'stream2905.herokuapp.com', port: 443, secure: true, key: 'peerjs'}
const getPeer = () => {
  const id = v4()
  document.getElementById('peer-id').innerText(id)
  return id
}
const peer = Peer(getPeer(), config)
