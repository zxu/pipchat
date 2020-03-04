## Background
This is the React front-end for the end-to-end encrypted chat application. The name *PipChat* is meant to pay tribute to the now-defunct HipChat which I used and liked a lot at work.

[A live demo](https://pipchat.xuzhuang.org).
## Features
![GIF demo](docs/pipchat.gif?raw=true "GIF demo")
### Social media authentication
It supports authentication using social media accounts such as *Google*, *Twitter*, *Microsoft account* and *LinkedIn*.
### End-to-end encryption
The messages are encrypted end-to-end using asymmetric encryption. When one of the peers initiates the conversation, a new key pair will be generated and the public keys are exchanged between the peers of the conversation.
## Main dependencies
* WebSocket (`socket.io`)
* Redux, Redux-saga
* [TweetNaCl](https://tweetnacl.js.org/) (for encryption)
* [Quill Rich Text Editor](https://quilljs.com/)
* [Auth0](https://auth0.com/)
