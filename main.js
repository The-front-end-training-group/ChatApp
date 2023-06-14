let client = AgoraRTC.createClient({mode:'rtc', 'codec':"vp8"})

let config = {
    appid: "de3d8d804d21414191fe38723020630e",
    token: "007eJxTYLAIqGxyYP3cyOJ+3CuvVHOTT/mp0nnfZrEqntd4umX7aQ0FhpRU4xSLFAsDkxQjQxMgtDRMSzW2MDcyNjAyMDM2SH1/vimlIZCRQeLrJiZGBggE8bkYyjJTUvPjkzMSSxgYAL5aIUk=",
    uid: null,
    channel: "video_chat",
}

let localTracks = {
    audioTrack: null,
    videoTrack: null,
}

let localTrackSate = {
    audioTrackMuted: false,
    videoTrackMuted: false,
}

let remoteTracks = {}


document.getElementById("join-btn").addEventListener("click", async () =>{
    console.log("User Joined stream")
    await joinStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('get-back').style.display = 'none'
    document.getElementById('footer').style.display = 'flex'
})

document.getElementById("mic-btn").addEventListener("click", async () =>{
    
    if(!localTrackSate.audioTrackMuted){
        await localTracks.audioTrack.setMuted(true);
        localTrackSate.audioTrackMuted = true
        document.getElementById("mic-btn").style.backgroundColor = 'rgb(255, 80, 80, 0.7)'
    }
    else{
        await localTracks.audioTrack.setMuted(false)
        localTrackSate.audioTrackMuted = false
        document.getElementById("mic-btn").style.backgroundColor = '#333';
    }
})

document.getElementById("camera-btn").addEventListener("click", async () =>{
    
    if(!localTrackSate.videoTrackMuted){
        await localTracks.videoTrack.setMuted(true);
        localTrackSate.videoTrackMuted = true
        document.getElementById("camera-btn").style.backgroundColor = 'rgb(255, 80, 80, 0.7)'
    }
    else{
        await localTracks.videoTrack.setMuted(false)
        localTrackSate.videoTrackMuted = false
        document.getElementById("camera-btn").style.backgroundColor = '#333';
    }
})

document.getElementById(`leave-btn`).addEventListener('click', async () => {
    for(trackName in localTracks){
        let track = localTracks[trackName]
        if(track){
            track.stop()
            track.close()
            localTracks[trackName] = null
        }
    }

    await client.leave()
    document.getElementById(`user-streams`).innerHTML = ''
    document.getElementById(`footer`).style.display = 'none'
    document.getElementById(`join-btn`).style.display = 'block'
    document.getElementById('get-back').style.display = 'block'
})
// 视频通话
let joinStream = async () => {

    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(config.appid, config.channel, config.token || null, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
    ])

    let videoPlayer = `<div class="video-containers" id="video-wrapper-${config.uid}">
                            <p class="user-uid">${config.uid}</p>
                            <div class="video-player player" id="stream-${config.uid}"></div>
                        </div>`

    document.getElementById("user-streams").insertAdjacentHTML("beforeend", videoPlayer)
    localTracks.videoTrack.play(`stream-${config.uid}`)

    await client.publish([localTracks.audioTrack, localTracks.videoTrack])
}

let handleUserLeft = async () => {
    delete remoteTracks[user.uid]
    document.getElementById(`video-wrapper-${user.uid}`)

}

//双人通话聊天
let handleUserJoined = async (user, mediaType) => {
    console.log("User has join our stream")
    remoteTracks[user.uid] = user

    await client.subscribe(user, mediaType)

    let vedioPlayer = document.getElementById(`video-wrapper-${user.uid}`)
    if(vedioPlayer != null){
        vedioPlayer.remove()
    }

    if (mediaType === "video"){
        let videoPlayer = `<div class="video-containers" id="video-wrapper-${user.uid}">
                            <p class="user-uid">${user.uid}</p>
                            <div class="video-player player" id="stream-${user.uid}"></div>
                        </div>`
        document.getElementById("user-streams").insertAdjacentHTML("beforeend", videoPlayer)
        user.videoTrack.play(`stream-${user.uid}`)
    }
    
    if(mediaType === "audio"){
        user.audioTrack.play()
    }
}