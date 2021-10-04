function init(m) {
    mode = m;
    version = "2K38"
    buildDate = "October 4, 2021"

    wisdoms = [
        "Oh no, Looks like you’re missing video drivers! You’re gonna need those, unless you want to live your life in this green text world like me! You might want to find what card is in this thing!",
        "Yup! No idea what that thing is! Good thing there’s an App For That! Put that number thingy into the “devicelook” command and see what it gives you!",
        "Oh boy… somebody’s got Chlamydia! And probably paid a lot to get it… but not enough to not get it? Guess I shouldn’t judge, my tail’s never been bent…\n\n\rAnyway, you’re gonna have a “fun” time with that. Let’s just get you onto the Basic Display Driver for now. It won’t be pretty, but it’ll at least get us in the right direction. Go find the driver list and install the right one.  I’d help you, but I hate being in text form!",
        "Moment of truth! Start the desktop environment and see if the driver works!",
        "Good job! Thank the Creators for mandatory display standards. This is kinda cramped though… but now you have a web browser! Visit the Gelato Wiki and try to find the proper driver!"
    ];
    unwisdoms = [
        "Sometimes I show up for no reason at all! Like right now!",
        "CLIPPI stands for 'Clerk of Learning and Information for Perpetual Purgatorial Imprisonment'. The more you know!",
        "Stuck? Check out the Gelato System wiki at https://2k38wiki.gelatolabs.xyz!",
        "When in doubt, type 'help'!",
        "Have you tried turning it off and on again?",
        "Sometimes the best option is to give up and install Windows."
    ];

    cardID = [
        ["1002:1D61","Macrosoft Basic Display Adapter"],
        ["1002:1D62","ATS RadVidOn R6200"],
        ["1002:1D63","ATS RadVidOn R6300"],
        ["1002:1D64","ATS RadVidOn R6400"],
        ["1002:1D65","ATS RadVidOn RD6500"],
        ["1002:1D66","ATS RadVidOn RD6600"],
        ["1002:1D67","ATS RadVidOn RD6700"],
        ["1002:1D68","ATS RadVidOn RD6800"],
        ["10DE:1B61","NE555 Timer"],
        ["10DE:1B62","Chlamydia GooForce S2020"],
        ["10DE:1B63","Chlamydia GooForce ST2020"],
        ["10DE:1B64","Chlamydia GooForce ST2020"],
        ["10DE:1B65","Chlamydia GooForce ST2050"],
        ["10DE:1B66","Chlamydia GooForce STI2060"],
        ["10DE:1B67","Chlamydia GooForce STI2070"],
        ["10DE:1B68","Chlamydia GooForce STI2080"],
        ["10DE:1B69","Chlamydia GooForce STI2090"],
        ["10DE:1C61","Slower than a TI-82"],
        ["10DE:1C62","Chlamydia GooForce S3020"],
        ["10DE:1C63","Chlamydia GooForce ST3030"],
        ["10DE:1C64","Chlamydia GooForce ST3030"],
        ["10DE:1C65","Chlamydia GooForce ST3050"],
        ["10DE:1C66","Chlamydia GooForce STI3060"],
        ["10DE:1C67","Chlamydia GooForce STI3070"],
        ["10DE:1C68","Chlamydia GooForce STI3080"],
        ["10DE:1C69","Chlamydia GooForce STI3090"],
        ["10DE:1D61","Just play games on your phone instead."],
        ["10DE:1D62","Chlamydia GooForce S4020"],
        ["10DE:1D63","Chlamydia GooForce ST4030"],
        ["10DE:1D64","Chlamydia GooForce ST4040"],
        ["10DE:1D65","Chlamydia GooForce ST4050"],
        ["10DE:1D66","Chlamydia GooForce STI4060"],
        ["10DE:1D67","Chlamydia GooForce STI4070"],
        ["10DE:1D68","Chlamydia GooForce STI4080"],
        ["10DE:1D69","Chlamydia GooForce STI4090"]
    ];

    bootTime = new Date();
    updateClock();
    setInterval(updateClock, 1000);

    if (localStorage.getItem("/") != "d") {
        initLocalStorage();
    }

    if (localStorage.getItem("resMode") == "low") {
        lowRes();
    } else {
        fullRes();
    }

    if (localStorage.getItem("clippiPhase") == 2 && (localStorage.getItem("dispDrv") == "basicdis" || localStorage.getItem("dispDrv") == "radvid")) {
        localStorage.setItem("clippiPhase", 3);
    }
    if (localStorage.getItem("clippiPhase") == 3) {
        if (mode == "gde") {
            localStorage.setItem("clippiPhase", 4);
        } else {
            setTimeout(function() { clippi() }, 8000);
        }
    }
    if (localStorage.getItem("clippiPhase") == 4 && mode == "gde") {
        setTimeout(function() { clippi() }, 1000);
    }

    setInterval(function() {
        randomEvent = Math.floor(Math.random() * 100);
        if (randomEvent == 0) {
            window.location.href = "gsod.html";
        }
        else if (randomEvent < 5 && mode == "gde") {
            var clippiPhaseOrig = localStorage.getItem("clippiPhase");
            localStorage.setItem("clippiPhase", -1);
            clippi();
            localStorage.setItem("clippiPhase", clippiPhaseOrig);
        }
    }, 15000);

    if (mode == "gde") {
        initGDE();
    }
}

