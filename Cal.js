const display=document.getElementById("display");
const operators=["+","-","*","/","%"];

function isOperator(char){
    return operators.includes(char);
}
function appendValue(value){
    let expression= display.value;
    let lastChar = expression.slice(-1);

//Prevent an operator at the beginning.
if(isOperator(value)){
    if(expression===""||isOperator(lastChar)){
        return;
    }
    display.value += value;
    return;
}
//Allow only one decimal point in the curreent number
if(value==="."){
    let currentNumber = expression.split(/[+\-*/%]/).pop();

    if(currentNumber.includes(".")){
        return;
    }
    display.value += currentNumber ===""?"0.":".";
    return;
}
display.value += value;
}
function clearDisplay(){
    display.value="";
}

function deleteLast(){
    display.value = display.value.slice(0,-1);
}

//Calculate without eval()
function calculate(){
    let expression=display.value;

    if(expression===""){
        return;
    }
    
    if(isOperator(expression.slice(-1))){
        display.value = "Error";
        return;
    }

    if(!/^[0-9.+*/%-]+$/.test(expression)){
        display.value="Error";
        return;
    }

    let tokens = expression.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/%]/g);
    if(!tokens||tokens.join("")!== expression){
        display.value = "Error";
        return;
    }
    try{
        let numbers=[];
        let ops=[];
        for (let i=0;i<tokens.length;i++){
            if(i%2===0){
                let num =Number(tokens[i]);

                if(!Number.isFinite(num)){
                    throw new Error("Invalid number");
                }
                numbers.push(num);
            }else{
                ops.push(tokens[i]);
            }
        }
        if(numbers.length!== ops.length+1){
            throw new Error("Invalid expression");
        }
        for(let i=0;i<ops.length;){
            if(["*","/","%"].includes(ops[i])){
             let a=numbers[i];
             let b=numbers[i+1];
             let result;
             
              if((ops[i]==="/"||ops[i]==="%")&&b===0){
                throw new Error("Cannot divide by zero");
              }
              if(ops[i]==="*") result= a*b;
              if(ops[i]==="/") result= a/b;
              if(ops[i]==="%") result= a%b;

              if(!Number.isFinite(result)){
                throw new Error("Invalid result");
              }
              numbers.splice(i,2,result);
              ops.splice(i,1);
            }else{
                i++;
            }
        }

        let result= numbers[0];

        for(let i=0; i<ops.length;i++){
            if(ops[i]==="+"){
                result += numbers[i+1];
            }else if(ops[i]==="-"){
                result -= numbers[i+1];
            }
        }
        if(!Number.isFinite(result)){
          throw new Error("Invalid result");
        }
        display.value = Number(result.toPrecision(12)).toString();

    } catch(error){
        display.value = "Error";
    }
}