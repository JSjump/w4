//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IUniswapV2Router02.sol";
// import "./interfaces/IMasterChef.sol";
import "./MasterChef.sol";
import "./MyToken.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public weth;

    address public sushiChef;

    constructor(
        address _token,
     address _router,
      address _weth,
      address _sushiChef
      ) {
        myToken = _token;
        router = _router;
        weth = _weth;
        sushiChef= _sushiChef;
    }

    // 添加流动性
    function AddLiquidity(uint tokenAmount) public payable {
        IERC20(myToken).safeTransferFrom(msg.sender, address(this),tokenAmount);
        IERC20(myToken).safeApprove(router, tokenAmount);

        // ingnore slippage
        // (uint amountToken, uint amountETH, uint liquidity) = 
       ( ,,uint liquidityAmount) =  IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(myToken, tokenAmount, 0, 0, msg.sender, block.timestamp);

        //TODO: handle left
        // MasterChef(sushiChef).deposit(_pid, liquidityAmount);

    }

    // 用 ETH 购买 Token
    function buyToken(uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;

        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, msg.sender, block.timestamp);


       // 购买到的myToken 直接质押挖矿。 以下为步骤

        uint256 amount = MyToken(myToken).balanceOf(address(this));

        // 授权
        IERC20(myToken).approve(address(this), amount);

        // pid 通过外部调用 MasterChef 的 add 方法 来添加pool信息
        MasterChef(sushiChef).deposit(1,amount);

    }


}