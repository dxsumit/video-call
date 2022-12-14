const socket = io('/');
const myVideo = document.createElement('video')


// staring new peer
// why its undefined ? its for ID, since we are not using any ID, no need to specify
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});
total_peers = {}



const handleStream = (video, stream) => {

    video.srcObject = stream;
    // on loading the metadata video will play.. spelling
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    // putting the video in the screen
    document.getElementById('video-grid').append(video)

}

let stream;
const startStream = async () => {

    stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    handleStream(myVideo, stream);


    // answering the call, new user call us back and we answer it back and add their stream
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            handleStream(video, userVideoStream)
        })
        
    })

    socket.on('connect-karo', (userID) => {
        newUserConnect(userID, stream);
    })

    return true;
}
// starting the video stream 
startStream();



socket.on('user-disconnected', userId => {
    if (total_peers[userId]){
        total_peers[userId].close()
    }
})
  
peer.on('open', (ID) => {
    // calling to join the room
    // ROOM_ID is comming from server.js and passed from script in chatRoom.js
    // new userID generated by peer, ID of user who joined
    socket.emit('sumit-ka-room', ROOM_ID, ID);
})





const newUserConnect = (userID, stream) => {

    // sending the newuser our stream, calling them
    const call = peer.call(userID, stream)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        handleStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
      })
    
    total_peers[userID] = call

}



// mute/unmute video..
const mute_unmute = () => {
    
    const enabled = stream.getAudioTracks()[0].enabled;
    if(enabled){
        stream.getAudioTracks()[0].enabled = false;
        setUnmuteBtn();
    
    } else {
        stream.getAudioTracks()[0].enabled = true;
        setMuteBtn();
    
    }

}

const setUnmuteBtn = () => {
    const new_html = `<i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`
        
    document.querySelector('.mute_btn').innerHTML = new_html;
}

const setMuteBtn = () => {
    const new_html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`
        
    document.querySelector('.mute_btn').innerHTML = new_html;
}



const pause_play_video = () => {
    const enabled = stream.getVideoTracks()[0].enabled;
    if(enabled){
        stream.getVideoTracks()[0].enabled = false;
        playVideo();
    
    }else {
        stream.getVideoTracks()[0].enabled = true;
        pauseVideo()
    }
}

const pauseVideo = () => {
    const new_html = `<i class="fas fa-video"></i>
    <span>Stop Video</span>`

    document.querySelector('.stop_video').innerHTML = new_html;
}


const playVideo = () => {
    const new_html = `<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`

    document.querySelector('.stop_video').innerHTML = new_html;
}


const leave_call = () => {
    
    socket.on('user left', (userID) => {
        console.log('done');
    })

}


const handleStartCall = async () => {

    const link = Math.random().toString(36).slice(2,12)
    // https://desolate-forest-51690.herokuapp.com/
    window.location.href = `https://desolate-forest-51690.herokuapp.com/${link}`;
    
}

