const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const keyPairPath = "./keyPair.json"
const keyPairJSON = require(keyPairPath);

function setKeyPair(privateKey,publicKey){
    keyPairJSON.privateKey = privateKey
    keyPairJSON.publicKey = publicKey
    fs.writeFileSync(keyPairPath,JSON.stringify(keyPairJSON,null,4))
}

function generateKeyPair(){
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 530,    // options
        publicExponent: 0x10101,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der',
            cipher: 'aes-192-cbc',
            passphrase: 'somePassPhrase'
        }
      });
    
    // Prints asymmetric key pair
    // console.log("The public key is: ", publicKey);
    var publicKeyString = publicKey.toString('hex');
    var privateKeyString = privateKey.toString('hex');
    setKeyPair(privateKeyString,publicKeyString)
}

function getPublickKey(){
    if(keyPairJSON.publicKey){
        return keyPairJSON.publicKey
    }
    generateKeyPair()
    return keyPairJSON.publicKey
}

function getPrivateKey(){
    if(keyPairJSON.privateKey){
        return keyPairJSON.privateKey
    }
    generateKeyPair()
    return keyPairJSON.privateKey
}

module.exports ={
    getPrivateKey,
    getPublickKey
}