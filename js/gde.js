function initGDE() {
    setDisplay();

    if (localStorage.getItem("enableExtras")) {
        document.getElementById("gde-extras-btn").style.display = "block";
    }

    document.addEventListener("keyup", (e) => {
        if (e.code === "Escape") {
           toggleStart();
        }
    });

    document.addEventListener("click", () => {
        var audio = new Audio("assets/sound/click.ogg");
        audio.volume = parseFloat(localStorage.getItem("volume"));
        audio.play();
    }, true);

    var startup = new Audio("assets/sound/startup.ogg");
    startup.volume = parseFloat(localStorage.getItem("volume"));
    startup.play();
}

function spawnBrowser(url) {
    url = url ? url : 'https://2k38wiki.gelatolabs.xyz/start';
    var browserWin = new WinBox({
        title: '<img src="assets/images/mozzarella-logo.png" /> <span>Mozzarella</span>',
        width: Math.min(800, document.body.clientWidth-6),
        height: Math.min(600, document.body.clientHeight-54),
        html: `<div class="browser">
                   <form>
                       <button class="home" type="button" onclick="return browserHome(this)">Home</button><input type="text" placeholder="Enter a URL"><button class="go" onclick="return browserNav(this)">Go</button>
                   </form>
                   <iframe sandbox="allow-forms allow-scripts allow-same-origin" src="${url}"></iframe>
               </div>`
    });
}

async function spawnTerm() {
    const term = new Terminal({
        theme: {
            foreground: '#0F0'
        },
        rendererType: "dom"
    });
    const termFit = new FitAddon.FitAddon();
    const localEcho = new LocalEchoController();
    term.loadAddon(termFit);

    var termWin = new WinBox({
        title: '<img src="assets/images/gelatoterm-logo.png" /> <span>GelatoTerm</span>',
        class: ['termWin'],
        width: Math.min(600, document.body.clientWidth-6),
        height: Math.min(400, document.body.clientHeight-54),
        onresize: (width, height) => { termFit.fit(width-2, height-33) },
        html: '<div class="term"></div>'
    });

    term.open(termWin.body.firstChild);
    term.loadAddon(localEcho);
    termFit.fit(termWin.width-2, termWin.height-33);
    term.focus();

    term.history = [];
    term.pwd = "/home/root";

    localEcho.addAutocompleteHandler(autocomplete, term);

    term.onKey(e => {input = termKeyEvent(e, term, localEcho)});

    localEcho.println("Welcome to the Gelato System. Type 'help' for help.");

    while (true) {
        await localEcho.read(term.pwd + "> ")
            .then(input => commandHandler(term, localEcho, input))
            .catch(error => void(0));
    }
}

async function spawnClippi(wisdom) {
    var clippiWin = new WinBox({
        class: ['clippiWin'],
        x: 0,
        y: document.body.clientHeight-Math.min(300, document.body.clientHeight-54),
        width: Math.min(200, document.body.clientWidth-6),
        height: Math.min(300, document.body.clientHeight-54),
        html: `<div class="wisdom">${wisdom} <a onclick="this.parentElement.parentElement.parentElement.remove()">Thanks</a></div><img class="clippi" src="assets/images/clippi.png" />`
    });
}

function spawnAbout() {
    var aboutWin = new WinBox({
        title: '<img src="assets/images/about-logo.png" /> <span>About Gelato System</span>',
        width: Math.min(250, document.body.clientWidth-6),
        height: Math.min(500, document.body.clientWidth-54),
        html: `<div id="about" style="height:100%;width:100%;background:#c0c0c0;">
                   <p style="color:#000;text-align:center;font-size:20pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Gelato System</p>
                   <p style="color:#000;text-align:center;font-size:14pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Version: `+version+`</p>
                   <p style="color:#000;text-align:center;font-size:14pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Build Date: `+buildDate+`</p>
                   <img src="assets/images/gelato-logo.png" style="width:60%;margin-left:20%;margin-right:20%;" />
                   <div class="scroll-up">
                       <p>Made for Ludum Dare 49: "Unstable"<br>
                       <br>
                       The Gelato-Labs "G-Team" is:<br>
                       Kyle Farwell (kfarwell) -- Programming and Writing<br>
                       Matthew Petry (fireTwoOneNine) -- Programming and Writing<br>
                       Ryan Refcio -- Writing <br>
                       Alice Dalton (AliceVibes) -- Audio Design<br>
                       <br>
                       The Gelato System uses many open source projects:<br>
                       <br>
                       xterm.js - terminal emulator framework (MIT license)<br>
                       winbox.js - windowing manager (Apache-2.0 license)
                       98.css - visual style (MIT license)<br>
                       <br>
                       All original code in Gelato System is ISC licensed.<br>
                       <a href="https://github.com/gelatolabs/gelato2k38">https://github.com/gelatolabs/gelato2k38</a><br
                       <br>
                       Thanks for playing ♥
                       <br><br><br><br><br> 

                       Psst... have you realized this system is basically a fully functional terminal and desktop environment? Go take a look at all the commands.;)
                       </p>
                   </div>
               </div>`
    });
}

