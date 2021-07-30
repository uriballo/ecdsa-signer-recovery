import './App.css';
import React, { useState } from 'react';
import { ethers } from 'ethers'
import ESVT from './artifacts/contracts/ESVT.sol/ESVT.json'

// Contract address (local)
//const esvtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// Rinkeby address
const esvtAddress = "0xb330060C65B462ebC71CDeb8C4E81f5B0394C42B"

function App() {
  const [message, setMessageValue] = useState() // Input message
  const [messageHash, setMessageHash] = useState()
  const [signature, setSignature] = useState()
  const [address, setAddress] = useState()


  // Request access to metamask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function verifySignature() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(esvtAddress, ESVT.abi, provider)

      const address = await contract.recoverOwner(messageHash, signature)
      setAddress(address)
    }
  }

  async function signMessage() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()

      const messageHash = ethers.utils.hashMessage(message)
      setMessageHash(messageHash)

      const signedMSG = await signer.signMessage(message)
      setSignature(signedMSG)
    }
  }

  return (
    <div className="esvt">
      <h1>ESVT</h1>
      <form>
        <h2 className="label-wrapper">
          <label htmlFor="message" className="label__lg">
            ECDSA Signature Verification Tool
          </label>
        </h2>
        <input
          type="text"
          id="message"
          className="input input__lg"
          name="text"
          autoComplete="off"
          onChange={e => setMessageValue(e.target.value)} placeholder="Message"
        />
        <button type='button' className="btn btn__primary btn__lg" onClick={signMessage}>SIGN</button>
        <button type='button' className="btn btn__primary btn__lg" onClick={verifySignature}>VERIFY</button>
        <p>Original Message: {message}</p>
        <p>Message Hash: {messageHash}</p>
        <p>Signature: {signature}</p>
        <p>Address: {address}</p>
        <p>Contract address: {esvtAddress}</p>
      </form>
    </div>
  );
}

export default App;
