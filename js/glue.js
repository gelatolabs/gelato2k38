<<<<<<< HEAD
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
        if (inputString.length > 0) {
            term.write('\b\x1b[1;P');
            inputString = inputString.slice(0,inputString.length - 1);
        }
        else {term.write('\x07');}
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
    else{
        term.write("Unrecognized Command. If you are lost, type 'help'")
    }
}
=======
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
>>>>>>> 3bdcad862b173e4339d068c5e91bfb2241aa42f7
