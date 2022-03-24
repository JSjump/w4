// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");
require("dotenv").config();

async function main() {
  //   初始化provider
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ganache_url
  );

  const wallet = new ethers.Wallet(process.env.ganache_pk, provider);

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(ethers.utils.parseUnits("1", 18));
  console.log("fsdf", ethers.utils.parseUnits("1", 18));

  await myToken.deployed(); // We get the contract to deploy
  console.log("myToken:" + myToken.address);

  const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const myTokenMarket = await MyTokenMarket.deploy(
    myToken.address,
    "0x2de5F6b681d262aBdD4F4cF50E69Ed41749df1d6",
    "0x7D0690Da02EBB5938A6F6B2BD079B063Cfc6680D"
  );

  // 发布masterCHef
  // We get the contract to deploy
  // const MasterChef = await ethers.getContractFactory("MasterChef");
  // const masterChef = await MasterChef.deploy(
  //   "0x30af936FEBCB88Ce642e3bC0502a7fBb26FCB857",
  //   wallet.address,
  //   ethers?.utils?.parseUnits("1000", 18),
  //   10000,
  //   42
  // );

  // await masterChef.deployed();

  // console.log("masterChef deployed to:", masterChef.address);
  // await writeAddr(masterChef.address, "MasterChef", network.name);

  await myTokenMarket.deployed();
  console.log("MyTokenMarket deployed to:", myTokenMarket.address);
  await writeAddr(myTokenMarket.address, "MyTokenMarket", network.name);

  const totalBSC = await myToken.balanceOf(wallet.address);
  console.log("totalBSC", totalBSC);

  await myToken.approve(myTokenMarket.address, ethers.constants.MaxUint256);

  const ethAmount = ethers.utils.parseUnits("0.05", 18);

  // masterChef新增池子
  // await masterChef.add(1,);

  console.log("----ethAmount", ethAmount);
  await myTokenMarket.AddLiquidity(ethers.utils.parseUnits("0.1", 18), {
    value: ethAmount,
    // gaslimit: 200000000,
  });
  console.log("添加流动性");

  let b = await myToken.balanceOf(wallet.address);
  console.log("wallet.address", wallet.address);

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
