commands = {
    cd: { description: "print file contents" },
    cat: { description: "print file contents" },
    cd: { description: "change the working directory" },
    clear: { description: "clear the terminal screen" },
    clippi: { description: "clerk of learning and information for perpetual purgatorial imprisonment" },
    date: { description: "travel through time" },
    devicelook: { description: "look up devices by ID" },
    dispdrv: { description: "set display driver" },
    falseaudio: { description: "control the audio system or die trying" },
    gde: { description: "start the gelato desktop environment" },
    help: { description: "get some help" },
    history: { description: "return command history" },
    ls: { description: "list directory contents" },
    man: { description: "an interface to the system reference manuals" },
    mkdir: { description: "make directories" },
    pview: { description: "view image files" },
    pwd: { description: "return working directory name" },
    reboot: { description: "reboot the machine" },
    reset: { description: "reset your gelato system to the factory defaults" },
    rm: { description: "remove files or directories" },
    screenfetch: { description: "display system information" },
    shutdown: { description: "shutdown the machine" },
    sndplay: { description: "play audio files" },
    uptime: { description: "tell how long the system has been running" },
    ver: { description: "display gsh version" },
    wget: { description: "download files from the world wide web" },
    whatis: { description: "describe commands" }
};


commands.cd.manual = `
SYNOPSIS
    cd [DIR]
 
DESCRIPTION
    Change the current directory to [DIR].  If omitted, the
    default [DIR] is the user's home directory.
 
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
    man pwd`;

commands.falseaudio.manual = `
SYNOPSIS
    falseaudio [OPTIONS]
 
DESCRIPTION
    FalseAudio is a networked low-latency sound server for
    Gelato 2K38 systems.

OPTIONS
--sos         Show help.

--version     Show version information.

--dump-conf   Load the daemon configuration file daemon.conf
              (see below), parse remaining configuration
              options on the command line and dump the
              resulting daemon configuration, in a format that
              is compatible with daemon.conf.
              
--twerk       Shake your tailfeather.

--start       Start FalseAudio if it is not running yet. This
              is different from starting FalseAudio without
              --start which would fail if PA is already
              running. FalseAudio is guaranteed to be fully
              initialized when this call returns. Implies
              --daemonize.

-k | --kill   Kill an already running FalseAudio daemon of the
              calling user (Equivalent to sending a SIGTERM).

--check       Return 0 as return code when the FalseAudio
              daemon is already running for the calling user,
              or non-zero otherwise. Produces no output on the
              console except for errors to stderr.

--fail[=BOOL] Fail startup when any of the commands specified
              in the startup script default.pa (see below) fails.
              
--log         Show log history of successful/unsuccessful
              installs/uninstalls.

SEE ALSO
    <https://2k38wiki.gelatolabs.xyz/falseaudio>`

commands.ls.manual = `
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
    ipsum`;

commands.mkdir.manual = `
SYNOPSIS
    mkdir [DIR]...
 
DESCRIPTION
    Create the DIRECTORY, if it does not already exist. Its parent directory must already exist.`;

commands.pwd.manual = `
SYNOPSIS
    pwd
 
DESCRIPTION
    Print the full path name of the current working directory.`;

commands.rm.manual = `
SYNOPSIS
    rm [FILE]...
 
DESCRIPTION
    rm removes each specified file or directory.`;


commands.cat.run = function(args, term, echo) {
    for (var i = 0; i < args.length; i++) {
        file = localStorage.getItem(traversePath(term.pwd, args[i]));
        if (file.startsWith(["f", "plain"])) {
            echo.println(file.split(",").slice(2));
        }
    }
}

