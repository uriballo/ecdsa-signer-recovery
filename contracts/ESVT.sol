pragma solidity ^0.8.0;

contract ESVT {
  function recoverOwner(bytes32 messageHash, bytes memory signature) public pure returns (address){
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    if (signature.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables
    assembly {
      r := mload(add(signature, 32))
      s := mload(add(signature, 64))
      v := byte(0, mload(add(signature, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      return ecrecover(messageHash, v, r, s);
    }
  }
}