function commandHandler(term, echo, input) {
    args = input.split(' ').filter(function(str) {
        return /\S/.test(str);
    });
    cmd = args.shift();

    if (cmd in commands) {
        commands[cmd].run(args, term, echo);
    } else if (input.length > 0) {
        echo.println(cmd + ": command not found. If you are lost, type 'help'.");
    }

    if (input.length > 0) {
        term.history.push(input);
    }
}

function termKeyEvent(e, term, echo) {
    if (e.key == '\x0c') {
        // Ctrl-L -> clear screen
        echo.abortRead("clear");
        echo.print('\x9B2J\x9BH');
    }
}

function autocomplete(index, tokens, term) {
    if (index == 0) return Object.keys(commands);

    switch(tokens[0]) {
        case "help":
        case "man":
        case "whatis":
            return Object.keys(commands);
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
