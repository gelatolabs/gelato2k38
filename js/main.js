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
        class: ['termWin'],
        root: document.body,
        x: '44',
        y: '100',
        width: '600',
        height: '400',
        onresize: (width, height) => { termFit.fit(width-2, height-33) },
        html: '<div class="term"></div>'
    });

    term.open(termWin.body.firstChild);
    term.loadAddon(localEcho);
    termFit.fit(termWin.width-2, termWin.height-33);
    term.focus();

    term.history = [];
    term.pwd = "/";

    localEcho.addAutocompleteHandler(autocompleteCommands, term);
    localEcho.addAutocompleteHandler(autocompleteFiles, term);

    term.onKey(e => {input = termKeyEvent(e, term, localEcho)});

    while (true) {
        await localEcho.read(term.pwd + "> ")
            .then(input => commandHandler(term, localEcho, input))
            .catch(error => void(0));
    }
}

function autocompleteCommands(index, tokens, term) {
    if (index == 0) return ["cd", "help", "history", "ls", "mkdir", "pview", "pwd", "rm", "screenfetch", "sndplay"];
    return [];
}

function autocompleteFiles(index, tokens, term) {
    if (index == 0) return [];

    switch(tokens[0]) {
        case "help":
            return ["cd", "history", "ls", "mkdir", "pview", "pwd", "rm", "screenfetch", "sndplay"];
            break;

        case "cd":
        case "mkdir":
            if (index > 1) {
                return [];
            }

            var files = [];
            for (var i = 0; i < localStorage.length; i++) {
                files.push(localStorage.key(i));
            }
            files.sort();

            var matches = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                if (parent == term.pwd && parent != file && localStorage.getItem(file) == "d") {
                    matches.push(file.substr(file.lastIndexOf("/") + 1) + "/");
                }
            }
            return matches;
            break;

        case "ls":
        case "rm":
            if (index > 1) {
                return [];
            }

            var files = [];
            for (var i = 0; i < localStorage.length; i++) {
                files.push(localStorage.key(i));
            }
            files.sort();

            var matches = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                if (parent == term.pwd && parent != file) {
                    if (localStorage.getItem(file) == "d") {
                        matches.push(file.substr(file.lastIndexOf("/") + 1) + "/");
                    } else {
                        matches.push(file.substr(file.lastIndexOf("/") + 1));
                    }
                }
            }
            return matches;
            break;

        case "pview":
            if (index > 1) {
                return [];
            }

            var files = [];
            for (var i = 0; i < localStorage.length; i++) {
                files.push(localStorage.key(i));
            }
            files.sort();

            var matches = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                if (parent == term.pwd && parent != file && localStorage.getItem(file) == ["f", "image"]) {
                    matches.push(file.substr(file.lastIndexOf("/") + 1));
                }
            }
            return matches;
            break;

        case "sndplay":
            if (index > 1) {
                return [];
            }

            var files = [];
            for (var i = 0; i < localStorage.length; i++) {
                files.push(localStorage.key(i));
            }
            files.sort();

            var matches = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                if (parent == term.pwd && parent != file && localStorage.getItem(file) == ["f", "audio"]) {
                    matches.push(file.substr(file.lastIndexOf("/") + 1));
                }
            }
            return matches;
            break;

        default:
            return [];
            break;
    }
}

function traversePath(pwd, path) {
    return traversePathArr(pwd, path.replace(/\/$/, "").split("/"));
}

function traversePathArr(pwd, path) {
    if (path.length == 0) {
        return pwd.replace(/\/+/g, '/').replace(/^$/, '/');
    }

    switch (path[0]) {
        case "":
            return traversePathArr("/", path.slice(1));
            break;

        case "..":
            return traversePathArr(pwd.substr(0, pwd.lastIndexOf("/")), path.slice(1));
            break;

        case ".":
            return traversePathArr(pwd, path.slice(1));
            break;

        default:
            return traversePathArr(pwd + "/" + path[0], path.slice(1));
            break;
    }
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
    });
    winSizeHelper(photoWin);
}

function spawnAudioPlayer(file) {
    var audioURL = "fs_elements/" + file;
    var audioPath = file.split('/');
    var audioID = audioPath[audioPath.length - 1].split('.')[0]
    var audioWin = new WinBox({
        title: 'Sound Goblin',
        root: document.body,
        x: '200',
        y: '300',
        html: '<audio controls id="'+audioID+'" src="../'+audioURL+'" autoplay/>'
    });
    winSizeHelper(audioWin);
}