commands.cd.run = function(args, term, echo) {
    if (args.length == 0) {
        term.pwd = "/home/root";
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
};

commands.clear.run = function(args, term, echo) {
    echo.print('\x9B2J\x9BH');
};

commands.clippi.run = function(args, term, echo) {
    clippi();
};

commands.date.run = function(args, term, echo) {
    if (args.length == 0) {
        echo.println(localStorage.getItem("waybackDate"));
    } else if (/^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(args[0])) {
        localStorage.setItem("waybackDate", args[0]);
        echo.println("Date changed to " + args[0]);
    } else {
        echo.println("date: invalid date. Please format as 'yyyy-mm-dd'.");
    }
}

commands.devicelook.run = function(args, term, echo) {
    if (args.length == 0) {
        echo.println("devicelook: please enter a device ID to lookup");
    }
    else {
        var cardFound;
        for (var i = 0; i < cardID.length; i++) {
            if (args[0] == cardID[i][0]){
                echo.println("Device name found: "+cardID[i][1]);
                cardFound = true;
                break;
            }
        }
        if (!cardFound) {
            echo.println("Unknown device.");
        }
    }
    if (args[0] == "10DE:1D69" && localStorage.getItem("clippiPhase") == 1) {
        localStorage.setItem("clippiPhase", 2);
        clippi();
    }
};

commands.dispdrv.run = function(args, term, echo) {
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

        if (localStorage.getItem(term.pwd + "/sti4xxx.driver") == ["f", "driver"]) {
            availableDrv.push("sti4xxx.driver");
        }

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
};

commands.falseaudio.run = function(args, term, echo) {
    if (args[0] == "-version") {
        echo.println("2.0");
    } else if (args[0] == "-kill") {
        localStorage.setItem("falseaudioKilled", true);
        localStorage.removeItem("falseaudioFixed");
        setVolume(0);
        echo.println("FalseAudio killed.");
    } else if (args[0] == "-start") {
        if (localStorage.getItem("falseaudioKilled")) {
            localStorage.setItem("falseaudioFixed", true);
            setVolume(0.5);
            echo.println("FalseAudio started.");
        } else {
            echo.println("Failed to start FalseAudio.");
        }
    }
};

commands.gde.run = function(args, term, echo) {
    if (args.length == 0) {
        document.location.href = "gde.html";
    } else if (args[0] == "initialize_startmenu") {
        localStorage.setItem("fixedStart", true);
        echo.println("Initializing start menu...\nDone.");
    } else if (args[0] == "enable_extras") {
        document.getElementById("gde-extras-btn").style.display = "block";
        localStorage.setItem("enableExtras", true);
        echo.println("Updating start menu...\nDone.");
    } else if (args[0] == "disable_extras") {
        document.getElementById("gde-extras-btn").style.display = "none";
        localStorage.removeItem("enableExtras");
        echo.println("Updating start menu...\nDone.");
    }
};

commands.help.run = function(args, term, echo) {
    if (args.length == 0) {
        echo.println("Type 'help' followed by a command to learn more about it, e.g. 'help cd'");
        echo.println("");
        for (var i in commands) {
            echo.println(`${i}: ${commands[i].description}`);
        }
    } else if (args[0] in commands) {
        echo.println("NAME\n    " + args[0] + " - " + commands[args[0]].description);

        if ("manual" in commands[args[0]]) {
            echo.println(commands[args[0]].manual);
        } else {
            echo.println("\nBUGS\n    Documentation lacking.");
        }

        echo.println(`\nIMPLEMENTATION
    Gelato gsh, version 5.0.17(1)-release
    Copyright (C) 2021 Gelato Labs
    Distributed under the ISC license`);
    } else {
        echo.println("No manual entry for " + args[0]);
    }
};

commands.history.run = function(args, term, echo) {
    for (var i = 0; i < term.history.length; i++) {
        echo.println(term.history[i]);
    }
};

commands.ls.run = function(args, term, echo) {
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
            echo.println("ls: cannot access '" + paths[i] + "': No such file or directory");
        }
    }
};

commands.man.run = function(args, term, echo) {
    if (args.length == 0) {
        echo.println("What manual page do you want?\nFor example, try 'man man'.");
    } else if (args[0] in commands) {
        echo.println("NAME\n    " + args[0] + " - " + commands[args[0]].description);

        if ("manual" in commands[args[0]]) {
            echo.println(commands[args[0]].manual);
        } else {
            echo.println("\nBUGS\n    Documentation lacking.");
        }
    } else {
        echo.println("No manual entry for " + args[0]);
    }
};

