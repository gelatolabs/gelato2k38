version = "2K38"
buildDate = "October 4, 2021"

function clippi(term) {
    clippiArt(term);
    switch(window.clippiPhase) {
        case(1):
            term.write("Oh no, looks like you don't have video drivers installed!\n\r");
    }
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
        title: 'GelatoTerm',
        root: document.body,
        x: '44',
        y: '100',
        width: '600',
        height: '400',
        onresize: () => { termFit.fit() },
        html: '<div class="term"></div>'
    });

    term.open(termWin.body.firstChild);
    term.loadAddon(localEcho);
    termFit.fit();
    term.focus();

    term.history = [];
    term.pwd = "/";

    term.onKey(e => {input = termKeyEvent(e, term, localEcho)});

    while (true) {
        await localEcho.read(term.pwd + "> ")
            .then(input => commandHandler(term, localEcho, input))
            .catch(error => void(0));
    }
}

function traversePath(pwd, path) {
    if (path.length == 0) {
        return pwd.replace(/\/+/g, '/').replace(/^$/, '/');
    }

    switch (path[0]) {
        case "":
            return traversePath("/", path.slice(1));
            break;

        case "..":
            return traversePath(pwd.substr(0, pwd.lastIndexOf("/")), path.slice(1));
            break;

        case ".":
            return traversePath(pwd, path.slice(1));
            break;

        default:
            return traversePath(pwd + "/" + path[0], path.slice(1));
            break;
    }
}

