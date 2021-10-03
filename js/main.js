version = "2K38"
buildDate = "October 4, 2021"
inGDE = false;

commands = [
    ["cat", "print file contents"],
    ["cd", "change the working directory"],
    ["clear", "clear the terminal screen"],
    ["clippi", "clerk of learning and information for perpetual purgatorial imprisonment"],
    ["date", "print the system date and time"],
    ["dispdrv", "set display driver"],
    ["gde", "start the gelato desktop environment"],
    ["help", "get some help"],
    ["history", "return command history"],
    ["ls", "list directory contents"],
    ["man", "an interface to the system reference manuals"],
    ["mkdir", "make directories"],
    ["pview", "view image files"],
    ["pwd", "return working directory name"],
    ["reboot", "reboot the machine"],
    ["reset", "clear the terminal screen"],
    ["rm", "remove files or directories"],
    ["screenfetch", "nothing of interest"],
    ["shutdown", "shutdown the machine"],
    ["sndplay", "play audio files"],
    ["uptime", "tell how long the system has been running"],
    ["ver", "display gsh version"],
    ["whatis", "describe commands"]
];

wisdoms = [
    "Oh no, looks like you don't have video drivers installed!"
];

function clippi() {
    wisdom = wisdoms[localStorage.getItem("clippiPhase")];

    if (inGDE) {
        var clippiWin = new WinBox({
            title: '<img src="/assets/images/clippi-logo.png" /> <span>CLIPPI</span>',
            width: 200,
            height: 200,
            html: `<div class="clippi">${wisdom}</div>`
        });
    } else {
        bootEcho.println(wisdom);
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
        title: '<img src="/assets/images/gelatoterm-logo.png" /> <span>GelatoTerm</span>',
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

function autocomplete(index, tokens, term) {
    if (index == 0) return commands.map((cmds) => cmds[0]);

    switch(tokens[0]) {
        case "help":
        case "man":
            return commands.map((cmds) => cmds[0]);
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
                    } else if (file.startsWith("/")) {
                        matches.push(file.substr(file.lastIndexOf("/") + 1));
                    }
                }
            }
            return matches;
            break;

        case "cat":
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
                if (parent == term.pwd && parent != file && localStorage.getItem(file).startsWith(["f", "plain"])) {
                    matches.push(file.substr(file.lastIndexOf("/") + 1));
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

function spawnBrowser(url) {
    url = url ? url : 'https://2k38wiki.gelatolabs.xyz/start';
    var browserWin = new WinBox({
        title: '<img src="/assets/images/mozzarella-logo.png" /> <span>Mozzarella</span>',
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
        title: '<img src="/assets/images/wanderingeye-logo.png" /> <span>Wandering Eye</span>',
        html: '<img id="'+photoID+'" src="../'+photoURL+'" />'
    });
    winSizeHelper(photoWin);
}

function spawnAudioPlayer(file) {
    var audioURL = "fs_elements/" + file;
    var audioPath = file.split('/');
    var audioID = audioPath[audioPath.length - 1].split('.')[0]
    var audioWin = new WinBox({
        title: '<img src="/assets/images/soundgoblin-logo.png" /> <span>Sound Goblin</span>',
        html: '<audio controls id="'+audioID+'" src="../'+audioURL+'" autoplay/>'
    });
    winSizeHelper(audioWin);
}

function spawnAbout() {
    var aboutWin = new WinBox({
        title: '<img src="/assets/images/about-logo.png" /> <span>About Gelato System</span>',
        width: Math.min(250, document.body.clientWidth-6),
        height: Math.min(500, document.body.clientWidth-54),
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

function updateClock() {
    document.getElementById('gde-clock').innerHTML = new Date().toLocaleTimeString();
}

function slowText (echo, message, speed) {
    echo.print('\x9B2J\x9BH');
    for (var i = 0; i < message.length; i++) {
        setTimeout(function (c) {
            echo.print(c);
        }, i * speed, message[i]);
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
        case "man":
            if (args.length == 0) {
                if (cmd == "help") {
                    echo.println("Type 'help' followed by a command to learn more about it, e.g. 'help cd'");
                    echo.println("");
                    for (var i = 0; i < commands.length; i++) {
                        echo.println(commands[i][0] + ": " + commands[i][1]);
                    }
                    break;
                } else {
                    echo.println("What manual page do you want?\nFor example, try 'man man'.");
                }
            }

            for (var i = 0; i < commands.length; i++) {
                if (commands[i][0] == args[0]) {
                    echo.println("NAME\n    " + commands[i][0] + " - " + commands[i][1]);
                }
            }

            switch(args[0]) {
                case "cd":
                    echo.println(`
SYNOPSIS
    cd [DIR]
 
DESCRIPTION
    Change the shell working directory.
 
    Change the current directory to [DIR].  If omitted, the
    default [DIR] is the root of the filesystem, '/'.
 
    If [DIR] begins with a slash (/), it is interpreted as an
    absolute path. If not, it is interpreted relative to the
    current working directory.
 
    '..' in [DIR] moves to the parent directory.
 
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
    ${cmd} pwd
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;

                case "ls":
                    echo.println(`
SYNOPSIS
    ls [DIR]...
 
DESCRIPTION
    List the contents of the directory specified. If no directory is specified, list the contents of the current working directory.
 
EXAMPLES:
    > ls
    foo
    bar
    > ls foo
    lorem
    ipsum
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;
                case "pwd":
                    echo.println(`
SYNOPSIS
    pwd
 
DESCRIPTION
    Print the full path name of the current working directory.
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;
                case "mkdir":
                    echo.println(`
SYNOPSIS
    mkdir [DIR]...
 
DESCRIPTION
    Create the DIRECTORY, if it does not already exist. Its parent directory must already exist.
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;    
                case "rm":
                    echo.println(`
SYNOPSIS
    rm [FILE]...
 
DESCRIPTION
    rm removes each specified file or directory.
 
IMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
                    break;

                default:
                    var exists = false;
                    for (var i = 0; i < commands.length; i++) {
                        if (commands[i][0] == args[0]) {
                            exists = true;
                        }
                    }
                    if (exists) {
                        echo.println("\nBUGS\n    Documentation lacking.");
                    } else if (args[0] !== undefined) {
                        echo.println("No manual entry for " + args[0]);
                    }
                    break;
            }
            break;

        case "whatis":
            if (args.length == 0) {
                echo.println("whatis what?");
            } else {
                for (var i = 0; i < args.length; i++) {
                    for (var j = 0; j < commands.length; j++) {
                        if (commands[j][0] == args[i]) {
                            echo.println(commands[j][0] + ": " + commands[j][1]);
                        }
                    }
                }
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
                            } else if (file.startsWith("/")) {
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

        case "cat":
            for (var i = 0; i < args.length; i++) {
                file = localStorage.getItem(traversePath(term.pwd, args[i]));
                if (file.startsWith(["f", "plain"])) {
                    echo.println(file.split(",").slice(2));
                }
            }
            break;

        case "screenfetch":
            echo.println(`
[0m[1m            #########           [0m[0m[37m [0m[37mroot[0m[1m@[0m[0m[37mgelato[0m[0m
[0m[1m        #################       [0m[0m[37m [0m[37mOS:[0m Gelato System 2K38 [0m[0m
[0m[1m     ####               ####    [0m[0m[37m [0m[37mKernel:[0m gelato 2.4.20-uc0[0m
[0m[1m   ###       #######       ###  [0m[0m[37m [0m[37mUptime:[0m `+uptime()+`[0m[0m
[0m[1m  ###     #############     ### [0m[0m[37m [0m[37mShell:[0m gsh 5.0.17[0m[0m
[0m[1m ###     ###############     ###[0m[0m[37m [0m[37mResolution:[0m `+window.innerWidth+`x`+window.innerHeight+`[0m[0m
[0m[1m ###     ###############     ###[0m[0m[37m [0m[37mWM:[0m WinBox.js[0m[0m
[0m[1m ###     ###############     ###[0m[0m[37m [0m[37mCSS Theme:[0m 98.css [0m
[0m[1m  ###  ###################  ### [0m[0m[37m [0m[37mTerminal:[0m Xterm.js[0m[0m
[0m[1m   ###  ###  ### ###  ###  ###  [0m[0m[37m [0m[37mFont:[0m Pixelated MS Sans Serif 11[0m[0m
[0m[1m     ####               ####    [0m[0m[37m [0m[37mCPU:[0m RED SUS PT69 revision 1[0m
[0m[1m        #################       [0m[0m[37m [0m[37mGPU:[0m Chlamydia GooForce STI4090[0m
[0m[1m            #########          [0m[0m
                `);
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
                    }
                }
                if (dispDrv) {
                    localStorage.setItem("dispDrv", dispDrv);
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

        case "date":
            echo.println(new Date());
            break;

        case "uptime":
            echo.println(uptime());
            break;

        case "clippi":
            clippi();
            break;

        case "clear":
        case "reset":
            echo.print('\x9B2J\x9BH');
            break;

        case "gde":
            document.location.href = "gde.html";
            break;

        case "reboot":
            document.location.href = "reboot.html";
            break;

        case "shutdown":
            document.location.href = "shutdown.html";
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

function lowRes() {
    var headHook = document.querySelector("head");
    var lowResCSS = '<link id="lowresCSS" rel="stylesheet" href="css/lowRes.css" />'
    headHook.innerHTML += lowResCSS;
}

function fullRes() {
    var lrCSSHook = document.querySelector("#lowresCSS");
    lrCSSHook.parentElement.removeChild(lrCSSHook);
}

const bootTime = new Date();

updateClock();
setInterval(updateClock, 1000);

var startTime = localStorage.getItem("startTime");
if (startTime == null) {
    startTime = new Date();
    localStorage.setItem("startTime", startTime);
}

var dispDrv = localStorage.getItem("dispDrv");
if (dispDrv == null) {
    dispDrv = "none";
    localStorage.setItem("dispDrv", dispDrv);
}

var clippiPhase = localStorage.getItem("clippiPhase");
if (clippiPhase == null) {
    clippiPhase = 0;
    localStorage.setItem("clippiPhase", clippiPhase);
}

localStorage.setItem("/", "d");
localStorage.setItem("/Images", "d");
localStorage.setItem("/Images/crycat.jpg", ["f", "image"]);
localStorage.setItem("/Music", "d");
localStorage.setItem("/Music/bluesky.mp3", ["f", "audio"]);
localStorage.setItem("/hello.txt", ["f", "plain", "Hello,\nworld!"]);

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

setInterval(function() {
    if (Math.floor(Math.random() * 100) == 0) {
        window.location.href = "gsod.html";
    }
}, 5000);
