const crypto = require('crypto');
const fs = require('fs');
const keyPairPath = "./keyPair.json"
const keyPairJSON = require(keyPairPath);

function setKeyPair(privateKey,publicKey){
    keyPairJSON.privateKey = privateKey
    keyPairJSON.publicKey = publicKey
    fs.writeFileSync(keyPairPath,JSON.stringify(keyPairJSON,null,4))
}

function generateKeyPair(){
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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
    return { publicKey, privateKey } 
}

function getPublickKey(depth=1){
    if (depth >3 ){
        throw new Error('infinite loop')
    }
    if(keyPairJSON.publicKey){
        const publicKey = crypto.createPublicKey({
            key: Buffer.from(keyPairJSON.publicKey,'hex'),
            type: 'pkcs1',
            format: 'der'
        })
        return publicKey
    }
    generateKeyPair()
    depth++
    getPublickKey(depth)
}

function getPrivateKey(depth=1){
    if (depth >3 ){
        throw new Error('infinite loop')
    }
    if(keyPairJSON.privateKey){
        // return keyPairJSON.privateKey
        const privateKey = crypto.createPrivateKey({
            key: Buffer.from(keyPairJSON.privateKey,'hex'),
            type: 'pkcs8',
            format: 'der',
            cipher: 'aes-192-cbc',
            passphrase: 'somePassPhrase'
        })

        return privateKey
    }
    generateKeyPair()
    depth++
    return getPrivateKey(depth)
}


module.exports ={
    getPrivateKey,
    getPublickKey
}