function spawnBrowser() {
    var browserWin = new WinBox({
        title: 'Mozzarella',
        root: document.body,
        x: '44',
        y: '100',
        width: '600',
        height: '400',
        html: `<div class="browser">
                   <form>
                       <button class="home" type="button" onclick="return browserHome(this)">Home</button><input type="text" placeholder="Enter a URL"><button class="go" onclick="return browserNav(this)">Go</button>
                   </form>
                   <iframe sandbox="allow-forms allow-scripts allow-same-origin" src="https://2k38wiki.gelatolabs.xyz/start"></iframe>
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
    browser.parentElement.nextSibling.nextSibling.src = "https://2k38wiki.gelatolabs.xyz/start";
    return false;
}

function spawnPhotoView(file) {
    var photoURL = "fs_elements/" + file;
    var photoPath = file.split('/');
    var photoID = photoPath[photoPath.length - 1].split('.')[0]
    var photoWin = new WinBox({
        title: 'Wandering Eye',
        root: document.body,
        x: '200',
        y: '300',
        html: '<img id="'+photoID+'" src="../'+photoURL+'" />'
    })
    var imgObj = document.querySelector('#'+photoID);
    photoWin.resize(imgObj.offsetWidth + 3, imgObj.offsetHeight + 35);
    while (imgObj.offsetHeight == 0) { // fix potential race condition
        photoWin.resize(imgObj.offsetWidth + 3, imgObj.offsetHeight + 35);
        var imgObj = document.querySelector('#'+photoID);
    }
}


function spawnAbout() {
    var aboutWin = new WinBox({
        title: "About Gelato System",
        x:'100',
        y:'100',
        width: '250',
        height: '350',
        html: `<div id="about" style="height:100%;width:100%;background:#c0c0c0;">
        <p style="text-align:center;font-size:20pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Gelato System</p>
        <p style="text-align:center;font-size:14pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Version: `+version+`</p>
        <p style="text-align:center;font-size:14pt;margin-top:0;margin-bottom:10px;padding-top:10px;">Build Date: `+buildDate+`</p>
        <img src="../assets/images/gelato-logo.png" style="width:60%;margin-left:20%;margin-right:20%;" />
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

function slowText (message, index, interval) {   
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

function termKeyEvent(e, term, echo) {
    if (e.key == '\x0c') {
        // Ctrl-L -> clear screen
        echo.abortRead("clear");
        echo.print('\x9B2J\x9BH');
    }
}

function commandHandler(term, echo, input) {
    args = input.split(' ');
    cmd = args.shift();
    switch(cmd) {
        case "help":
            switch(args[0]) {
                case "cd":
                    echo.println(`NAME
    cd - Change the shell working directory.
 
SYNOPSIS
    cd [dir]
 
DESCRIPTION
    Change the shell working directory.
 
    Change the current directory to [dir].  If omitted, the
    default [dir] is the root of the filesystem, '/'.
 
    If [dir] begins with a slash (/), it is interpreted as an
    absolute path. If not, it is interpreted relative to the
    current working directory.
 
    '..' in [dir] moved to the parent directory.
 
EXAMPLES
    > pwd
    /starting_directory
    > cd child/directories
    > pwd
    /starting_directory/child/directories
    > cd ..
    > pwd
    /starting_directory/child
    > cd /somewhere/else
    > pwd
    /somewhere/else
 
SEE ALSO
    help pwd
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;

                default:
                    echo.println(`Type 'help' followed by a command to learn more about it,
e.g. 'help cd'
 
cd: change the working directory
pwd: return working directory name
mkdir: make directories
rm: remove files or directories
ls: list directory contents
history: return command history
screenfetch: nothing of interest
pview: view image files`);
                    break;
            }
            break;

        case "cd":
            if (args.length == 0) {
                term.pwd = "/";
            } else if (args.length == 1) {
                dir = traversePath(term.pwd, args[0].split("/"));
                if (localStorage.getItem(dir) == "d") {
                    term.pwd = dir;
                } else {
                    echo.println("cd: " + args[0] + ": No such file or directory");
                }
            } else {
                echo.println("cd: too many arguments");
            }
            break;

        case "pwd":
            echo.println(term.pwd);
            break;

        case "mkdir":
            for (var i = 0; i < args.length; i++) {
                var dir = traversePath(term.pwd, args[i].split("/"));
                var parent = localStorage.getItem(dir.substr(0, dir.lastIndexOf("/")).replace(/^$/, '/'));

                if (parent == "d") {
                    localStorage.setItem(dir, "d");
                } else if (parent == "f") {
                    echo.println("mkdir: cannot create directory '" + args[i] + "': Not a directory");
                } else {
                    echo.println("mkdir: cannot create directory '" + args[i] + "': No such file or directory");
                }
            }
            break;

        case "rm":
            var files = [];
            for (var i = 0; i < localStorage.length; i++) {
                files.push(localStorage.key(i));
            }

            var opwd = term.pwd;
            var paths = args;
            if (paths.length > 0) {
                for (var i = 0; i < paths.length; i++) {
                    var path = traversePath(opwd, paths[i].split("/"));
                    localStorage.removeItem(path);
                    for (var j = 0; j < files.length; j++) {
                        file = files[j];
                        if (file.startsWith(path.replace(/([^\/])$/, '$1/'))) {
                            localStorage.removeItem(file);
                        }
                    }
                    while (term.pwd.startsWith(path)) {
                        term.pwd = term.pwd.substr(0, term.pwd.lastIndexOf("/"));
                    }
                }
            } else {
                echo.println("rm: missing operand");
            }
            break;

        case "ls":
            var files = [];
            for (var i = 0; i < localStorage.length; i++) {
                files.push(localStorage.key(i));
            }
            files.sort();

            var paths = args;
            if (paths.length == 0) {
                paths[0] = ".";
            }

            for (var i = 0; i < paths.length; i++) {
                var path = traversePath(term.pwd, paths[i].split("/"));
                if (localStorage.getItem(path) == "d") {
                    if (paths.length > 1) {
                        if (i > 0) {
                            echo.println();
                        }
                        echo.println(paths[i] + ":");
                    }
                    for (var j = 0; j < files.length; j++) {
                        var file = files[j];
                        var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                        if (parent == path && parent != file) {
                            if (localStorage.getItem(path) == "d") {
                                echo.println(file.substr(file.lastIndexOf("/") + 1) + "/");
                            } else {
                                echo.println(file.substr(file.lastIndexOf("/") + 1));
                            }
                        }
                    }
                } else if (localStorage.getItem(path) == "f") {
                    echo.println(path.substr(path.lastIndexOf("/") + 1));
                } else {
                    echo.println("ls: cannot access '" + paths[i] + "': No such file or directory");
                }
            }
            break;

        case "screenfetch":
            echo.println(`
    [0m[1;30m         #####              [0m[37m root[0m[1m@[0m[0m[37mgelato[0m[0m
    [0m[1;30m        #######             [0m[37m OS:[0m Gelato System 2k38 [0m[0m
    [0m[1;30m        ##[0m[1;37mO[0m[1;30m#[0m[1;37mO[0m[1;30m##             [0m[37m Kernel:[0m gelato 2.4.20-uc0[0m
    [0m[1;30m        #[0m[1;33m#####[0m[1;30m#             [0m[37m Uptime:[0m `+uptime()+`[0m[0m
    [0m[1;30m      ##[0m[1;37m##[0m[1;33m###[0m[1;37m##[0m[1;30m##           [0m[37m Shell:[0m gsh[0m[0m
    [0m[1;30m     #[0m[1;37m##########[0m[1;30m##          [0m[37m Resolution:[0m `+window.innerWidth+`x`+window.innerHeight+`[0m[0m
    [0m[1;30m    #[0m[1;37m############[0m[1;30m##         [0m[37m WM:[0m WinBox.js[0m[0m
    [0m[1;30m    #[0m[1;37m############[0m[1;30m###        [0m[37m CSS Theme:[0m 98.css [0m
    [0m[1;33m   ##[0m[1;30m#[0m[1;37m###########[0m[1;30m##         [0m[37m Terminal:[0m Xterm.js[0m[0m
    [0m[1;33m ######[0m[1;30m#[0m[1;37m#######[0m[1;30m#[0m[1;33m######      [0m[37m Font:[0m Pixelated MS Sans Serif 11[0m[0m
    [0m[1;33m #######[0m[1;30m#[0m[1;37m#####[0m[1;30m#[0m[1;33m#######      [0m[37m CPU:[0m RED SUS PT69 revision 1[0m
    [0m[1;33m   #####[0m[1;30m#######[0m[1;33m#####        [0m[37m GPU:[0m Chlamydia GooForce STI4090[0m`);
            break;

        case "history":
            for (var i = 0; i < term.history.length; i++) {
                echo.println(term.history[i]);
            }
            break;

        case "pview":
            console.log(term.pwd+'/'+args[0]);
            if (args.length == 0) {
                echo.println("pview: please enter an image filename to open");
            }
            else {
                file = traversePath(term.pwd, args[0].split("/"));
                if (localStorage.getItem(file) == ["f", "image"]) {
                    spawnPhotoView(file);
                }
                else {
                    echo.println("pview: Filetype not recognized or file does not exist.");
                }
            }
            break;

        case "":
            break;

        default:
            echo.println(cmd + ": command not found. If you are lost, type 'help'.")
    }
    if (input.length > 0) {
        term.history.push(term.input);
    }
}

function uptime() {
    var delta = Math.abs(boottime - new Date()) / 1000;
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

function lowRes() {
    var headHook = document.querySelector("head");
    var lowResCSS = '<link id="lowresCSS" rel="stylesheet" href="css/lowRes.css" />'
    headHook.innerHTML += lowResCSS;
}

function fullRes() {
    var lrCSSHook = document.querySelector("#lowresCSS");
    lrCSSHook.parentElement.removeChild(lrCSSHook)
}

const boottime = new Date();

updateClock();
setInterval(updateClock, 1000);

localStorage.setItem("/Images", "d");
localStorage.setItem("/Images/crycat.jpg", ["f", "image"]);
localStorage.setItem("/", "d");
