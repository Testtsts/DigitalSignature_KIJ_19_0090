const keyPair = require('./keyPair');
const fs = require('fs')
const pdfParse = require('pdf-parse')
const crypto = require('crypto')


main()

function setSignature(signature){
    const signaturePath = './signature.txt'
    fs.writeFileSync(signaturePath,signature)
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
    console.log(fileContent,signature)
}

function main(){
    key = keyPair.getPrivateKey()
    if (!process.argv[2]){
        createSign('./dummy.pdf',key)
    }
    else{
        createSign(process.argv[2],key)
    }
}