function spawnVolume() {
    var volumeWin = new WinBox({
        title: '<img src="assets/images/volume-logo.png" /> <span>Volume Mixer</span>',
        class: ['volumeWin'],
        x: document.body.clientWidth-206,
        width: 200,
        height: 68,
        html: `<div class="field-row">
                   <input class="has-box-indicator" type="range" min="0" max="1" step="0.1" value="${localStorage.getItem('volume')}" />
               </div>`
    });

    volumeWin.g.getElementsByTagName("input")[0].addEventListener("input", function() {
        setVolume(this.value);
    });
}

function spawnPhotoView(file) {
    var photoURL = "fs_elements/" + file;
    var photoPath = file.split('/');
    var photoID = photoPath[photoPath.length - 1].split('.')[0]
    var photoWin = new WinBox({
        title: '<img src="assets/images/wanderingeye-logo.png" /> <span>Wandering Eye</span>',
        html: '<img id="'+photoID+'" src="../'+photoURL+'" />'
    });
    winSizeHelper(photoWin);
}

function spawnAudioPlayer(file) {
    var audioURL = "fs_elements/" + file;
    var audioPath = file.split('/');
    var audioID = audioPath[audioPath.length - 1].split('.')[0]
    var audioWin = new WinBox({
        title: '<img src="assets/images/soundgoblin-logo.png" /> <span>Sound Goblin</span>',
        html: '<audio controls id="'+audioID+'" src="../'+audioURL+'" autoplay/>'
    });
    winSizeHelper(audioWin);
}

function spawnNotepad() {
    new WinBox({
        title: '<img src="assets/images/notepad-logo.png" /> <span>Notepad</span>',
        width: Math.min(400, document.body.clientWidth-6),
        height: Math.min(300, document.body.clientHeight-54),
        url: "https://98.js.org/programs/notepad/"
    });
}

function spawnCalculator() {
    new WinBox({
        title: '<img src="assets/images/calculator-logo.png" /> <span>Calculator</span>',
        width: Math.min(260, document.body.clientWidth-6),
        height: Math.min(285, document.body.clientHeight-54),
        url: "https://98.js.org/programs/calculator/"
    });
}

function spawnPaint() {
    new WinBox({
        title: '<img src="assets/images/paint-logo.png" /> <span>Paint</span>',
        width: Math.min(400, document.body.clientWidth-6),
        height: Math.min(400, document.body.clientHeight-54),
        url: "https://98.js.org/programs/jspaint/"
    });
}

function spawnRecorder() {
    new WinBox({
        title: '<img src="assets/images/recorder-logo.png" /> <span>Sound Recorder</span>',
        width: Math.min(400, document.body.clientWidth-6),
        height: Math.min(150, document.body.clientHeight-54),
        url: "https://98.js.org/programs/sound-recorder/"
    });
}

function spawnMinesweeper() {
    new WinBox({
        title: '<img src="assets/images/minesweeper-logo.png" /> <span>Minesweeper</span>',
        width: Math.min(280, document.body.clientWidth-6),
        height: Math.min(372, document.body.clientHeight-54),
        url: "https://98.js.org/programs/minesweeper/"
    });
}

function spawnSolitaire() {
    new WinBox({
        title: '<img src="assets/images/solitaire-logo.png" /> <span>Solitaire</span>',
        width: Math.min(600, document.body.clientWidth-6),
        height: Math.min(300, document.body.clientHeight-54),
        url: "https://98.js.org/programs/js-solitaire/"
    });
}

async function winSizeHelper(win) {
    var child = win.g.getElementsByClassName("wb-body")[0].firstChild;

    if (child.offsetWidth > 0) {
        win.resize(child.offsetWidth + 2, child.offsetHeight + 33);
    } else {
        setTimeout(function () {
            winSizeHelper(win);
        }, 100);
    }
}

function browserNav(browser) {
    url = browser.previousSibling.value;
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    url = 'https://web.archive.org/web/' + localStorage.getItem("waybackDate").replace(/-/g, '') + '/' + url;
    browser.parentElement.nextSibling.nextSibling.src = url;
    browser.previousSibling.value = '';
    return false; // don't submit form
}
function browserHome(browser) {
    browser.parentElement.nextSibling.nextSibling.src = "https://2k38wiki.gelatolabs.xyz/start";
    return false;
}

function toggleStart() {
    if (localStorage.getItem("fixedStart")) {
        var startmenu = document.getElementById('gde-startmenu-real');
        var notstartmenu = document.getElementById('gde-startmenu-404');
    } else {
        var startmenu = document.getElementById('gde-startmenu-404');
        var notstartmenu = document.getElementById('gde-startmenu-real');
    }
    var extras = document.getElementById('gde-extras');

    if (startmenu.style.display == "block" || notstartmenu.style.display == "block") {
        startmenu.style.display = "none";
    } else {
        startmenu.style.display = "block";
    }
    notstartmenu.style.display = "none";
    extras.style.display = "none";
}
function toggleExtras() {
    var extras = document.getElementById('gde-extras');

    if (extras.style.display == "block") {
        extras.style.display = "none";
    } else {
        extras.style.display = "block";
    }
}

function setVolume(v) {
    if (localStorage.getItem("falseaudioFixed") && parseFloat(v)) {
        localStorage.setItem("volume", Math.max(Math.min(v, 1.0), 0.0));
    } else {
        localStorage.setItem("volume", 0);
    }

    var sounds = document.getElementsByTagName("Audio");
    for (var i = 0; i < sounds.length; i++) {
        sounds[i].volume = parseFloat(localStorage.getItem("volume"));
    }
}
