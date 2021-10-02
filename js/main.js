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

    var input = "";
    var history = [];
    var historyIndex = 0;
    var pwd = "/";

    term.onKey(e => {
        if (e.key.charCodeAt(0) == 127) {
            // Backspace
            term.write('\b\x1b[1;P');
            input = input.slice(0, input.length - 1);
        }
        else if (e.key == '\x0c') {
            // Ctrl-L
            term.write('\x9B2J\x9BH' + pwd + '> ');
            input = "";
        }
        else if (e.key == '\x1b[A' && history.length > 0) {
            // Up arrow
            historyIndex = Math.max(historyIndex - 1, 0);
            input = history[historyIndex];
            term.write('\x9B2K\r' + pwd + '> ' + input);
        }
        else if (e.key == '\x1b[B') {
            // Down arrow
            historyIndex++;
            if (historyIndex < history.length) {
                input = history[historyIndex];
                term.write('\x9B2K\r' + pwd + '> ' + input);
            } else {
                historyIndex = history.length;
                input = "";
                term.write('\x9B2K\r' + pwd + '> ');
            }
        }
        else if (e.key == '\r') {
            term.write('\r\n');
            args = input.split(' ');
            cmd = args.shift();

            switch(cmd) {
                case "help":
                    term.write("cd: change the working directory\n\rpwd: return working directory name\n\rmkdir: make directories\n\rls: list directory contents\n\rhistory: return command history\n\rscreenfetch: nothing of interest\n");
                    break;

                case "cd":
                    if (args.length == 0) {
                        pwd = "/";
                    } else if (args.length == 1) {
                        dir = traversePath(pwd, args[0].split("/"));
                        if (localStorage.getItem(dir) == "d") {
                            pwd = dir;
                        } else {
                            term.write("cd: " + args[0] + ": No such file or directory\n");
                        }
                    } else {
                        term.write("cd: too many arguments\n");
                    }
                    break;

                case "pwd":
                    term.write(pwd + "\n");
                    break;

                case "mkdir":
                    for (var i = 0; i < args.length; i++) {
                        var dir = traversePath(pwd, args[i].split("/"));
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
                        var path = traversePath(pwd, paths[i].split("/"));
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
                    for (var i = 0; i < history.length; i++) {
                        term.write(history[i] + "\n\r");
                    }
                    break;

                case "":
                    break;

                default:
                    term.write(cmd + ": command not found. If you are lost, type 'help'.\n")
            }

            term.write('\r' + pwd + '> ');
            if (input.length > 0) {
                history.push(input);
                historyIndex = history.length;
            }
            input = "";
        }
        else {
            input += e.key;
            term.write(e.key);
        }
    });
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
                   <iframe sandbox="allow-forms allow-scripts allow-same-origin" src="../docs/index.html"></iframe>
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
    browser.parentElement.nextSibling.nextSibling.src = '../docs/index.html';
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
        term.write('\n\r/> ');
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

localStorage.setItem("/", "d");
