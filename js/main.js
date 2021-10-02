function spawnTerm() {
    const term = new Terminal({
        theme: {
            foreground: '#0F0'
        }
    });
    const termFit = new FitAddon.FitAddon();
    term.loadAddon(termFit);

    var termWin = new WinBox({
        title: 'GelatoTerm',
        x: '44',
        y: '100',
        width: '400',
        height: '300',
        onresize: termFit.fit(), // doesn't work
        html: '<div class="term"></div>'
    });

    term.open(termWin.body.firstChild);
    termFit.fit();
    term.write("$ ");
    term.focus();
    var inputString = "";
    term.onKey(e => {termKeyEvent(e)});
}

function spawnBrowser() {
    var browserWin = new WinBox({
        title: 'Mozzarella',
        x: '44',
        y: '100',
        width: '600',
        height: '400',
        html: `<div class="browser">
                   <form>
                       <button class="home" type="button" onclick="return browserHome(this)">Home</button><input type="text" placeholder="Enter a URL"><button class="go" onclick="return browserNav(this)">Go</button>
                   </form>
                   <iframe sandbox="allow-forms allow-scripts allow-same-origin" src="https://2k38.gelatolabs.xyz/docs/index.html"></iframe>
               </div>`
    });
}

function browserNav(browser) {
    url = browser.previousSibling.value;
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    browser.parentElement.nextSibling.nextSibling.src = url;
    browser.previousSibling.value = '';
    return false; // don't submit form
}
function browserHome(browser) {
    browser.parentElement.nextSibling.nextSibling.src = 'https://2k38.gelatolabs.xyz/docs/index.html';
    return false;
}

function toggleStart() {
    var startmenu = document.getElementById('gde-startmenu');
    if (startmenu.style.display == "block") {
        startmenu.style.display = "none";
    } else {
        startmenu.style.display = "block";
    }
}

function updateClock() {
    document.getElementById('gde-clock').innerHTML = new Date().toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

var slowText = function (message, index, interval) {   
    if (index < message.length) {
        term.write(message[index++]);
        setTimeout(function () { slowText(message, index, interval); }, interval);
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

function termKeyEvent(e) {
    if (e.key.charCodeAt(0) == 127) {
        term.write('\b\x1b[1;P');
        inputString = inputString.slice(0,inputString.length - 1);
    }
    else {
        inputString += e.key;
        term.write(e.key);
    }
    if (e.key == '\r') {
        term.write('\n');
        commandHandler(inputString);
        term.write('\n\rroot> ');
        inputString = "";
    }
}

function commandHandler(input) {
    if (input.toLowerCase().startsWith("help")) {
        term.write("there is no help, only gelato");
    }
    else {
        term.write("Unrecognized Command. If you are lost, type 'help'")
    }
}
