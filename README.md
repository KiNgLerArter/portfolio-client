# AngularNestClient

> Hi✋. This repo is my playground for testing cutting edge frontend technologies, paradigms, patterns and principles

#### Current features:

- CI
- Authentication
- Chat
  - Chat rooms
  - Messages deletion

#### Comming soon:

- 3d background
- User profile in the chat
- Messages editing and replying

---

#### Setup

1. Open the console
2. Run `npm i`
3. Run `npm start`
4. Setup backend repo
5. Uncomment the ```onApplicationBootstrap``` in the MockServer and run the BE
6. Stop the server, comment it back and run again
7. You can authorize into different accounts from a different browsers and check how the chat works

---

## Key-words for state update functions
* To create smth:
  - Local state - init
  - Server state - create
* To delete smth:
  - Local state - remove
  - Server state - delete
* To update smth:
  - Local state - edit
  - Server state - update
* To retrieve smth:
  - Local state - get
  - Server state - load

