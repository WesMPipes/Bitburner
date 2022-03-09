/** @param {NS} ns **/
export async function main(ns) {
	var host_name = ns.getHostname();

	var security_thresh = ns.getServerMinSecurityLevel(host_name) + 5;
	var money_thresh = ns.getServerMaxMoney(host_name) * 0.80;

	var current_securityLevel = ns.getServerSecurityLevel(host_name);
	var current_money = ns.getServerMoneyAvailable(host_name);

	/*main function*/
	while (true){
		if (current_securityLevel > security_thresh){
			await ns.weaken(host_name);
		}
		if (current_money < money_thresh){
			await ns.grow(host_name);
		}
		await ns.hack(host_name);
	}

}
