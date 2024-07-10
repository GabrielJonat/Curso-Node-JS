const fs = require('fs')

if(!fs.existsSync('./minhapasta')){

    console.log('Não existia!')

    fs.mkdirSync('./minhapasta')

    console.log('Agora passou a existir!')

}
else{

        console.log('Existe!')

}