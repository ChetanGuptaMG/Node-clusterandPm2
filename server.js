const express = require('express');
const cluster = require('cluster');
const os = require('os');

const app = express(); 

function doWork(duration) {
    const start = Date.now();
    while(Date.now() - start < duration) {}
}

app.get('/slow', (req, res) => {
    doWork(5000);
    res.send(`This was slow!${process.pid}`);
});

app.get('/', (req, res) => {
    res.send(`This was fast!${process.pid}`);
});

if (cluster.isMaster) {
    const cpus = os.cpus().length;
    console.log(`Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
} else {
    console.log('Child is running');
    app.listen(2000);
}