function spawnAbout() {
    var aboutWin = new WinBox({
        title: "About Gelato System",
        x:'100',
        y:'100',
        width: '250',
        height: '500',
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
    args = input.split(' ').filter(function(str) {
        return /\S/.test(str);
    });
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

                case "ls":
                    echo.println(`NAME
    ls - list directory contents
 
SYNOPSIS
    ls [dir]...
 
DESCRIPTION
    List  information  about the directory specified (the current directory by default).
 
EXAMPLES:
    > ls
    foo
    bar
    > ls foo
    lorem
    ipsum
 
SEE ALSO
    help cd
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;
                case "pwd":
                    echo.println(`NAME
    pwd - print name of current/working directory
 
SYNOPSIS
    pwd
 
DESCRIPTION
    Print the full filename of the current working directory.
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;
                case "mkdir":
                    echo.println(`NAME
    mkdir - make directories
 
SYNOPSIS
    mkdir DIRECTORY...
 
DESCRIPTION
    Create the DIRECTORY, if it does not already exist.
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;    
                case "rm":
                    echo.println(`NAME
    rm - remove files or directories
SYNOPSIS
    rm [FILE]...
 
DESCRIPTION
    rm removes each specified file.  By default, it does not
    remove directories.
 
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
pview: view image files
sndplay: play audio files
dispdrv: set display driver
ver: Display gsh version`);
                    break;
            }
            break;

        case "cd":
            if (args.length == 0) {
                term.pwd = "/";
            } else if (args.length == 1) {
                dir = traversePath(term.pwd, args[0]);
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
                var dir = traversePath(term.pwd, args[i]);
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
                    var path = traversePath(opwd, paths[i]);
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
                var path = traversePath(term.pwd, paths[i]);
                if (localStorage.getItem(path) == "d") {
                    if (paths.length > 1) {
                        if (i > 0) {
                            echo.println();
                        }
                        echo.println(paths[i] + ":");
                    }
                    var output = [];
                    for (var j = 0; j < files.length; j++) {
                        var file = files[j];
                        var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                        if (parent == path && parent != file) {
                            if (localStorage.getItem(file) == "d") {
                                output.push(file.substr(file.lastIndexOf("/") + 1) + "/");
                            } else {
                                output.push(file.substr(file.lastIndexOf("/") + 1));
                            }
                        }
                    }
                    echo.printWide(output);
                } else if (localStorage.getItem(path)[0] == "f") {
                    echo.println(path.substr(path.lastIndexOf("/") + 1));
                } else {
                    echo.println("ls: cannot access '" + paths[i] + "': No such file or directory"); // broken
                }
            }
            break;

        case "screenfetch":
            echo.println(`
    [0m[1;30m         #####              [0m[37m root[0m[1m@[0m[0m[37mgelato[0m[0m
    [0m[1;30m        #######             [0m[37m OS:[0m Gelato System 2K38 [0m[0m
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
                file = traversePath(term.pwd, args[0]);
                if (localStorage.getItem(file) == ["f", "image"]) {
                    spawnPhotoView(file);
                }
                else {
                    echo.println("pview: Filetype not recognized or file does not exist.");
                }
            }
            break;

        case "sndplay":
            console.log(term.pwd+'/'+args[0]);
            if (args.length == 0) {
                echo.println("sndplay: please enter an audio filename to open");
            }
            else {
                file = traversePath(term.pwd, args[0]);
                if (localStorage.getItem(file) == ["f", "audio"]) {
                    spawnAudioPlayer(file);
                }
                else {
                    echo.println("sndplay: Filetype not recognized or file does not exist.");
                }
            }
            break;
        
        case "dispdrv":
            if (args.length == 0) {
                echo.println("dispdrv: No driver specified. Use 'dispdrv list' to list all available drivers.");
            }
            else if (args[0] == "list") {
                echo.println(`aaaaaaaaaaa: Display driver for embracing eternal suffering
basicdis: Basic Display Driver (no acceleration)
cats: Display driver to only show pictures of cats
cga: Display driver for IBM CGA (160x100)
dummyvid: Completely disable video output
matrox: Display drivers for GPUs no one has used since 2001
mach: Display driver for ATS mach cards
poop: only show pictures of poop
ps2x: Display driver for very old Chlamydia GooForce2 cards
ps3x: Display driver for very old Chlamydia GooForce3 cards
radvid: Display driver for all modern ATS RadVidOn video cards`);
            }
            else if (args[0].length > 0) {
                var dispDrv;
                var availableDrv = ["aaaaaaaaaaa", "basicdis", "cats", "cga", "dummyvid", "matrox", "mach", "poop", "ps2x", "ps3x", "radvid"];
                for (var i = 0; i < availableDrv.length; i++) {
                    if (args[0] == availableDrv[i]) {
                        dispDrv = availableDrv[i];
                        break;
                    }
                }
                if (dispDrv.length > 0) {
                    echo.println("dispdrv: New display driver loaded. Please reboot to take effect.");
                }
                else {
                    echo.println("dispdrv: Unrecognized driver. Use 'dispdrv list' to list all available drivers.")
                }
            }
            break;

        case "ver":
            echo.println(`gsh -- Gelato SHell
version 5.0.17(1)-release

Running on Gelato kernel 2.4.20-uc0

Copyright (C) 2021 Gelato Labs
Distributed under the ISC license`);
            break;

        case "":
        case undefined:
            break;

        default:
            echo.println(cmd + ": command not found. If you are lost, type 'help'.")
    }
    if (input.length > 0) {
        term.history.push(input);
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
localStorage.setItem("/Music", "d");
localStorage.setItem("/Images/crycat.jpg", ["f", "image"]);
localStorage.setItem("/Music/bluesky.mp3", ["f", "audio"]);
localStorage.setItem("/", "d");
