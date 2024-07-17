const { spawn } = require('child_process');

function sendToPython(args) {
    const pythonExecutable = './main.exe';
    const pythonProcess = spawn(pythonExecutable, args);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
        // Handle output from Python process
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
        // Handle error output from Python process
    });

    return new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            // Handle Python process exit
            resolve();
        });
    })
}

if (typeof window !== 'undefined') {
    window.sendToPython = sendToPython;
}