function initLocalStorage() {
    localStorage.clear();

    localStorage.setItem("/", "d");
    localStorage.setItem("/bing", "d");
    for (command in commands) {
        localStorage.setItem("/bing/" + command, ["f", "binary"]);
    }
    localStorage.setItem("/booty", "d");
    localStorage.setItem("/booty/permission denied", "f");
    localStorage.setItem("/devil", "d");
    localStorage.setItem("/devil/permission denied", "f");
    localStorage.setItem("/etc", "d");
    localStorage.setItem("/etc/permission denied", "f");
    localStorage.setItem("/home", "d");
    localStorage.setItem("/home/kyle", "d");
    localStorage.setItem("/home/kyle/permission denied", "f");
    localStorage.setItem("/home/matthew", "d");
    localStorage.setItem("/home/matthew/permission denied", "f");
    localStorage.setItem("/home/ryan", "d");
    localStorage.setItem("/home/ryan/permission denied", "f");
    localStorage.setItem("/home/root", "d");
    localStorage.setItem("/home/root/images", "d");
    localStorage.setItem("/home/root/images/nsfw", "d");
    localStorage.setItem("/home/root/images/sfw", "d");
    localStorage.setItem("/home/root/images/fruit", "d");
    localStorage.setItem("/home/root/images/cats", "d");
    localStorage.setItem("/home/root/images/cats/crycat.jpg", ["f", "image"]);
    localStorage.setItem("/home/root/music", "d");
    localStorage.setItem("/home/root/music/bluesky.mp3", ["f", "audio"]);
    localStorage.setItem("/home/root/hello.txt", ["f", "plain", "Hello,\nworld!"]);
    localStorage.setItem("/horseback", "d");
    localStorage.setItem("/horseback/permission denied", "f");
    localStorage.setItem("/opt", "d");
    localStorage.setItem("/opt/permission denied", "f");
    localStorage.setItem("/rootbeer", "d");
    localStorage.setItem("/rootbeer/alcoholic", "d");
    localStorage.setItem("/rootbeer/alcoholic/rum", "d");
    localStorage.setItem("/rootbeer/alcoholic/vodka", "d");
    localStorage.setItem("/rootbeer/alcoholic/vodka/martini", ["f", "plain", "ilovegelato42"]);
    localStorage.setItem("/rootbeer/alcoholic/whiskey", "d");
    localStorage.setItem("/rootbeer/non-alcoholic", "d");
    localStorage.setItem("/rootbeer/non-alcoholic/float", "d");
    localStorage.setItem("/rootbeer/non-alcoholic/float/icecream", "d");
    localStorage.setItem("/rootbeer/non-alcoholic/float/vegan", "d");
    localStorage.setItem("/runnynose", "d");
    localStorage.setItem("/runnynose/permission denied", "f");
    localStorage.setItem("/sobbin", "d");
    localStorage.setItem("/sobbin/permission denied", "f");
    localStorage.setItem("/serve", "d");
    localStorage.setItem("/serve/permission denied", "f");
    localStorage.setItem("/sys", "d");
    localStorage.setItem("/sys/permission denied", "f");
    localStorage.setItem("/trump", "d");
    localStorage.setItem("/trump/permission denied", "f");
    localStorage.setItem("/var", "d");
    localStorage.setItem("/var/permission denied", "f");

    localStorage.setItem("startTime", new Date());
    localStorage.setItem("waybackDate", "1998-06-25");
    localStorage.setItem("dispDrv", "none");
    localStorage.setItem("resMode", "full");
    localStorage.setItem("clippiPhase", 0);
    localStorage.setItem("volume", 0);
}

function clippi() {
    var phase = parseInt(localStorage.getItem("clippiPhase"));
    var wisdom;
    if (phase == -1) {
        wisdom = unwisdoms[Math.floor(Math.random() * unwisdoms.length)];
    } else {
        wisdom = wisdoms[phase];
    }

    if (mode == "gde") {
        var oldClippies = document.getElementsByClassName("clippiWin");
        for (var i = 0; i < oldClippies.length; i++) {
            oldClippies[i].remove();
        }

        spawnClippi(wisdom);
    } else {
        bootEcho.println("");
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
    if (mode != "gde") { return; }
    var headHook = document.querySelector("head");
    var lowResCSS = '<link id="lowresCSS" rel="stylesheet" href="css/lowRes.css" />'
    headHook.innerHTML += lowResCSS;
}
function fullRes() {
    var lrCSSHook = document.querySelector("#lowresCSS");
    if (lrCSSHook != null) {
        lrCSSHook.parentElement.removeChild(lrCSSHook);
    }
}
function setDisplay() {
    console.log("setDisplay()")
    localStorage.setItem("resMode", "full");
    switch (localStorage.getItem("dispDrv")) {
        case "aaaaaaaaaaa":
        case "basicdis":
            if (mode == "gde") {
                localStorage.setItem("resMode", "low");
                document.body.classList.add("crt");
            }
            break;
        case "cats":
            window.location.href = "assets/images/cats.jpg";
            break;
        case "cga":
            window.location.href = "blank.html";
            break;
        case "matrox":
            window.location.href = "gsod.html";
            break;
        case "mach":
            window.location.href = "gsod.html";
            break;
        case "poop":
            window.location.href = "assets/images/emojipoo.png";
            break;
        case "ps2x":
            window.location.href = "gsod.html";
            break;
        case "ps3x":
            window.location.href = "gsod.html";
            break;
        case "radvid":
            if (mode == "gde") {
                document.body.classList.add("crt");
                document.body.style.filter = "hue-rotate(180deg) blur(0.5px) brightness(2) contrast(8) saturate(100)";
            }
            break;
        default:
            if (mode == "gde") {
                window.location.href = "gsod.html";
            }
            break;
    }

    if (localStorage.getItem("resMode") == "low") {
        lowRes();
    } else {
        fullRes();
    }
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
