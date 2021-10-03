function clippiArt(term) {
    term.write("[0m[37m                /  \\\n\r");
    term.write("[0m[37m                |  |\n\r");
    term.write("[0m[37m                @  @\n\r");
    term.write("[0m[37m                |  |\n\r");
    term.write("[0m[37m                || |/\n\r");
    term.write("[0m[37m                || ||\n\r");
    term.write("[0m[37m                |\_/|\n\r");
    term.write("[0m[37m                \___/\n\r");
    term.write("\n")
}

function bootClippi(term) {   
    clippiArt(term);
    term.write("[0m[1mHi! I'm CLIPPI! It looks like you need help!\n\r");
    term.write("If you need help, type 'clippi' at the terminal.\n\r");
    window.clippiPhase = 1;
}

function clippi(term) {
    clippiArt(term);
    switch(window.clippiPhase) {
        case(1):
            term.write("Oh no, looks like you don't have video drivers installed!\n\r");
    }
}

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
        width: '600',
        height: '400',
        onresize: termFit.fit(), // doesn't work
        html: '<div class="term"></div>'
    });

    term.open(termWin.body.firstChild);
    termFit.fit();
    term.write("/> ");
    term.focus();

    term.history = [];
    term.historyIndex = 0;
    term.pwd = "/";
    term.input = ""

    term.onKey(e => {input = termKeyEvent(e, term)});
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

function termKeyEvent(e, term) {
    if (e.key.charCodeAt(0) == 127) {
        // Backspace
        term.write('\b\x1b[1;P');
        term.input = term.input.slice(0, term.input.length - 1);
    }
    else if (e.key == '\x0c') {
        // Ctrl-L
        term.write('\x9B2J\x9BH' + term.pwd + '> ');
        term.input = "";
    }
    else if (e.key == '\x1b[A' && term.history.length > 0) {
        // Up arrow
        term.historyIndex = Math.max(term.historyIndex - 1, 0);
        term.input = term.history[term.historyIndex];
        term.write('\x9B2K\r' + term.pwd + '> ' + term.input);
    }
    else if (e.key == '\x1b[B') {
        // Down arrow
        term.historyIndex++;
        if (term.historyIndex < term.history.length) {
            term.input = term.history[term.historyIndex];
            term.write('\x9B2K\r' + term.pwd + '> ' + term.input);
        } else {
            term.historyIndex = term.history.length;
            term.input = "";
            term.write('\x9B2K\r' + term.pwd + '> ');
        }
    }
    else if (e.key == '\r') {
        term.write('\r\n');
        commandHandler(term);
        if (term.input.length > 0) {
            term.history.push(term.input);
            term.historyIndex = term.history.length;
        }
        term.write('\r' + term.pwd + '> ');
        term.input = "";
    }
    else {
        term.input += e.key;
        term.write(e.key);
    }
    return term.input;
}

