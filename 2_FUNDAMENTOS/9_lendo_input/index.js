const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

readline.question("Qual a sua linguagem de programação preferida? ", (language) => {
    if(language === 'C'){
        console.log("Isso nem é linguagem!")
    }
    else{
    console.log(`A minha linguagem preferida é: ${language}`)}

    readline.close()
})