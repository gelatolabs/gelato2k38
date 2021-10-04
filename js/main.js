function init(m) {
    mode = m;
    version = "2K38"
    buildDate = "October 4, 2021"

    wisdoms = [
        "Oh no, looks like you don't have video drivers installed!",
        "Sometimes I show up for no reason at all! Like right now!",
        "Oh no, Looks like you’re missing video drivers! You’re gonna need those, unless you want to live your life in this green text world like me! You might want to find what card is in this thing!",
        "Sometimes I show up for no reason at all! Like right now!",
        "Yup! No idea what that thing is! Good thing there’s an App For That! Put that number thingy into the “devicelook” command and see what it gives you!",
        "Oh boy… somebody’s got Chlamydia! And probably paid a lot to get it… but not enough to not get it? Guess I shouldn’t judge, my tail’s never been bent…\n\n\rAnyway, you’re gonna have a “fun” time with that. Let’s just get you onto the basic drivers. It won’t be pretty, but it’ll at least get us in the right direction. Go find the driver list and install the right one.  I’d help you, but I hate being in text form!"
    ];

    bootTime = new Date();
    updateClock();
    setInterval(updateClock, 1000);

    startTime = localStorage.getItem("startTime");
    if (startTime == null) {
        startTime = new Date();
        localStorage.setItem("startTime", startTime);
    }

    waybackDate = localStorage.getItem("waybackDate");
    if (waybackDate == null) {
        waybackDate = "1998-06-25";
        localStorage.setItem("waybackDate", waybackDate);
    }

    dispDrv = localStorage.getItem("dispDrv");
    if (dispDrv == null) {
        dispDrv = "none";
        localStorage.setItem("dispDrv", dispDrv);
    }
    switch (dispDrv) {
        case "aaaaaaaaaaa":
        case "basicdic":
        case "cats":
        case "cga":
        case "matrox":
        case "mach":
        case "poop":
        case "ps2x":
        case "ps3x":
        case "radvid":
            document.body.classList.add("crt");
            document.body.style.filter = "hue-rotate(180deg) blur(0.5px) brightness(2) contrast(8) saturate(100)";
    }

    clippiPhase = parseInt(localStorage.getItem("clippiPhase"));
    if (isNaN(clippiPhase)) {
        clippiPhase = 0;
        localStorage.setItem("clippiPhase", clippiPhase);
    }

    localStorage.setItem("/", "d");
    localStorage.setItem("/Images", "d");
    localStorage.setItem("/Images/crycat.jpg", ["f", "image"]);
    localStorage.setItem("/Music", "d");
    localStorage.setItem("/Music/bluesky.mp3", ["f", "audio"]);
    localStorage.setItem("/hello.txt", ["f", "plain", "Hello,\nworld!"]);

    setInterval(function() {
        randomEvent = Math.floor(Math.random() * 100);
        if (randomEvent == 0) {
            window.location.href = "gsod.html";
        }
        else if (randomEvent < 5) {
            var clippiPhaseOrig = clippiPhase;
            localStorage.setItem("clippiPhase", 1);
            clippi();
            localStorage.setItem("clippiPhase", clippiPhaseOrig);
        }
    }, 15000);

    if (mode == "gde") {
        initGDE();
    }
}

function clippi() {
    wisdom = wisdoms[parseInt(localStorage.getItem("clippiPhase"))];

    if (mode == "gde") {
        var oldClippies = document.getElementsByClassName("clippiWin");
        for (var i = 0; i < oldClippies.length; i++) {
            oldClippies[i].remove();
        }

        spawnClippi(wisdom);
    } else {
        bootEcho.println(wisdom);
        bootEcho.println(`
              /  \\
              |  |
              @  @
              |  |
              || |/
              || ||
              |\\_/|
              \\___/`);
    }
}

function lowRes() {
    var headHook = document.querySelector("head");
    var lowResCSS = '<link id="lowresCSS" rel="stylesheet" href="css/lowRes.css" />'
    headHook.innerHTML += lowResCSS;
}
function fullRes() {
    var lrCSSHook = document.querySelector("#lowresCSS");
    lrCSSHook.parentElement.removeChild(lrCSSHook);
}

function uptime() {
    var delta = Math.abs(bootTime - new Date()) / 1000;
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    var seconds = Math.floor(delta % 60);

    result = "";
    if (days > 0) { result += days + "d " }
    if (hours > 0) { result += hours + "h " }
    if (minutes > 0) { result += minutes  + "m " }
    if (seconds > 0) { result += seconds + "s " }
    return result;
}
function updateClock() {
    if (mode == "gde"){
        document.getElementById('gde-clock').innerHTML = new Date().toLocaleTimeString();
    }
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }

    return result;
}

function slowText (echo, message, speed) {
    echo.print('\x9B2J\x9BH');
    for (var i = 0; i < message.length; i++) {
        setTimeout(function (c) {
            echo.print(c);
        }, i * speed, message[i]);
    }
}