function commandHandler(term) {
    args = input.split(' ');
    cmd = args.shift();
    switch(cmd) {
        case "help":
            switch(args[0]) {
                case "cd":
                    term.write(`NAME\r
    cd - Change the shell working directory.\r
\r
SYNOPSIS\r
    cd [dir]\r
\r
DESCRIPTION\r
    Change the shell working directory.\r
    \r
    Change the current directory to [dir].  If omitted, the\r
    default [dir] is the root of the filesystem, '/'.\r
    \r
    If [dir] begins with a slash (/), it is interpreted as an\r
    absolute path. If not, it is interpreted relative to the\r
    current working directory.\r
\r
    '..' in [dir] moved to the parent directory.\r
\r
EXAMPLES\r
    > pwd\r
    /starting_directory\r
    > cd child/directories\r
    > pwd\r
    /starting_directory/child/directories\r
    > cd ..\r
    > pwd\r
    /starting_directory/child\r
    > cd /somewhere/else\r
    > pwd\r
    /somewhere/else\r
    \r
SEE ALSO\r
    help pwd\r
\r
IMPLEMENTATION\r
    Gelato gsh, version 5.0.17(1)-release\r
    Copyright (C) 2021 Gelato Labs\r
    Distributed under the ISC license\n`);
                    break;

                default:
                    term.write("Type 'help' followed by a command to learn more about it,\n\re.g. 'help cd'\n\n\rcd: change the working directory\n\rpwd: return working directory name\n\rmkdir: make directories\n\rrm: remove files or directories\n\rls: list directory contents\n\rhistory: return command history\n\rscreenfetch: nothing of interest\n\rpview: view image files\n");
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
                    term.write("cd: " + args[0] + ": No such file or directory\n");
                }
            } else {
                term.write("cd: too many arguments\n");
            }
            break;

        case "pwd":
            term.write(term.pwd + "\n");
            break;

        case "mkdir":
            for (var i = 0; i < args.length; i++) {
                var dir = traversePath(term.pwd, args[i].split("/"));
                var parent = localStorage.getItem(dir.substr(0, dir.lastIndexOf("/")).replace(/^$/, '/'));

                if (parent == "d") {
                    localStorage.setItem(dir, "d");
                } else if (parent == "f") {
                    term.write("mkdir: cannot create directory '" + args[i] + "': Not a directory\n");
                } else {
                    term.write("mkdir: cannot create directory '" + args[i] + "': No such file or directory\n");
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
                term.write("rm: missing operand\n");
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
                            term.write("\n\r");
                        }
                        term.write(paths[i] + ":\n\r");
                    }
                    for (var j = 0; j < files.length; j++) {
                        var file = files[j];
                        var parent = file.substr(0, file.lastIndexOf("/")).replace(/^$/, '/');
                        if (parent == path && parent != file) {
                            term.write(file.substr(file.lastIndexOf("/") + 1) + "\n\r");
                        }
                    }
                } else if (localStorage.getItem(path) == "f") {
                    term.write(path.substr(path.lastIndexOf("/") + 1) + "\n\r");
                } else {
                    term.write("ls: cannot access '" + paths[i] + "': No such file or directory\n");
                }
            }
            break;

        case "screenfetch":
            term.write(`
    [0m[1;30m         #####              [0m[37m root[0m[1m@[0m[0m[37mgelato[0m[0m\r
    [0m[1;30m        #######             [0m[37m OS:[0m Gelato System 2k38 [0m[0m\r
    [0m[1;30m        ##[0m[1;37mO[0m[1;30m#[0m[1;37mO[0m[1;30m##             [0m[37m Kernel:[0m gelato 2.4.20-uc0[0m\r
    [0m[1;30m        #[0m[1;33m#####[0m[1;30m#             [0m[37m Uptime:[0m `+uptime()+`[0m[0m\r
    [0m[1;30m      ##[0m[1;37m##[0m[1;33m###[0m[1;37m##[0m[1;30m##           [0m[37m Shell:[0m gsh[0m[0m\r
    [0m[1;30m     #[0m[1;37m##########[0m[1;30m##          [0m[37m Resolution:[0m `+window.innerWidth+`x`+window.innerHeight+`[0m[0m\r
    [0m[1;30m    #[0m[1;37m############[0m[1;30m##         [0m[37m WM:[0m WinBox.js[0m[0m\r
    [0m[1;30m    #[0m[1;37m############[0m[1;30m###        [0m[37m CSS Theme:[0m 98.css [0m\r
    [0m[1;33m   ##[0m[1;30m#[0m[1;37m###########[0m[1;30m##         [0m[37m Terminal:[0m Xterm.js[0m[0m\r
    [0m[1;33m ######[0m[1;30m#[0m[1;37m#######[0m[1;30m#[0m[1;33m######      [0m[37m Font:[0m Pixelated MS Sans Serif 11[0m[0m\r
    [0m[1;33m #######[0m[1;30m#[0m[1;37m#####[0m[1;30m#[0m[1;33m#######      [0m[37m CPU:[0m RED SUS PT69 revision 1[0m\r
    [0m[1;33m   #####[0m[1;30m#######[0m[1;33m#####        [0m[37m GPU:[0m Chlamydia GooForce STI4090[0m\r
                        \n`);
            break;

        case "history":
            for (var i = 0; i < term.history.length; i++) {
                term.write(term.history[i] + "\n\r");
            }
            break;

        case "pview":
            console.log(term.pwd+'/'+args[0]);
            if (args.length == 0) {
                term.write("pview: please enter an image filename to open\n");
            }
            else {
                file = traversePath(term.pwd, args[0].split("/"));
                if (localStorage.getItem(file) == ["f", "image"]) {
                    spawnPhotoView(file);
                }
                else {
                    term.write("pview: Filetype not recognized or file does not exist.\n");
                }
            }
            break;

        case "":
            break;

        default:
            term.write(cmd + ": command not found. If you are lost, type 'help'.\n")
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

const boottime = new Date();

updateClock();
setInterval(updateClock, 1000);

localStorage.setItem("/Images", "d");
localStorage.setItem("/Images/crycat.jpg", ["f", "image"]);
localStorage.setItem("/", "d");
