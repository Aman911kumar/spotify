let close_bar = false;
let playing = true;
let mute = false;
let first_play = true;
let currentTrack = new Audio();
const play_music = document.querySelector(".play");
const pause_music = document.querySelector(".pause");
let tempCurrensong;
let songDuration;
let songCurrentTime;
let folder_url;
let currentSong;
let currentFolder;
let range = document.querySelector(".seek-bar");
let song = [];  // Declare song variable globally
let volumeLevel = document.querySelector(".volume-level");
let blackTheme = localStorage.getItem("balckTheme")
let theme_blue = "#0086ea"
function setting_volumeLevel_localStorage() {
    localStorage.setItem("volume", volumeLevel.value)
}

function setTheme() {
    if (blackTheme === "true") {
        document.querySelector(".upperBox").style.filter = "invert(1)"
        document.querySelector(".lowerBox").style.filter = "invert(1)"
        document.querySelector(".rightBox").style.background = "#e9eaea"
        document.querySelector("nav").style.filter = "invert(1)"
        document.documentElement.style.setProperty('--white', 'black');
        document.documentElement.style.setProperty('--cardHover', '#cdcdcd');
        theme_blue = "#ff7915"
        currentSong.style.backgroundColor = theme_blue;
        localStorage.setItem("balckTheme", "false")
        blackTheme = localStorage.getItem("balckTheme")
    }
    else {
        document.body.style.background = "black"
        document.querySelector(".upperBox").style.filter = ""
        document.querySelector(".lowerBox").style.filter = ""
        document.querySelector(".rightBox").style.filter = ""
        document.querySelector("nav").style.filter = ""
        theme_blue = "#0086ea"
        currentSong.style.backgroundColor = theme_blue;
        document.querySelector(".rightBox").style.background = ""
        document.documentElement.style.setProperty('--white', 'white');
        document.documentElement.style.setProperty('--cardHover', '#323232');
        localStorage.setItem("balckTheme", "true")
        blackTheme = localStorage.getItem("balckTheme")
    }
}

function change_UI(parent_Element) {
    var siblings = Array.from(parent_Element.children);
    siblings.forEach(sibling => {
        if (sibling !== currentSong) {
            sibling.style.backgroundColor = "";
            sibling.querySelector(".play-logo").style.opacity = 1;
            sibling.querySelector(".pause-logo").style.opacity = 0;
        }
    });
    currentSong.style.backgroundColor = theme_blue;
    currentSong.querySelector(".play-logo").style.opacity = 0;
    currentSong.querySelector(".pause-logo").style.opacity = 1;
}

function change_UI_folder(parent_Element) {
    var siblings = Array.from(parent_Element.children);
    siblings.forEach(sibling => {
        if (sibling !== currentFolder) {
            sibling.style.backgroundColor = "";
            sibling.querySelector(".card-play").style.opacity = "";
            sibling.querySelector(".card-pause").style.opacity = "";
            sibling.querySelector(".card-play-pause").style.bottom = "";
            sibling.querySelector(".card-play-pause").style.opacity = "";
        }
    });
    currentFolder.style.backgroundColor = "#0086ea";
    currentFolder.querySelector(".card-play").style.opacity = 0;
    currentFolder.querySelector(".card-pause").style.opacity = 1;
    currentFolder.querySelector(".card-play-pause").style.bottom = "40%";
    currentFolder.querySelector(".card-play-pause").style.opacity = "1";
}

function hamburgur() {
    let menu = document.querySelector(".leftBox");
    if (close_bar) {
        menu.style.left = "-500px";
        close_bar = false;
    } else {
        menu.style.left = "0";
        close_bar = true;
    }
}

function mute_unmute() {
    let mute_svg = document.querySelector(".mute");
    if (mute) {
        volumeLevel.value = 30
        currentTrack.volume = volumeLevel.value / 100;
        mute_svg.style.opacity = 0;
        mute = false;
    } else {
        mute_svg.style.opacity = 1;
        document.querySelector(".volume-level").value = 0;
        currentTrack.volume = 0;
        mute = true;
    }
}



