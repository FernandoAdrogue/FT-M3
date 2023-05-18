const process = require('process');
const { Z_ASCII } = require('zlib');
const commands = require('./commands/index.js');

function bash() {
   process.stdout.write('prompt > ')
   process.stdin.on("data",(data)=>{
      const param = String(data).split(" ")
      let args = param.slice(1).join(" ").replace(/(\r\n|\n|\r)/gm,"")
      let cmd = param[0].trim()
      Object.keys(commands).includes(cmd) ?
         commands[cmd](print, args) :
         print(`command not found: ${cmd}`)
   })
}

const print = (output)=>{
   process.stdout.write(output)
   process.stdout.write('\nprompt > ')
} 

bash();
module.exports = {
   print,
   bash,
};
