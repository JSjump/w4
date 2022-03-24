// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //   初始化provider
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ganache_url
  );

  const wallet = new ethers.Wallet(process.env.ganache_pk, provider);

  // We get the contract to deploy
  const MasterChef = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChef.deploy(
    "0x30af936FEBCB88Ce642e3bC0502a7fBb26FCB857",
    wallet.address,
    ethers?.utils?.parseUnits("1000", 18),
    10000,
    42
  );

  await masterChef.deployed();

  console.log("masterChef deployed to:", masterChef.address);
  await writeAddr(masterChef.address, "MasterChef", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
