const TokenTypes = {
  NUMBER: 'NUMBER',
  IDENTIFIER: 'IDENTIFIER',
  ADDITION: '+',
  SUBTRACTION: '-',
  MULTIPLICATION: '*',
  DIVISION: '/',
};

const TokenSpec = [
  [/^\s+/, null],
  [/^(?:\d+(?:\.\d*)?|\.\d+)/, TokenTypes.NUMBER],
  [/^[a-z]+/, TokenTypes.IDENTIFIER],
  [/^\+/, TokenTypes.ADDITION],
  [/^\-/, TokenTypes.SUBTRACTION],
  [/^\*/, TokenTypes.MULTIPLICATION],
  [/^\//, TokenTypes.DIVISION],
];

class Tokenizer {
  constructor(input) {
    this.input = input;
    this.cursor = 0;
  }

  hasMoreTokens() {
    return this.cursor < this.input.length;
  }

  match(regex, inputSlice) {
    const matched = regex.exec(inputSlice);
    if (matched === null) {
      return null;
    }

    this.cursor += matched[0].length;
    return matched[0];
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const inputSlice = this.input.slice(this.cursor);

    for (let [regex, type] of TokenSpec) {
      const tokenValue = this.match(regex, inputSlice);

      if (tokenValue === null) {
        continue;
      }

      if (type === null) {
        return this.getNextToken();
      }

      return {
        type,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: "${inputSlice[0]}"`);
  }
}

const operators = {
  u: {
    prec: 3,
    assoc: 'right',
  },
  '*': {
    prec: 2,
    assoc: 'left',
  },
  '/': {
    prec: 2,
    assoc: 'left',
  },
  '+': {
    prec: 1,
    assoc: 'left',
  },
  '-': {
    prec: 1,
    assoc: 'left',
  },
};



const assert = (predicate) => {
  if (predicate) return;
  throw new Error('Assertion failed due to invalid token');
};

const evaluate = (input) => {
  const opSymbols = Object.keys(operators);
  const stack = [];
  let output = [];

  const peek = () => {
    return stack.at(-1);
  };

  const addToOutput = (token) => {
    output.push(token);
  };

  const handlePop = () => {
    const op = stack.pop();


    if (op === 'u') return -parseFloat(output.pop());

    const right = parseFloat(output.pop());
    const left = parseFloat(output.pop());

    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      default:
        throw new Error(`Invalid operation: ${op}`);
    }
  };

  const handleToken = (token) => {
    switch (true) {
      case !isNaN(parseFloat(token)):
        addToOutput(token);
        break;

      case opSymbols.includes(token):
        const o1 = token;
        let o2 = peek();
        while (
          o2 !== undefined &&
          o2 !== (operators[o2].prec > operators[o1].prec ||
                 (operators[o2].prec === operators[o1].prec &&
                  operators[o1].assoc === 'left'))
          ) 
          {
          addToOutput(handlePop());
          o2 = peek();
        }
        stack.push(o1);
        break;
      default:
        throw new Error(`Invalid token: ${token}`);
    }
  };

  const tokenizer = new Tokenizer(input);
  let token;
  let prevToken = null;
  while ((token = tokenizer.getNextToken())) {
    if (
      token.value === '-' &&
      (prevToken === null ||
        prevToken.value === opSymbols.includes(prevToken.value))
    ) {
      handleToken('u');
    } else {
      handleToken(token.value);
    }
    prevToken = token;
  }

  while (stack.length !== 0) {
    addToOutput(handlePop());
  }

  return output[0];
};


// Making a grid
const calculator = document.getElementById('calculator')
let grid = [1, 2, 3,'+', 4, 5, 6,'-', 7, 8,
    9, '*', 'clear', 0,'=', '/']

for(let i = 0; i <= 15; i++){
    let btn = document.createElement('button')
    btn.className = `${grid[i]}`
    btn.textContent = `${grid[i]}`
    calculator.appendChild(btn)
}


// A function that shows operations on screen
// Taking button's values and show them on screen
const Screen_text = document.getElementById('text')
const Buttons = document.querySelectorAll('button')

Buttons.forEach((button)=>{
    button.addEventListener('click',()=>
    {
   if(button.textContent === 'clear' || 
    Screen_text.textContent === 'undefined'||
    Screen_text.textContent === 'NaN'||
    Screen_text.textContent === 'Infinity')
    {Screen_text.textContent = ''}

    else if( button.textContent === '='){

      Screen_text.textContent = `${evaluate(Screen_text.textContent).toFixed(3)}`
  }
    else{Screen_text.textContent = Screen_text.textContent + `${button.className}`}
})
})