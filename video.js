function myVideo(container, src, options) {
    if (!src) {
        console.warn("must has video src");
        return;
    }
    container =
        container instanceof HTMLElement
            ? container
            : document.querySelector(container);
    var video = document.createElement("video");
    var type = src.split(".").slice(-1)[0];
    if (video.canPlayType("video/" + type) === "") {
        console.warn(type + " type not support");
        return;
    }

    video.addEventListener("canplaythrough", _videoLoad, false);
    video.src = src;
    video.controls = false;

    var hasInit = false;
    function _videoLoad(e) {
        if (!hasInit) {
            _init();
            hasInit = true;
        }
    }

    function _init() {
        _setLayout(video);
        _setControls();
        _bindEvent();
        video.play();
    }

    function _setLayout(video) {
        var w = video.videoWidth,
            h = video.videoHeight,
            ratio = w / h;
        var maxW = 1200;
        var newW = Math.floor(Math.min(maxW, w));
        var newH = Math.floor(newW / ratio);
        container.style.width = video.style.width = newW + "px";
        container.style.height = video.style.height = newH + "px";
        container.appendChild(video);
    }

    function _setControls() {
        var controlsHtml =
            '<div class="video-interface">' +
            '<div class="video-progress"><div class="video-seek-bar"><div class="video-play-bar"></div></div></div>' +
            '<div class="video-time"><span class="video-current-time"></span><span>/</span><span class="video-duration"></span></div>' +
            '<div class="video-controls-holder">' +
            '<div class="video-controls"><button class="video-play"></button></div>' +
            '<div class="video-volume-controls">' +
            '<button class="video-mute"></button>' +
            '<div class="video-volume-bar"><div class="video-volume-bar-value"></div></div>' +
            "</div>" +
            "</div>" +
            "</div>";
        var videoGUI = document.createElement("div");
        videoGUI.className = "video-gui";
        videoGUI.innerHTML = controlsHtml;
        container.appendChild(videoGUI);
    }

    function _bindEvent() {
        //播放或暂停
        var playBtn = container.querySelector(".video-play");
        playBtn.addEventListener(
            "click",
            function(e) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            },
            false
        );
        video.addEventListener(
            "playing",
            function(e) {
                playBtn.parentNode.classList.add("video-state-playing");
            },
            false
        );
        video.addEventListener(
            "pause",
            function(e) {
                playBtn.parentNode.classList.remove("video-state-playing");
            },
            false
        );

        //播放的时间
        var currentTime = container.querySelector(".video-current-time");
        var totalTime = container.querySelector(".video-duration");
        var seekBar = container.querySelector(".video-seek-bar");
        var playBar = container.querySelector(".video-play-bar");
        playBar.parentNode.style.width = "100%";
        currentTime.innerText = timeFormat(0);
        totalTime.innerText = timeFormat(video.duration);
        var seekWidth = seekBar.offsetWidth;
        seekBar.addEventListener(
            "click",
            function(e) {
                var ratio = e.offsetX / seekWidth;
                video.currentTime = ratio * video.duration;
            },
            false
        );
        video.addEventListener(
            "timeupdate",
            function(e) {
                playBar.style.width =
                    video.currentTime / video.duration * 100 + "%";
                currentTime.innerText = timeFormat(video.currentTime);
            },
            false
        );

        //播放结束后
        video.addEventListener(
            "ended",
            function(e) {
                playBar.style.width = "0";
                playBtn.parentNode.classList.remove("video-state-playing");
            },
            false
        );

        //音量
        var volumeBar = container.querySelector(".video-volume-bar");
        var volumeBarValue = container.querySelector(".video-volume-bar-value");
        var volumeMute = container.querySelector(".video-mute"); //音量图标
        var volumeBarWidth = volumeBar.offsetWidth;
        var volumeState = video.volume;
        volumeBarValue.style.width = volumeState * 100 + "%";
        volumeBar.addEventListener(
            "click",
            function(e) {
                var ratio = e.offsetX / volumeBarWidth;
                volumeBarValue.style.width = ratio * 100 + "%";
                volumeState = video.volume = ratio;
            },
            false
        );
        volumeMute.addEventListener(
            "click",
            function(e) {
                if (video.muted) {
                    video.muted = false;
                    volumeBarValue.style.width = volumeState * 100 + "%";
                } else {
                    video.muted = true;
                    volumeBarValue.style.width = "0%";
                }
            },
            false
        );

        //移入显示状态栏，移出隐藏状态栏
        var mouseTimerId = null;
        var videoInterfaceStyle = container.querySelector(".video-interface")
            .style;
        container.addEventListener("mouseenter", function(e) {
            clearTimeout(mouseTimerId);
            videoInterfaceStyle.display = "block";
        });
        container.addEventListener("mouseleave", function(e) {
            mouseTimerId = setTimeout(function() {
                videoInterfaceStyle.display = "none";
            }, 1600);
        });
    }

    function timeFormat(time) {
        if (time < 0) {
            return;
        }
        var miutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60);
        return numFormat(miutes) + ":" + numFormat(seconds);
    }

    function numFormat(num) {
        return num < 10 ? "0" + num : num;
    }
}
