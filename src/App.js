import React,{ useState }  from 'react';
import { useEffect} from 'react';
import { ethers } from 'ethers';
import './App.css';
import MACToken from './contracts/MACToken.json'
import MACaddress from './contracts/MACToken-contract-address.json'


const tokenAddress = MACaddress.MACToken;

function App() {

  ////////////////// HOOKS \\\\\\\\\\\\\\\\\\\\\\\\\\
const [balance, setBalance] = useState(null);
const [userAccount, setUserAccount] = useState();
const [amount, setAmount] = useState();

const [userAccountMintBurn, setUserAccountMintBurn] = useState();
const [userAccountWhite, setUserAccountWhite] = useState();
const [defaultAccount, setDefaultAccount] = useState(null);

const [contract, setContract] = useState(null);
const [tokenSymbol, setTokenSymbol] = useState();

const { ethereum } = window;

////////////// CONNECT WALLET AND SHOW BALANCE\\\\\\\\\\\\\\\\\\\\\

  const connectWallet = async () => {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      accountChangedHandler(accounts[0]); 
      
  };
  async function GetBalance(){
  if (typeof window.ethereum !== 'undefined') {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, MACToken.abi, provider)
    const balance = await contract.balanceOf(account);
   
    let BalDecimals = await contract.decimals();
    let tokenBalance = balance / Math.pow(10, BalDecimals);
     console.log("Balance: ", tokenBalance.toString());
    setBalance(tokenBalance);
  }
}

  const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
    
	}

  const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractT = new ethers.Contract(tokenAddress, MACToken.abi, signer);
    setContract(contractT);
	}

  useEffect(() => {
		if (contract != null) {
    	updateTokenSymbol();
      GetBalance();
		}
	}, [contract]);

  const updateTokenSymbol = async function () {
    let Symbol = await contract.symbol();
    setTokenSymbol(Symbol);
  }

  /////////////////////// TRANSFER \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') { 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, MACToken.abi, signer);
      if(amount >=await contract.balanceOf(signer)) { alert("You nave not enough tokens");}
      const transaction = await contract.transferTo(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
      setAmount(amount);
      
      
      
    }
  }

  /////////////////////////   WHITELIST \\\\\\\\\\\\\\\\\\\\\\\\\\\\
  async function AddWhitelist(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, MACToken.abi, signer);
      const addwhite = await contract.addUser(userAccountWhite);
      await addwhite.wait();
      console.log(`${userAccountWhite} was added to Whitelist`);
    }
  }

  async function VerifyWhitelist(){
    if (typeof window.ethereum !== 'undefined') {  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, MACToken.abi, provider);
      const verifywhite = await contract.verifyUser(userAccountWhite);
      if(verifywhite === true) { document.querySelector(".element").innerHTML = "✔" ; 
      console.log(`${userAccountWhite} is on whitelist`)}
      else {document.querySelector(".element").innerHTML = "❌" ;
      myFunction();
      console.log("You need to be whitelisted");}

    }
  }

  const myFunction = () => {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
 

////////////////////////////////// MINT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  async function mintTokens() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, MACToken.abi, signer);
      if(!await contract.verifyUser(userAccountMintBurn)) { alert("You can not mint tokens");}
      const mintToken = await contract.mint(userAccountMintBurn, amount);
      await mintToken.wait();
      console.log(`${amount} were minted by ${userAccountMintBurn}`);
      setAmount(amount);
      
    }
  }

  ///////////////////////////////// BURN \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  async function burnTokens() {
    if (typeof window.ethereum !== 'undefined') {
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, MACToken.abi, signer);
      if(amount >=await contract.balanceOf(userAccountMintBurn)) { alert("You nave not enough tokens");}
        const burnToken = await contract.burn(userAccountMintBurn, amount);
        await burnToken.wait();
        console.log(`${amount} were burned by ${userAccountMintBurn}`);
        setAmount(amount);
      
     
    }
  }

  return (
    <div>
        <div className='walletCard'>
        <button className='button' onClick={connectWallet}>Connect Wallet</button>
                <div className='r address'>Wallet Address: {defaultAccount}
                <p>Balance: {balance} {tokenSymbol}</p></div>
                
        <div className='input'>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <p><button type='submit' onClick={sendCoins}>Send Tokens</button></p>  
        </div>  
        

        <div>
        <input  onChange={e => setUserAccountWhite(e.target.value)}  placeholder="Add or Verify account" />

        <div onClick={myFunction} className='popup'>
        <span className='element'></span>
        <span className='popuptext' id='myPopup'> You need to be whitelisted</span>
        </div>
        <p><button onClick={AddWhitelist}>Add to Whitelist </button> <button onClick={VerifyWhitelist}>Verify Whitelist </button></p>
        </div>
        
        
        
        <div >
        <input onChange={e => setUserAccountMintBurn(e.target.value)} placeholder="Mint or Burn" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <p><button onClick={mintTokens}>Mint Tokens</button> <button onClick={burnTokens}>Burn Tokens</button></p>
        </div>
        
        </div>
        </div>
      
    
  );
}

export default App;
