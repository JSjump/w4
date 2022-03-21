W4_1作业
* 部署自己的 ERC20 合约 MyToken
* 编写合约 MyTokenMarket 实现：
   * AddLiquidity():函数内部调用 UniswapV2Router 添加 MyToken 与 ETH 的流动性
   * buyToken()：用户可调用该函数实现购买 MyToken

W4_2作业
* 在上一次作业的基础上：
   * 完成代币兑换后，直接质押 MasterChef
   * withdraw():从 MasterChef 提取 Token 方法


W4_1作业答案：
基于bsc测试网
================================================================
测试网 个人部署的uniswap 相关信息
1.UniswapV2Factory address:   0x8102AAe33B0d91b9c1DCee50Da955421484d35BE
2.UniswapV2Factory code hash:  0xaae7dc513491fb17b541bd4a9953285ddf2bb20a773374baecc88c4ebada0767
3.WETH address:  0x55104754d5b295fc6c7A4C7ee4B89f6a0fc751d3
4.Router address:  0xD02f5B3b2D061Eac5189160059e17d40296B1dA3
5.myTokenMarket address:0x7079ec0c20D2EE9dba70C27B3925aF46c20B2D76

<!-- bsc测试网添加流动性未成功，ganache本地开发成功，具体原因待查明 -->
![metamask](https://github.com/JSjump/w4/blob/master/imgs/1.png?raw=true)

<!-- 4-2作业未开发---周一搞 -->
