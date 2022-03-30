import React, { useState, useEffect } from 'react';
import './App.css';
import cover from "./undraw_ether_re_y7ft.svg"
import Swal from 'sweetalert2'
import close from './close.png'
import { ethers } from "ethers"
import  ContractAbi  from './DragonToken.json';

const CONTRACT_ADDRESS = "0x7C253394db77550A8250F696F381A73194BC2593"

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [displayToken, setDisplayToken] = useState(false);
  const [TokenContract, setTokenContract] = useState('');
  const [tokenData, setTokenData] = useState({});
  const [walletaddress, setAddress] = useState("")
  const [loading, setloading] = useState(false);





  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const Contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi.abi, signer);
      setTokenContract(Contract)
      // setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async (hash) => {
    try {
      const { ethereum } = window;
      if (ethereum) {

        TokenContract.on("Transfer", (from, to, amount) => {
          setloading(false);
          Swal.fire({
        title: 'Funds Transferred',
        html:
          'Hey there! we are minted 1000 Dragon Token to '+`${to}`+'this wallet Address.' +
          `<a href=' https://rinkeby.etherscan.io/tx/${hash}'>rinkeby.etherscan.io</a> ` +
          '',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      })
    })

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTokenDetails = async ()=>{
    console.log(TokenContract)
    if(currentAccount){
      let tokenName = await TokenContract.name();
    let tokenSymbol = await TokenContract.symbol();
    let totalSupply = await TokenContract.totalSupply();
    let suppley = ethers.utils.formatUnits(totalSupply.toString(), 'ether')
    const tokenDetails = {
      name: tokenName,
      symbol: tokenSymbol,
      totalSupple: suppley
    }
    setTokenData(tokenDetails)
    setDisplayToken(true)

    }else{
      Swal.fire('Connect wallet')
    }
    
    

  }

  const send = async ()=>{

    if(currentAccount){
      if(walletaddress==""){
        Swal.fire('Please provide wallet Address')

      }else{
      let mint = await TokenContract.mind(walletaddress);
      await mint.wait()
      setloading(true)
      setupEventListener(mint.hash)
      }

    }else{

      Swal.fire('Connect wallet')
    }
    

  }
 


  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connected
    </button>
  );
  return (
    <div className="App">
      {
        loading ?
          <div className="loading">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          :
          ""}
      

      <div className={displayToken ? "detailes " : "displayNone"}>
        <div className="close">
          <img src={close} alt="" onClick={()=>{setDisplayToken(false)}} />
        </div>
        <div className="ditales-box">
          <table>
            <tr>
              <th>Token Name</th>
              <td>:</td>
              <td>{tokenData.name}</td>
            </tr>
            <tr>
              <th>Symbol</th>
              <td>:</td>
              <td>{tokenData.symbol}</td>
            </tr>
            <tr>
              <th>Total Supply</th>
              <td>:</td>
              <td>{tokenData.totalSupple}</td>
            </tr>
          </table>
        </div>

      </div>
      <div className={displayToken || loading? "container disabledbutton" : "container"}>

        <div className="nav header-container">
          <div className="connect">
            {currentAccount === "" ? (
              renderNotConnectedContainer()
            ) : (
              renderConnectedContainer()
            )}
          </div>
        </div>
        <div className="container">
          <div className="row body">
            <div className="col-md-6 tesboddy ff">
              <div className="box">
                <div className="box-head">
                  <button onClick={fetchTokenDetails} className="cta-button connect-wallet-button">
                    View Token Detiles
                  </button>
                </div>
                <p>You can get 1000 token to the entered address.</p>
                <div className="box-form">
                  <input type="text" placeholder='wallet Address' onChange={e =>{ setAddress(e.target.value)}} />
                  <button onClick={send} className="cta-button connect-wallet-button">
                    Send
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 ff">
              <div className="img">
                <img src={cover} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
