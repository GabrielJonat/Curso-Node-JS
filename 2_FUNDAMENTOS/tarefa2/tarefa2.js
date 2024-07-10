import inquirer from 'inquirer'
import chalk from 'chalk'

inquirer.prompt([{name: 'name', message: 'Qual é o seu nome? ',},{name: 'idade', message: 'Qual é a sua idade? ',},]).
                then((answears) => {
                    console.log(chalk.bgYellow.black(JSON.stringify(answears)))
                }).
                catch(err => console.log(err))