const player = document.querySelector(".player");
simage = player.querySelector(".song-image img");
sname = player.querySelector(" .song .song-name");
aname = player.querySelector(" .song .song-artist");
audiofile = player.querySelector("#audiofile");
playButton = player.querySelector(".play");
prevButton = player.querySelector(".previous");
nextButton = player.querySelector(".next");
progress = player.querySelector(".progress");
progressArea = player.querySelector(".song-progress");
musicList = player.querySelector(".music-list")
showButton = player.querySelector(".queue")
hideButton = musicList.querySelector(".close")



let musicIndex = Math.floor((Math.random()*tracks.length)+1);
window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingNow();

})
function loadMusic(indexNum) {
    sname.innerText = tracks[indexNum - 1].tname;
    aname.innerText = tracks[indexNum - 1].artist;
    simage.src = `images/${tracks[indexNum - 1].img}.jpg`;
    audiofile.src = `music/${tracks[indexNum - 1].src}.mp3`;
}

const playMusic = () => {
    player.classList.add("pause");
    playButton.setAttribute("title", "Pause")
    audiofile.play();
    playButton.querySelector("i").innerText = "pause_circle";
}
const pauseMusic = () => {
    player.classList.remove("pause");
    playButton.setAttribute("title", "Play")
    audiofile.pause();
    playButton.querySelector("i").innerText = "play_circle";
}
const nextSong = () => {
    musicIndex++;
    musicIndex > tracks.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
const prevSong = () => {
    musicIndex--;
    musicIndex < 1 ? musicIndex = tracks.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
playButton.addEventListener("click", () => {
    const musicPause = player.classList.contains("pause");
    musicPause ? pauseMusic() : playMusic();
    playingNow();
})
prevButton.addEventListener("click", () => {
    prevSong();
})
nextButton.addEventListener("click", () => {
    nextSong();
})
let audioCurrent = player.querySelector(".start");
let audioDuration = player.querySelector(".duration");
audiofile.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progress.style.width = `${progressWidth}%`

    audiofile.addEventListener("loadeddata", () => {

        let Tduration = audiofile.duration;
        let Tminutes = Math.floor(Tduration / 60);
        let Tseconds = Math.floor(Tduration % 60);
        if (Tseconds < 10) {
            Tseconds = `0${Tseconds}`
        }
        audioDuration.innerText = `${Tminutes}:${Tseconds}`;
    })
    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`
    }
    audioCurrent.innerText = `${currentMinutes}:${currentSeconds}`;
})

progressArea.addEventListener("click", (e) => {
    let progressVal = progressArea.clientWidth;
    let clickedWidth = e.offsetX;
    let songDuration = audiofile.duration;
    audiofile.currentTime = (clickedWidth / progressVal) * songDuration;
    playMusic();
})

const repeat = player.querySelector(".repeat")
repeat.addEventListener("click", () => {

    let getText = repeat.innerText;
    switch (getText) {
        case 'repeat':
            repeat.innerText = "repeat_one"
            repeat.setAttribute("title", "repeat one");
            break;

        case 'repeat_one':
            repeat.innerText = "shuffle"
            repeat.setAttribute("title", "shuffle")
            break;

        case 'shuffle':
            repeat.innerText = "repeat"
            repeat.setAttribute("title", "repeat all")
            break;
    }

})

audiofile.addEventListener("ended", () => {


    let getText = repeat.innerText
    switch (getText) {
        case 'repeat':
            nextSong();
            break;

        case 'repeat_one':
            audiofile.duration = 0;
            loadMusic(musicIndex);
            playMusic();
            break;

        case 'shuffle':
            let randIndex = Math.floor((Math.random() * tracks.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * tracks.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
})

showButton.addEventListener("click", () => {
    musicList.classList.toggle("show");
})
hideButton.addEventListener("click", () => {
    showButton.click();
})

const List = player.querySelector("ul");
for (let i = 0; i < tracks.length; i++) {
    let song = `<li lindex ="${i+1}">
                    <div class="row">
                        <span>${tracks[i].tname}</span>
                        <p>${tracks[i].artist}</p>
                    </div>
                    <audio class="${tracks[i].src}" src="music/${tracks[i].src}.mp3"></audio>
                        <span id="${tracks[i].src}" class="duration"></span>
                </li>`;
        List.insertAdjacentHTML("beforeend",song);
        let songDuration = List.querySelector(`#${tracks[i].src}`);
        let songAudio = List.querySelector(`.${tracks[i].src}`);
        songAudio.addEventListener("loadeddata",()=>{
            let Tduration = songAudio.duration;
            let Tminutes = Math.floor(Tduration / 60);
            let Tseconds = Math.floor(Tduration % 60);
            if (Tseconds < 10) {
                Tseconds = `0${Tseconds}`
            }
            songDuration.innerText = `${Tminutes}:${Tseconds}`;
            songDuration.setAttribute("aDuration",`${Tminutes}:${Tseconds}`);
        })  
}


const allSongs = List.querySelectorAll("li");
function playingNow() {
    for (let j = 0; j < allSongs.length; j++) {
        let audioTag = allSongs[j].querySelector(".duration")
        if(allSongs[j].classList.contains("playing")){
            allSongs[j].classList.remove("playing")
            let aftDuration = audioTag.getAttribute("aDuration");
            audioTag.innerText = aftDuration;   
        }
    
        if(allSongs[j].getAttribute("lindex") == musicIndex){
            allSongs[j].classList.add("playing");
            audioTag.innerText = "Playing"  
        }
    
        allSongs[j].setAttribute("onclick","clicked(this)"); 
    }
}

function clicked(element) {
    let getIndex = element.getAttribute("lindex");
    musicIndex = getIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}