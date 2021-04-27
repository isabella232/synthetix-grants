const { mainArgs, testArgs } = require("../lib/args");

const Tesla = artifacts.require("Tesla");
//const MockSTSLA = artifacts.require("MockSTSLA");

module.exports = async function (deployer) {
  const args = process.argv;
  const isTestnet = args.join(" ").includes("kovan");

  await deployer.deploy(Tesla, ...(isTestnet ? testArgs : mainArgs));
  //await deployer.deploy(MockSTSLA, "0x53A14CdBCE36F870461Ffc2cB0C9D63b0f4a297a");
};
