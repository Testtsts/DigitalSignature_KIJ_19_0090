const keyPair = require('./keyPair');
const fs = require('fs')
const pdfParse = require('pdf-parse')
const crypto = require('crypto')
const {signature} = require('./signature.json')


main()


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

async function verifySign(filePath,publicKey,signature){
    let fileContent= await getPdfContent(filePath)
    const verify = crypto.createVerify('SHA256')
    verify.update(fileContent)
    verify.end()
    const result = verify.verify(publicKey,Buffer.from(signature,'hex'))
    console.log('Verification result: ',result)
}

function main(){
    key = keyPair.getPublickKey()
    console.log(signature)
    if (!process.argv[2]){
        verifySign('./dummy.pdf',key,signature)
    }
    else{
        verifySign(process.argv[2],key,signature)
    }
}