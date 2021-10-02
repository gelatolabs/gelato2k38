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