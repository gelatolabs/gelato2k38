function spawnTerm() {
    const term = new Terminal();
    const termFit = new FitAddon.FitAddon();
    term.loadAddon(termFit);

    var termWin = new WinBox({
        title: 'GelatoTerm',
        width: '400',
        height: '300',
        html: '<div class="term"></div>'
    });

    term.open(termWin.body.firstChild);
    termFit.fit();
    term.write("$ ");
    var inputString = "";
    term.onKey(e => {termKeyEvent(e)});
}

function spawnBrowser() {
    var browserWin = new WinBox({
        title: 'Mozzarella',
        width: '600',
        height: '400',
        html: `<div class="browser">
                   <form>
                       <button class="home" type="button" onclick="return browserHome(this)">Home</button><input type="text" placeholder="Enter a URL"><button class="go" onclick="return browserNav(this)">Go</button>
                   </form>
                   <iframe sandbox="allow-forms allow-scripts allow-same-origin" src="https://www.google.com/webhp?igu=1"></iframe>
               </div>`
    });
}

function browserNav(browser) {
    url = browser.previousSibling.value;
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }
    browser.parentElement.nextSibling.nextSibling.src = url;
    browser.previousSibling.value = '';
    return false; // don't submit form
}
function browserHome(browser) {
    browser.parentElement.nextSibling.nextSibling.src = 'https://www.google.com/webhp?igu=1';
    return false;
}
