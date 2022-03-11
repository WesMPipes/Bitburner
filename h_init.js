/** @param {NS} ns **/
export async function main(ns) {
  if (ns.getHostname() !== "home") {
    throw new Exception("Run the script from home");
  }

  await ns.wget(
    `https://github.com/WesMPipes/Bitburner/raw/main/start.js?ts=${new Date().getTime()}`,
    "start.js"
  );
  ns.spawn("start.js", 1);
}
