let {PythonShell} = require('python-shell');

function scrapeSitePython(){
    let pyshell = new PythonShell('../python-scraper/main.py');

    pyshell.on('message', function(message){
        console.log(message);
    });
    // PythonShell.run('../python-scraper/main.py', null).then(messages=>{
    //     console.log('finished');
    // });
}

document.addEventListener('click', scrapeSitePython);