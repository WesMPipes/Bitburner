const baseURL = 'https://github.com/WesMPipes/Bitburner/tree/main/'
const filesToDownload = [cashCrasher.js, sheerHeartAttack.js]

function localeHHMMSS(ms = 0){
  if (!ms){
    ms = new Date().getTime()
  }
  
  return new Date(ms).toLocaleTimeString()
}

export async function main(){
  ns.tprint (`[${localeHHMMSS()}] Starting start.js`)
  
  let hostname = ns.getHostname()
  
  if (hostname !== 'home'){
    throw new Exception('Run this script from home')
  }
  
  for (let i = 0; i < filesToDownload.length; i++){
    const filename = filesToDownload[i]
    const path = baseURL + filename
    await ns.scriptKill(filename, 'home')
    await ns.remove(filename)
    await ns.sleep(200)
    ns.tprint (`[${localeHHMMSS()}] trying to download ${path}`)
    await ns.wget(path + '?ts=' + new Date().getTime(), filename)
  }
  
  ns.tprint (`[${localeHHMMSS()}] spawning sheerHeartAttack.js`)
  ns.spawn('sheerHeartAttack.js', 1)
  
}
