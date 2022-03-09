const baseURL = 'https://github.com/WesMPipes/Bitburner/tree/main/'
const filesToDownload = [cashCrasher.js, sheerHeartAttack.js]

function localeHHMMSS(ms = 0){
  if (!ms){
    ms = new Date().getTime()
  }
  
  return new Date(ms).toLocaleTimeString()
}

