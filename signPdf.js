const keyPair = require('./keyPair');
const fs = require('fs')
const pdfParse = require('pdf-parse')
const crypto = require('crypto')


main()

function setSignature(signature){
    signaturePath='./signature.json'
    const signatureJSON = {
        'signature': signature
    }
    fs.writeFileSync(signaturePath,JSON.stringify(signatureJSON,null,4))
}

async function getPdfContent(filePath){
    let pdfExtract
    let readFileSync = fs.readFileSync(filePath)
    try {
      pdfExtract = await pdfParse(readFileSync)
    } catch (error) {
      throw new Error(error)
    }
    return pdfExtract.text
}

async function createSign(filePath,privateKey){
    let fileContent= await getPdfContent(filePath)
    const sign = crypto.createSign('SHA256')
    sign.update(fileContent)
    sign.end()
    const signature = sign.sign(privateKey).toString('hex')
    setSignature(signature)
    console.log('Generated Signature: ',signature)
}

async function main(){
    key = await keyPair.getPrivateKey()
    if (!process.argv[2]){
        createSign('./dummy.pdf',key)
    }
    else{
        createSign(process.argv[2],key)
    }
}