document.querySelector(".volume-level").addEventListener("input", function () {
    console.log(localStorage.getItem("volume"))
    currentTrack.volume = volumeLevel.value / 100;
    if (volumeLevel == 0) {
        mute_unmute();
    } else {
        document.querySelector(".mute").style.opacity = 0;
        mute = false;
    }
});

document.querySelector(".containt").addEventListener("click", function () {
    if (close_bar) {
        hamburgur();
    }
});

async function fetch_songs(folder_url) {
    let song_fetch = await fetch(`${folder_url}`);
    let song_fetch_txt = await song_fetch.text();
    let div = document.createElement("div");
    div.innerHTML = song_fetch_txt;
    let song_a = div.getElementsByTagName("a");
    let song_list = [];

    for (let i = 0; i < song_a.length; i++) {
        const element = song_a[i];
        if (element.href.endsWith(".mp3")) {
            song_list.push(element.href);
        }
    }

    return song_list;
}

async function fetch_song_folder() {
    let folder_fetch = await fetch('/songs');
    let folder_fetch_txt = await folder_fetch.text();
    let div = document.createElement("div");
    div.innerHTML = folder_fetch_txt;
    let folder_a = div.getElementsByTagName("a");
    let folder_list = [];
    for (let i = 0; i < folder_a.length; i++) {
        const element = folder_a[i];
        if (element.href.includes("/songs/")) {
            folder_list.push(element.href);
        }
    }
    return folder_list;
}

function playList(song_list) {
    let music = document.querySelector(".playList");
    music.innerHTML = "";
    for (let i = 0; i < song_list.length; i++) {
        music.innerHTML += `<div class="music">
                    <img class="music-logo" src="images/music-notes-svgrepo-com.svg" alt="">
                    <p audio-link="${song_list[i]}" class="music-name">${song_list[i].replaceAll("%20", " ").split("/")[5]}</p>
                    <div class="library-play-pause">
                        <img class="play-logo" src="images/play-svgrepo-com.svg" alt="">
                        <img class="pause-logo" src="images/pause-svgrepo-com.svg" alt="">
                    </div>
                </div>`;
    }
}

function playMusic(track) {
    currentTrack.src = track;
    currentTrack.play();
    play_music.style.opacity = 0;
    pause_music.style.opacity = 1;
}

