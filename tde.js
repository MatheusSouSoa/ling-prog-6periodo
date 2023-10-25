const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

let letras = [];

function buildExpressionTree(expression) {
  const tokens = expression.match(/\d+|[+\-*/()a-zA-Z]/g);

  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
  };

  const operatorStack = [];
  const outputQueue = [];

  for (let token of tokens) {
    if (token.match(/^\d+$/)) {
      outputQueue.push(new TreeNode(token));
    } else if (/[a-zA-Z]/.test(token)) {
      letras.push(token); 
      outputQueue.push(new TreeNode(token));
    } else if ("+-*/".includes(token)) {
      while (
        operatorStack.length > 0 &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(new TreeNode(operatorStack.pop()));
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(new TreeNode(operatorStack.pop()));
      }
      operatorStack.pop();
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(new TreeNode(operatorStack.pop()));
  }

  const buildStack = [];

  for (let token of outputQueue) {
    if (token.value.match(/^\d+$/) || /[a-zA-Z]/.test(token.value)) {
      buildStack.push(token);
    } else {
      const right = buildStack.pop();
      const left = buildStack.pop();
      const newNode = new TreeNode(token.value);
      newNode.left = left;
      newNode.right = right;
      buildStack.push(newNode);
    }
  }

  return buildStack[0];
}

function evaluateExpressionTree(root, variables) {
  if (!root) {
    return 0;
  }

  if (root.value.match(/^\d+$/)) {
    return parseInt(root.value);
  } else if (/[a-zA-Z]/.test(root.value)) {
    return variables[root.value] || 0;
  } else {
    const leftValue = evaluateExpressionTree(root.left, variables);
    const rightValue = evaluateExpressionTree(root.right, variables);
    if (root.value === "+") {
      return leftValue + rightValue;
    } else if (root.value === "-") {
      return leftValue - rightValue;
    } else if (root.value === "*") {
      return leftValue * rightValue;
    } else if (root.value === "/") {
      return leftValue / rightValue;
    }
  }
}

function substituirLetrasPorValoresComMultiplicacao(texto, valores) {
  texto = texto.replace(/(\d)([a-zA-Z])/g, function (match, numero, letra) {
    return numero + "*" + letra;
  });

  texto = texto.toUpperCase();
  texto = texto.replace(/[A-Z]/g, function (letra) {
    return valores[letra] || 0;
  });

  return texto;
}

rl.question("Entre com a expressão: ", function (userExpression) {
  if (!userExpression) {
    console.log("A expressão está vazia.");
    rl.close();
    return;
  }

  // Verificação de parênteses
  const parentesesAbertos = userExpression.match(/\(/g);
  const parentesesFechados = userExpression.match(/\)/g);
  
  if (
    (!parentesesAbertos && parentesesFechados) ||
    (parentesesAbertos && !parentesesFechados) ||
    (parentesesAbertos && parentesesFechados && parentesesAbertos.length !== parentesesFechados.length)
  ) {
    console.log("Expressão invalida: Uso indevido dos parenteses");
    rl.close();
    return;
  }

  // Verificação de tokens inválidos
  const erroLexico = !/^[+\-*/()a-zA-Z\d\s]+$/.test(userExpression);
  if (erroLexico) {
    console.log("Expressão Inválida: Token Inválido");
    rl.close();
    return;
  }

  // Verificação de operadores em sequência
  const operadoresEmSequencia = userExpression.match(/[+\-*/]{2,}/g);
  if (operadoresEmSequencia) {
    console.log("Expressão Inválida: Operadores em Sequência");
    rl.close();
    return;
  }

  const letrasNaExpressao = userExpression.match(/[A-Z]/g);
  if (letrasNaExpressao) {
    console.log("Letras na expressão:", letrasNaExpressao.join(", "));
    
    const valorLetras = {};
    const obterValorParaLetra = (index) => {
      if (index < letrasNaExpressao.length) {
        const letra = letrasNaExpressao[index];
        rl.question(`Entre com o valor de ${letra}: `, function (valor) {
          valorLetras[letra] = parseFloat(valor);
          obterValorParaLetra(index + 1);
        });
      } else {
        const expressionWithMultiplication = substituirLetrasPorValoresComMultiplicacao(
          userExpression,
          valorLetras
        );
  
        console.log("Expressão com Multiplicação:", expressionWithMultiplication);
        const expressionTree = buildExpressionTree(expressionWithMultiplication);
        const result = evaluateExpressionTree(expressionTree, valorLetras);
  
        console.log(`Resultado da expressão é ${result}`);
        rl.close();
      }
    };
    obterValorParaLetra(0);
  } else {
    console.log("Nenhuma letra na expressão.");
    rl.close();
  }
});




