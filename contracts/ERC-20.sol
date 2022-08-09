// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC-20.sol";

contract ERC20 is IERC20{
    address public owner;
    uint totalTokens;
    string _name;
    string _symbol;
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;
    mapping(address => bool) public whitelistedAddresses;
    string ned = "ret";

    modifier OnlyOwner() {
        require(msg.sender == owner, "You're not a owner");
    _;
    }

    modifier EnoughTokens(address _from, uint _amount){
        require(balanceOf(_from) >= _amount,"You have not enough tokens");
        require(msg.sender != address(0), "Not permited");
        _;
    }
    //
    // Whitelisting 
    //
      modifier isWhitelisted(address _address) {
  require(whitelistedAddresses[_address], "You need to be whitelisted");
  _;
    }

    function addUser(address _addressToWhitelist) public OnlyOwner {
    whitelistedAddresses[_addressToWhitelist] = true;
    }

    function verifyUser(address _whitelistedAddress) public view returns(bool) {
    bool userIsWhitelisted = whitelistedAddresses[_whitelistedAddress];
    return userIsWhitelisted;
    }

    function removeUser(address _whitelistedAddress) public OnlyOwner {
    require(whitelistedAddresses[_whitelistedAddress], "Previous not in whitelist");
    whitelistedAddresses[_whitelistedAddress] = false;
  }
  
   // basic function with name, symbol, etc.

    function name() external view override returns(string memory){
        return _name;
    }

    function symbol() external view override returns(string memory){
        return _symbol;
    }

    function decimals() external pure override returns(uint){
        return 18;
    }

    function totalSuply() external view override returns(uint){
        return totalTokens; 
    }

  constructor(string memory name_, string memory symbol_ ){
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        whitelistedAddresses[owner]= true;
        

    }

    function balanceOf(address account) public view override returns(uint){
        return balances[account];
    }

    function transferTo(address to, uint amount) public override EnoughTokens(msg.sender, amount) {
        _beforeTokenTransfer(msg.sender, to, amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        _afterTokenTransfer(msg.sender, to, amount);
    }

    function approve(address spender, uint amount) public override {
        _approve(msg.sender, spender, amount);
    }

    function _approve(address sender, address spender, uint amount) internal virtual{
        allowances[sender][spender] = amount;
        emit Approve(sender, spender, amount);
    }

    function allowance(address _owner, address spender) public view override returns(uint){
        return allowances[_owner][spender];
    }

    function transferFrom(address sender, address recipient, uint amount) public override EnoughTokens(sender, amount){
        _beforeTokenTransfer(sender, recipient, amount);
        balances[sender] -= amount;
        allowances[sender][recipient] -= amount;
        balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        _afterTokenTransfer(sender, recipient, amount);
    }

    function mint(address account, uint amount) public virtual isWhitelisted(account){
        _beforeTokenTransfer(address(0), account, amount);
        totalTokens += amount;
        balances[account] +=amount;
        emit Transfer(address(0),account, amount);
        _afterTokenTransfer(address(0), account, amount);
    }

    function burn(address _from, uint amount) public virtual isWhitelisted(_from) EnoughTokens(_from, amount){
       _beforeTokenTransfer(_from, address(0), amount);
        balances[_from] -= amount;
        totalTokens -= amount;
        emit Transfer(_from, address(0), amount);
        _afterTokenTransfer(_from, address(0), amount);
    }

    function _beforeTokenTransfer(address from, address to, uint amount) internal virtual{}

    function _afterTokenTransfer(address from, address to, uint amount) internal virtual{}


}
