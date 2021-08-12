import './App.css';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ethers } from 'ethers'
import ESVT from './artifacts/contracts/ESVT.sol/ESVT.json'
import '@fontsource/roboto'
import { Tooltip } from '@material-ui/core';


// Contract address (local)
//const esvtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// GWEI cost 0.000028245
// Rinkeby address
const esvtAddress = "0xb330060C65B462ebC71CDeb8C4E81f5B0394C42B"

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
      maxWidth:500,
    },
  },
  customWidth: {
    maxWidth: 500,
  },
  fontSize: {
    fontSize: 15
  }
}));

function App() {
  const classes = useStyles();
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

  const copyToClipboard = async (clipboardText) =>{
    await navigator.clipboard.writeText(clipboardText)
  }

  return (
    <div className="esvt">
      <Typography variant="h1" component="h2" gutterBottom>
        ESVT
      </Typography>
      <form>
        <h2 className="label-wrapper">
          <label htmlFor="message" className="label__lg">
            ECDSA Signature Verification Tool
          </label>
        </h2>
        <TextField id="outlined-basic" label="Message" variant="outlined" onChange={e => setMessageValue(e.target.value)} fullWidth/>
        <div>&nbsp; </div>
        <Button variant="contained" type='button' className="btn btn__primary btn__lg" onClick={signMessage}>SIGN</Button>
        <Button variant="contained" type='button' className="btn btn__primary btn__lg" onClick={verifySignature}>VERIFY</Button>
        <div>&nbsp; </div>
        <Typography variant="h4" gutterBottom>
          Original Message:
        </Typography>
        <Tooltip title={'Click to copy!'} onClick={() => { navigator.clipboard.writeText(message) }} classes={{ tooltip: classes.fontSize }}>
          < Typography noWrap variant = "h5" gutterBottom >
            {message}
          </Typography>
        </Tooltip>
        <div>&nbsp; </div>
        <Typography variant="h4" gutterBottom>
          Message Hash:
        </Typography>
        <Tooltip title={'Click to copy!'} onClick={() => {copyToClipboard(messageHash)}} classes={{ tooltip: classes.fontSize }}>
          <Typography noWrap variant="h5" gutterBottom>
            {messageHash}
          </Typography>
        </Tooltip>
        <div>&nbsp; </div>
        <Typography variant="h4" gutterBottom>
          Signature:
        </Typography>
        <Tooltip title={'Click to copy!'} onClick={() => {copyToClipboard(signature)}} classes={{ tooltip: classes.fontSize }}>
          <Typography noWrap variant="h5" gutterBottom>
            {signature}
          </Typography>
        </Tooltip>
        <div>&nbsp; </div>
        <Typography variant="h4" gutterBottom>
          Signer Address:
        </Typography>
        <Tooltip title={'Click to copy!'} onClick={() => {copyToClipboard(address)}} classes={{ tooltip: classes.fontSize }}>
          <Typography noWrap variant="h5" gutterBottom>
            {address}
          </Typography>
        </Tooltip>
        <div>&nbsp; </div>
        <Typography variant="h4" gutterBottom>
          Contract Address:
        </Typography>
        <Tooltip title={'Click to copy!'} onClick={() => {copyToClipboard(esvtAddress)}} classes={{ tooltip: classes.fontSize }}>
          <Typography noWrap variant="h5" gutterBottom>
            {esvtAddress}
          </Typography>
        </Tooltip>
      </form>
    </div>
  );
}

export default App;
