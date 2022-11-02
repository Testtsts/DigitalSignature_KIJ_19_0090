const keyPair = require('./keyPair');
const fs = require('fs')
const pdfParse = require('pdf-parse')

main()

async function createSign(filePath,privateKey){
    let readFileSync = fs.readFileSync(filePath)
    try {
        let pdfExtract = await pdfParse(readFileSync)
    }
    catch (err){
        throw new Error(err)
    }
}

function main(){
    key = keyPair.getPrivateKey()
    if (!process.argv[2]){
        createSign('./test.pdf',key)
    }
    else{
        createSign(process.argv[2],key)
    }
}