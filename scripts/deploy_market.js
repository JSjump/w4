// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");
require("dotenv").config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(ethers.utils.parseUnits("1", 18));
  console.log("fsdf", ethers.utils.parseUnits("1", 18));

  await myToken.deployed(); // We get the contract to deploy
  console.log("myToken:" + myToken.address);

  const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const myTokenMarket = await MyTokenMarket.deploy(
    myToken.address,
    "0xD02f5B3b2D061Eac5189160059e17d40296B1dA3",
    "0x55104754d5b295fc6c7A4C7ee4B89f6a0fc751d3"
  );

  await myTokenMarket.deployed();
  console.log("MyTokenMarket deployed to:", myTokenMarket.address);
  await writeAddr(myTokenMarket.address, "MyTokenMarket", network.name);

  //   初始化provider
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BSC_TEST_URL
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const totalBSC = await myToken.balanceOf(wallet.address);
  console.log("totalBSC", totalBSC);

  await myToken.approve(myTokenMarket.address, ethers.constants.MaxUint256);

  const ethAmount = ethers.utils.parseUnits("0.05", 18);
  console.log("----ethAmount", ethAmount);
  await myTokenMarket.AddLiquidity(ethers.utils.parseUnits("0.1", 18), {
    value: ethAmount,
    // gaslimit: 200000000,
  });
  console.log("添加流动性");

  let b = await myToken.balanceOf(wallet.address);

  console.log("持有token:" + ethers.utils.formatUnits(b, 18));

  const buyEthAmount = ethers.utils.parseUnits("0.01", 18);
  console.log("---buyEthAmount", buyEthAmount);
  const out = await myTokenMarket.buyToken("0", { value: buyEthAmount });
  console.log("-out", out);

  b = await myToken.balanceOf(wallet.address);
  console.log("购买到:" + ethers.utils.formatUnits(b, 18));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
