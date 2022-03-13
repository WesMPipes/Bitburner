/** @param {NS} ns **/

let servers = [];

export async function main (ns){
  var current_host = ns.getHostname();
  var myHLvl = ns.getHackingLevel();
  var posPorts = 0

  while (true){
    if (ns.fileExists("BruteSSH.exe", "home")) posPorts = 1;
    if (ns.fileExists("FTPCrack.exe", "home")) posPorts = 2;
    if (ns.fileExists("relaySMTP.exe", "home")) posPorts = 3;
    if (ns.fileExists("HTTPWorm.exe", "home")) posPorts = 4;
    if (ns.fileExists("SQLInject.exe", "home")) posPorts = 5;

	myHLvl = ns.getHackingLevel();

	await deep_search(current_host, ns);

    for (let i=0; i < servers.length; i++){
      var target = servers[i];
		  var tgt_isRoot = ns.hasRootAccess(target);
		  var tgt_portsReq = ns.getServerNumPortsRequired(target);
		  var tgt_hlReq = ns.getServerRequiredHackingLevel(target);

		  if (tgt_isRoot || !(myHLvl >= tgt_hlReq) || !(tgt_portsReq <= posPorts)){
			  servers = await remove_from_list(servers, target);
			  i--;
		  }
    }

    if (servers.length === 0){
      ns.tprint(`[${localeHHMMSS()}] Aktuell keine weiteren möglichen Ziele.`);
    }
	else{
		ns.tprint(`[${localeHHMMSS()}] server`)

		for (let i = 0; i < servers.length; i++) {
		var nodename = servers[i];
		ns.tprint(`[${localeHHMMSS()}] servernode: ${nodename}`)
		await take_node(nodename, ns);
		await send_CC(nodename, ns);
		await activate_CC(nodename, ns);
	}

	}

	await ns.sleep(60000);

  }
}

function localeHHMMSS(ms = 0){
  if (!ms){
    ms = new Date().getTime()
  }
  
  return new Date(ms).toLocaleTimeString()
}


async function deep_search(node, ns) {

	if (!servers.includes(node)){
		servers.push(node);

		var current_servers = ns.scan(node);
		for (var server of current_servers) {
			deep_search(server, ns);
		}
	}

}

async function remove_from_list(list, name){
	var my_index = list.indexOf(name)
	if (my_index !== -1){
		list.splice(my_index, 1);
	}

	return list;
}

async function take_node(server, ns) {
	//ns.tprint(`${server}`)
	var myHLvl = ns.getHackingLevel();
	var regHLvl = ns.getServerRequiredHackingLevel(server);
	var num_req_ports = ns.getServerNumPortsRequired(server);
	var tool_list = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
	var num_pos_ports = 0;
	var tools_avail_list = [];

	for (let i = 0; i < tool_list.length; i++) {
		if (ns.fileExists(tool_list[i], "home")) num_pos_ports++;
	}
	// ns.tprint(`${num_req_ports} Ports müssen auf ${server} geöffnet werden.`);
	// ns.tprint(`Anzahl vorhandener Tools: ${num_pos_ports}\n\n`)
	if (myHLvl >= regHLvl && num_req_ports <= num_pos_ports && !(ns.hasRootAccess(server))) {

		ns.tprint(`[${localeHHMMSS()}] Hacking ${server}.....\n`)

		if (num_req_ports == 0) {
			await ns.nuke(server);
		}
		else if (num_req_ports == 1) {
			ns.tprint(`Bruteforcing Port 22....`);
			await ns.brutessh(server);
			await ns.sleep(2);
			await ns.nuke(server);
		}
		else if (num_req_ports == 2) {
			await ns.tprint(`Bruteforcing Port 22....`);
			await ns.brutessh(server);
			await ns.sleep(2);
			await ns.tprint(`Cracking Port 21....`);
			await ns.ftpcrack(server);
			await ns.sleep(2);
			await ns.nuke(server);
		}
		else if (num_req_ports == 3) {
			await ns.tprint(`Bruteforcing Port 22....`);
			await ns.brutessh(server);
			await ns.sleep(2);
			await ns.tprint(`Cracking Port 21....`);
			await ns.ftpcrack(server);
			await ns.sleep(2);
			await ns.tprint(`Relaying Port 25....`);
			await ns.relaysmtp(server);
			await ns.sleep(2);
			await ns.nuke(server);
		}
		else if (num_req_ports == 4) {
			await ns.tprint(`Bruteforcing Port 22....`);
			await ns.brutessh(server);
			await ns.sleep(2);
			await ns.tprint(`Cracking Port 21....`);
			await ns.ftpcrack(server);
			await ns.sleep(2);
			await ns.tprint(`Relaying Port 25....`);
			await ns.relaysmtp(server);
			await ns.sleep(2);
			await ns.tprint(`Worming Port 80....`);
			await ns.httpworm(server);
			await ns.sleep(2);
			await ns.nuke(server);
		}
		else if (num_req_ports == 5) {
			await ns.tprint(`Bruteforcing Port 22....`);
			await ns.brutessh(server);
			await ns.sleep(2);
			await ns.tprint(`Cracking Port 21....`);
			await ns.ftpcrack(server);
			await ns.sleep(2);
			await ns.tprint(`Relaying Port 25....`);
			await ns.relaysmtp(server);
			await ns.sleep(2);
			await ns.tprint(`Worming Port 80....`);
			await ns.httpworm(server);
			await ns.sleep(2);
			await ns.tprint(`Injecting Port 156....`);
			await ns.sqlinject(server);
			await ns.sleep(2);
			await ns.nuke(server);
		}

		await ns.sleep(2);

		if (!(ns.hasRootAccess(server))) {
			ns.tprint(`[${localeHHMMSS()}] ERROR while hacking ${server}`);
		}
	}
}

async function send_CC(server, ns) {

	var cashCrasher = ' ';

	if (ns.hasRootAccess('phantasy')){

		cashCrasher = 'tkPhantasy.script';
	}
	else if (ns.hasRootAccess('joesguns')){
		cashCrasher = 'tkJoe.script';

	}
	else {
		cashCrasher = 'cashCrasher.js'
	}



	//var cashCrasher = 'cashCrasher.js';
	if (!ns.fileExists(cashCrasher, server)) {
		await ns.scp(cashCrasher, 'home', server);
		await ns.sleep(2);
	}

	ns.tprint(`[${localeHHMMSS()}] Payload sent to ${server}`);
}

async function activate_CC(server, ns) {
	var cashCrasher = ' ';

	if (ns.hasRootAccess('phantasy')){

		cashCrasher = 'tkPhantasy.script';
	}
	else if (ns.hasRootAccess('joesguns')){
		cashCrasher = 'tkJoe.script';

	}
	else {
		cashCrasher = 'cashCrasher.js'
	}

	var currentRAMAmmount = ns.getScriptRam(cashCrasher);
	var host_max_ram = ns.getServerMaxRam(server);
	var posThreads = host_max_ram / currentRAMAmmount>>0;
	ns.tprint(`[${localeHHMMSS()}] Possible Threads for ${server}: ${posThreads}`);

	if (posThreads === 0){
		ns.tprint(`[${localeHHMMSS()}] ${server} hat nicht genügend RAM`)
		// continue (`${server} hat nicht genügend RAM`)
	}
	else{
		await ns.exec(cashCrasher, server, posThreads);
		await ns.sleep(1);

		ns.tprint(`[${localeHHMMSS()}] ${server}: CASH CRASHER ACTIVATED`);
	}
}
