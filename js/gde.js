function initGDE() {
    document.addEventListener("keyup", (e) => {
        if (e.code === "Escape") {
           toggleStart();
        }
    });

    document.addEventListener("click", () => {
        new Audio("assets/sound/click.ogg").play();
    }, true);
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
        }
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
    term.pwd = "/";

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
        html: `<div class="wisdom">${wisdom}</div><img class="clippi" src="assets/images/clippi.png" />`
    });
}

function spawnAbout() {
    var aboutWin = new WinBox({
        title: '<img src="assets/images/about-logo.png" /> <span>About Gelato System</span>',
        width: Math.min(250, document.body.clientWidth-6),
        height: Math.min(500, document.body.clientWidth-54),
        html: `<div id="about" style="height:100%;width:100%;background:#c0c0c0;">
                   <p style="text-align:center;font-size:20pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Gelato System</p>
                   <p style="text-align:center;font-size:14pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Version: `+version+`</p>
                   <p style="text-align:center;font-size:14pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Build Date: `+buildDate+`</p>
                   <img src="assets/images/gelato-logo.png" style="width:60%;margin-left:20%;margin-right:20%;" />
                   <div class="scroll-up">
                       <p>Made for Ludum Dare 49: "Unstable"<br>
                       <br>
                       The Gelato-Labs "G-Team" is:<br>
                       Kyle Farwell (kfarwell)<br>
                       Matthew Petry (fireTwoOneNine)<br>
                       Ryan Refcio<br></p>
                   </div>
               </div>`
    })
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
    url = 'https://web.archive.org/web/' + waybackDate.replace(/-/g, '') + '/' + url;
    browser.parentElement.nextSibling.nextSibling.src = url;
    browser.previousSibling.value = '';
    return false; // don't submit form
}
function browserHome(browser) {
    browser.parentElement.nextSibling.nextSibling.src = "https://2k38wiki.gelatolabs.xyz/start";
    return false;
}

function toggleStart() {
    if (localStorage.getItem("fixedstart") == 1) {
        var startmenu = document.getElementById('gde-startmenu-real');
        var notstartmenu = document.getElementById('gde-startmenu-404');
    } else {
        var startmenu = document.getElementById('gde-startmenu-404');
        var notstartmenu = document.getElementById('gde-startmenu-real');
    }

    if (startmenu.style.display == "block" || notstartmenu.style.display == "block") {
        startmenu.style.display = "none";
    } else {
        startmenu.style.display = "block";
    }
    notstartmenu.style.display = "none";
}
