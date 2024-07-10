import inquirer from 'inquirer'

import chalk from 'chalk'

import fs from 'fs'

console.log(chalk.green('Bem Vindo ao Pobre Bank, o banco em que o pobre tem vez!'))

function operation(){
    
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Operações:',
        choices: [
            'Criar Conta',
            'Depositar',
            'Sacar',
            'Consultar Saldo',
            'Sair'
        ],
    },
    ]).then((answear) => {

        const action = answear['action']

        switch(action){

            case 'Criar Conta':

                                    createAccount()
                                    break

            case 'Depositar':

                                    deposit()
                                    break

            case 'Sacar':

                                    withdraw()
                                    break

            case 'Consultar Saldo':

                                    searchBalance()
                                    break

            case 'Sair':

                                    console.log(chalk.bgBlue('Obrigado por usar o Pobre Bank!'))
                                    process.exit()

        }

    }).catch((err) => console.log(err))
}

function createAccount(){

    console.log(chalk.bgGreen.bold('Parabéns pobre, por escolher o Pobre Bank!'))
    console.log(chalk.blue('Defina as opções de sua conta a seguir:'))

    buildAccount()

}

function buildAccount(){

    inquirer.prompt([{

        name: 'accountName',
        message: 'Digite o nome do titular da conta: '

    }]).then((answear) => {

        const name = answear['accountName']

        console.info(name)

        if(!fs.existsSync('accounts')){

            fs.mkdirSync('accounts')

        }

        if(fs.existsSync(`accounts/${name}.json`)){

            errorMessage('ambiguity')

            buildAccount()

            return
        }

        fs.writeFileSync(`accounts/${name}.json`,'{"balance": 0}', function (err){ console.log(err)})

        console.log(chalk.green('Sua conta foi criado com sucesso!'))

    }).catch((err) => console.log(err))

}

function errorMessage(errorType){

    switch(errorType){

        case 'ambiguity':

            console.log(chalk.bgRed.black('Esta conta já existe, por favor escolha outo nome'))
            break

        case 'undefined':

        console.log(chalk.bgRed.black('Esta conta não existe, por favor escolha outo nome'))
        break

        case 'depositError':

        console.log(chalk.bgRed.black('Não é possível depositar um valor nulo ou negativo, por favor digite outro valor'))
        break

        case 'withdrawError':

        console.log(chalk.bgRed.black('Não é possível sacar um valor superior ao saldo da conta'))
        break

    }
}
function accountExists(accountName){

    if(!fs.existsSync(`accounts/${accountName}.json`)){

        errorMessage('undefined')

        return false
        
    }

    return true
}

function deposit(){

    inquirer.prompt([{

        name: 'accountName',
       message: 'Digite o nome de sua conta: ' 
    }]).then((answear) => {

        const name = answear['accountName']

        if(!accountExists(name)){

            return deposit()
        }

        inquirer.prompt([{

                name: 'ammount',
                message: 'Digite o valor do deposito: '
        }]).then((answear) => {

            const amount = answear['ammount']

            addAmmount(amount, name)

            operation()

        }).catch((err) => {console.log(err)})

    }).catch((err) => {console.log(err)})

}

function addAmmount(amount, accountName){

    if(parseFloat(amount) <= 0){

        errorMessage('depositError')
        return
    }
    
    const account = getAccount(accountName)

    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), function (err) {console.log(err)})

    console.log(chalk.green('Valor depositado com sucesso!'))

    return account
}

function searchBalance(){

    inquirer.prompt([{

        name: 'accountName',
       message: 'Digite o nome de sua conta: ' 
    }]).then((answear) => {

        const name = answear['accountName']

        if(!accountExists(name)){

            return searchBalance()}

        console.log(`Seu saldo é de R$${getBalance(name)}`)

        operation()

        }).catch((err) => {console.log(err)})

}

function getBalance(accountName){

    const account = getAccount(accountName)
    return account.balance

}

function getAccount(accountName){

    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r'})

    return JSON.parse(accountJSON)

}

function withdraw(){

    inquirer.prompt([{

        name: 'accountName',
       message: 'Digite o nome de sua conta: ' 
    }]).then((answear) => {

        const name = answear['accountName']

        if(!accountExists(name)){

            return withdraw()
        }

        inquirer.prompt([{

                name: 'ammount',
                message: 'Digite o valor do saque: '
        }]).then((answear) => {

            const amount = answear['ammount']

            subtractAmmount(amount, name)

            operation()

        }).catch((err) => {console.log(err)})

    }).catch((err) => {console.log(err)})

}

function subtractAmmount(amount,accountName){

    const account = getAccount(accountName)

    
    if(parseFloat(amount) > parseFloat(account.balance)){

        errorMessage('withdrawError')
        return
    }
    
    account.balance = Math.abs(parseFloat(amount) - parseFloat(account.balance))

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), function (err) {console.log(err)})

    console.log(chalk.green('Saque realizado com sucesso!'))

    return account
}

operation()