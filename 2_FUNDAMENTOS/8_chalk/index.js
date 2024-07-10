import chalk from 'chalk';

const nota = 6

if(nota >= 7)
    console.log(chalk.green.bold('Parabéns! você está aprovado!'))
else
    console.log(chalk.bgRed.black("Terás que fazer uma reavaliação"))