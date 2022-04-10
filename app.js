#!/usr/bin/env node
//1) add the above 
//2) then run: chmod +x app.js
//3) and generate package.json: npm init -y
//4) add bin section to package.json to create the command 
/* "bin": {
    "watchit": "app.js" 
} */
//5) run: npm link

//use chokidar package to check and re-run our files
//use caporal to create cl help section 

const chokidar = require('chokidar'); //must install packagage above first
const debounce = require('lodash.debounce');
const program = require('caporal');
const { access } = require('fs/promises');
const { spawn } = require('child_process');
const chalk = require('chalk');

program
    .version('1.0.0')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename })=> {
        const name = filename || 'app.js';
        try {
        await access(name);
        } catch (err) {
            throw new Error(`Could not find the file ${name}`)
        }
        let proc;
        const start = debounce(() => {
            if (proc) {
                proc.kill();
            }
            console.log(chalk.red('>>> Starting process...'));
            proc = spawn('node', [name], {stdio: 'inherit'});
        }, 100);
        
        chokidar.watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);        
    });

program.parse(process.argv);