// Main function to fetch and display folders and songs
async function main() {
    let folder = await fetch_song_folder();
    playListFolder(folder);

    async function playListFolder(folderList) {
        let folder = document.querySelector(".containt");
        let folder_info;
        for (let i = 0; i < folderList.length; i++) {
            folder_info = await (await fetch(`${folderList[i]}/info.json`)).json();
            folder.innerHTML += `<div url=${folderList[i]} class="cards">
                <img class="card-img" src="${folderList[i]}/cover.jpg" alt="">
                <div class="card-play-pause">
                    <img class="card-play" src="images/card play.svg" alt="">
                    <img class="card-pause" src="images/card pause.svg" alt="">
                </div>
                <h4 class="folder">${folder_info.title}</h4>
                <p class="description">${folder_info.description}</p>
            </div>`;
        }

        Array.from(document.querySelectorAll(".cards")).forEach(e => {
            e.addEventListener("click", async () => {
                folder_url = e.getAttribute("url");
                currentFolder = e
                change_UI_folder(e.parentElement)

                song = await fetch_songs(folder_url); // Update global song variable
                playList(song);
                currentSong = document.querySelector(".playList").firstElementChild;
                first_play = true;

                currentSong.querySelector(".play-logo").style.opacity = 1;
                currentSong.querySelector(".pause-logo").style.opacity = 0;
                play_music.style.opacity = 1;
                pause_music.style.opacity = 0;
                currentTrack.pause();
                resetSeekbar();

                let playListHeading = await (await fetch(`${folder_url}/info.json`)).json()
                console.log(playListHeading.title)
                document.querySelector(".library-heading").innerHTML = playListHeading.title

                Array.from(document.querySelectorAll(".music")).forEach(e => {
                    e.addEventListener("click", () => {
                        tempCurrensong = e;
                        if (tempCurrensong == currentSong) {
                            currentTrack.addEventListener("loadedmetadata", setSongDuration);
                            playPause();
                        } else {
                            currentSong = e;
                            change_UI(e.parentElement);
                            let src = e.children[1].getAttribute("audio-link");
                            document.querySelector(".seekbar-song-name").innerText = src.replaceAll("%20", " ").split("/")[5];
                            first_play = false;
                            playMusic(src);
                        }
                    });
                });

                // Set default seekbar max value to the length of the first song
                if (song.length > 0) {
                    currentTrack.src = song[0];
                    currentTrack.addEventListener("loadedmetadata", function () {
                        range.max = currentTrack.duration;
                    });
                }
            });
        });
    }

    folder_url = folder[0];
    song = await fetch_songs(folder_url); // Update global song variable
    playList(song);
    resetSeekbar()

    Array.from(document.querySelectorAll(".music")).forEach(e => {
        e.addEventListener("click", () => {
            tempCurrensong = e;
            if (tempCurrensong == currentSong) {
                currentTrack.addEventListener("loadedmetadata", setSongDuration);
                playPause();
            } else {
                currentSong = e;
                change_UI(e.parentElement);
                let src = e.children[1].getAttribute("audio-link");
                document.querySelector(".seekbar-song-name").innerText = src.replaceAll("%20", " ").split("/")[5];
                first_play = false;
                playMusic(src);
            }
        });
    });

    currentSong = document.querySelector(".playList").firstElementChild;
    currentTrack.addEventListener("loadedmetadata", setSongDuration);
    document.querySelector(".play-pause").addEventListener("click", playPause);
    if (blackTheme === "false") {
        document.querySelector(".upperBox").style.filter = "invert(1)"
        document.querySelector(".lowerBox").style.filter = "invert(1)"
        document.querySelector(".rightBox").style.background = "#e9eaea"
        document.querySelector("nav").style.filter = "invert(1)"
        document.documentElement.style.setProperty('--white', 'black');
        document.documentElement.style.setProperty('--cardHover', '#cdcdcd');
        theme_blue = "#ff7915"
        currentSong.style.backgroundColor = theme_blue;
        localStorage.setItem("balckTheme", "false")
        blackTheme = localStorage.getItem("balckTheme")
    }
    else {
        document.body.style.background = "black"
        document.querySelector(".upperBox").style.filter = ""
        document.querySelector(".lowerBox").style.filter = ""
        document.querySelector(".rightBox").style.filter = ""
        document.querySelector("nav").style.filter = ""
        theme_blue = "#0086ea"
        currentSong.style.backgroundColor = theme_blue;
        document.querySelector(".rightBox").style.background = ""
        document.documentElement.style.setProperty('--white', 'white');
        document.documentElement.style.setProperty('--cardHover', '#323232');
        localStorage.setItem("balckTheme", "true")
        blackTheme = localStorage.getItem("balckTheme")
    }
    document.querySelector(".theme-color").addEventListener("click", setTheme);

}