commands.mkdir.run = function(args, term, echo) {
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
};

commands.pview.run = function(args, term, echo) {
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
};

commands.pwd.run = function(args, term, echo) {
    echo.println(term.pwd);
};

commands.reboot.run = function(args, term, echo) {
    document.location.href = "reboot.html";
};

commands.reset.run = function(args, term, echo) {
    localStorage.clear();
    document.location.href = "index.html";
};

commands.rm.run = function(args, term, echo) {
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
};

commands.screenfetch.run = function(args, term, echo) {
    if (localStorage.getItem("clippiPhase") < 2) {
        var GPUname = "[2m10DE:1D69";
    }
    else {
        var GPUname = "[0mChlamydia GooForce STI4090";
    }
    echo.println(`
[0m[1m            #########           [0m[0m[37m [0m[37mroot[0m[1m@[0m[0m[37mgelato[0m[0m
[0m[1m        #################       [0m[0m[37m [0m[37mOS:[0m Gelato System 2K38 [0m[0m
[0m[1m     ####               ####    [0m[0m[37m [0m[37mKernel:[0m gelato 2.4.20-uc0[0m
[0m[1m   ###       #######       ###  [0m[0m[37m [0m[37mUptime:[0m `+uptime()+`[0m[0m
[0m[1m  ###     #############     ### [0m[0m[37m [0m[37mShell:[0m gsh 5.0.17[0m[0m
[0m[1m ###     ###############     ###[0m[0m[37m [0m[37mResolution:[0m `+document.body.clientWidth+`x`+document.body.clientHeight+`[0m[0m
[0m[1m ###     ###############     ###[0m[0m[37m [0m[37mWM:[0m WinBox.js[0m[0m
[0m[1m ###     ###############     ###[0m[0m[37m [0m[37mCSS Theme:[0m 98.css [0m
[0m[1m  ###  ###################  ### [0m[0m[37m [0m[37mTerminal:[0m Xterm.js[0m[0m
[0m[1m   ###  ###  ### ###  ###  ###  [0m[0m[37m [0m[37mFont:[0m Pixelated MS Sans Serif 11[0m[0m
[0m[1m     ####               ####    [0m[0m[37m [0m[37mCPU:[0m RED SUS PT69 revision 1[0m
[0m[1m        #################       [0m[0m[37m [0m[37mGPU: ${GPUname}[0m
[0m[1m            #########          [0m[0m
        `);
    if (localStorage.getItem("clippiPhase") == 0) {
        localStorage.setItem("clippiPhase", 1);
        clippi();
    }
};

commands.shutdown.run = function(args, term, echo) {
    document.location.href = "shutdown.html";
};

commands.sndplay.run = function(args, term, echo) {
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
};

commands.uptime.run = function(args, term, echo) {
    echo.println(uptime());
};

commands.ver.run = function(args, term, echo) {
    echo.println(`gsh -- Gelato SHell
version 5.0.17(1)-release

Running on Gelato kernel 2.4.20-uc0

Copyright (C) 2021 Gelato Labs
Distributed under the ISC license`);
};

commands.wget.run = function(args, term, echo) {
    if (args.length == 0) {
        echo.println("wget: missing URL");
    } else {
        switch(args[0]) {
            case "https://chlamydia.com/downloads/sti4xxx.driver":
                localStorage.setItem(term.pwd + "/sti4xxx.driver", ["f", "driver"]);
                echo.println("'sti4xxx.driver' saved");
                break;

            default:
                echo.println("ERROR 404: Not Found");
                break;
        }
    }
};

commands.whatis.run = function(args, term, echo) {
    if (args.length == 0) {
        echo.println("whatis what?");
    } else {
        for (var i = 0; i < args.length; i++) {
            if (args[i] in commands) {
                echo.println(args[i] + ": " + commands[args[i]].description);
            }
        }
    }
};
