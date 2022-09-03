
// install ejs for bringing backend variables to frontend..


// importing express
const { render } = require('ejs');
const express = require('express');

// creating app
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);   // specifying server to socketio
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.use('/peerjs', peerServer);


// setting engine ejs
app.set("view engine", 'ejs');
app.use(express.static('public'))     // using static files, javascripts..
const link = Math.random().toString(36).slice(2,12)
const port = 3000


app.get('/', (req, res) => {

    // res.render('homePage');

    // home will redirect to new link
    res.redirect(`/${link}`);
})

app.get('/:chatRoom', (req, res) => {

    // passing with the params
    res.render('chatRoom', {roomID: req.params.chatRoom});
})

// initialising socket connection
io.on('connection', socket => {
    socket.on('sumit-ka-room', (roomID, userID) =>{
        console.log('In the sumit ka room');
        socket.join(roomID);
        // it will broadcast the room with name 
        // socket.broadcast.to(roomID).emit('connect-karo', userID);
        socket.to(roomID).emit('connect-karo', userID);



        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', userID);
        })
    })
    
})



server.listen(port)