function playPause() {
    currentTrack.volume = volumeLevel.value / 100;
    if (currentTrack.paused) {
        if (first_play) {
            currentSong.querySelector(".play-logo").style.opacity = 0;
            currentSong.querySelector(".pause-logo").style.opacity = 1;
            currentSong.style.backgroundColor = theme_blue;
            play_music.style.opacity = 0;
            pause_music.style.opacity = 1;
            currentTrack.addEventListener("loadedmetadata", setSongDuration);
            first_play = false;
        }
        currentTrack.play();
        if (currentSong.children[1].getAttribute("audio-link").split("/")[5].includes("%20")) {

            document.querySelector(".seekbar-song-name").innerText = currentSong.children[1].getAttribute("audio-link").split("/")[5].replaceAll("%20", " ")
        }
        else {
            document.querySelector(".seekbar-song-name").innerText = currentSong.children[1].getAttribute("audio-link").split("/")[5]
        }
        currentSong.querySelector(".play-logo").style.opacity = 0;
        currentSong.querySelector(".pause-logo").style.opacity = 1;
        play_music.style.opacity = 0;
        pause_music.style.opacity = 1;
    } else {
        currentSong.querySelector(".play-logo").style.opacity = 1;
        currentSong.querySelector(".pause-logo").style.opacity = 0;
        currentTrack.pause();
        play_music.style.opacity = 1;
        pause_music.style.opacity = 0;
    }
}

function setSongDuration() {
    songDuration = currentTrack.duration;
    range.max = Math.floor(songDuration);
}

function resetSeekbar() {
    document.querySelector(".duration").children[1].innerText = "00 : 00";
    document.querySelector(".duration").children[0].innerText = "00 : 00";
    range.value = 0;

    if (song.length > 0) {
        currentTrack.src = song[0];
        currentTrack.addEventListener("loadedmetadata", function () {
            range.max = Math.floor(currentTrack.duration);
        });
    } else {
        range.max = 100; // Default value if no songs are available
    }
}

currentTrack.addEventListener("timeupdate", () => {
    songCurrentTime = Math.floor(currentTrack.currentTime);
    document.querySelector(".duration").children[1].innerText = seconds_to_minuts(songDuration);
    document.querySelector(".duration").children[0].innerText = seconds_to_minuts(songCurrentTime);
    if (songCurrentTime == Math.floor(songDuration)) {
        currentSong.querySelector(".play-logo").style.opacity = 1;
        currentSong.querySelector(".pause-logo").style.opacity = 0;
        play_music.style.opacity = 1;
        pause_music.style.opacity = 0;
        next()
    }
    range.value = songCurrentTime;
});

document.querySelector(".seek-bar").addEventListener("input", () => {
    if (first_play) {
        currentTrack.addEventListener("loadedmetadata", setSongDuration);
        playPause();
        first_play = false;
    }
    currentTrack.pause();
    currentTrack.currentTime = range.value;
});

document.querySelector(".seek-bar").addEventListener("change", () => {
    currentSong.querySelector(".play-logo").style.opacity = 0;
    currentSong.querySelector(".pause-logo").style.opacity = 1;
    play_music.style.opacity = 0;
    pause_music.style.opacity = 1;
    currentTrack.play();
    currentTrack.currentTime = range.value;
});

document.querySelector(".previous").addEventListener("click", previous);
document.querySelector(".next").addEventListener("click", next);

function seconds_to_minuts(sont_time) {
    let minutes = Math.floor(sont_time / 60);
    let seconds = Math.floor(sont_time % 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return `${minutes} : ${seconds} `;
}

function previous() {
    if (currentSong.previousElementSibling) {
        let previousTrack = currentSong.previousElementSibling.children[1].getAttribute("audio-link");
        playMusic(previousTrack);
        document.querySelector(".seekbar-song-name").innerText = previousTrack.replaceAll("%20", " ").split("/")[5];
        currentSong = currentSong.previousElementSibling;
        change_UI(currentSong.parentElement);
    }
}

function next() {
    if (currentSong.nextElementSibling) {
        first_play = false;
        let nextTrack = currentSong.nextElementSibling.children[1].getAttribute("audio-link");
        playMusic(nextTrack);
        document.querySelector(".seekbar-song-name").innerText = nextTrack.replaceAll("%20", " ").split("/")[5];
        currentSong = currentSong.nextElementSibling;
        change_UI(currentSong.parentElement);
    }
}
main();
