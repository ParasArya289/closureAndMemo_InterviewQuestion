import { useMemo, useRef, useState } from "react";

/**
 * @abstract Create a basic calculator with 4 operation button +, -, *, /. It should have 2 input fields with current operation performed sign in between them. It should have reset button to reset input field and result. App should calculate total number of operations performed which is not affected by reset.
 * @optimization After basic functionality, functions which are performing calculation should not perform calculation when there is no change in any of the input field or change in type of operation (operand in this case "+","-"...). HINT: optimize function with caching with closures and memoization.
 */

export const Calculator = () => {
  const [totalOperations, setTotalOperations] = useState(0);
  const [result, setResult] = useState(null);
  const operations = ["+", "-", "*", "/"];

  const signRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);

  const evaluateExpression = (expression) => {
    const evaluator = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => a / b
    };
    const [operand1, operator, operand2] = expression.split(" ");
    return evaluator[operator](+operand1, +operand2);
  };

  const operationSubmitHandler = () => {
    let cachedNum1 = null;
    let cachedNum2 = null;
    let cachedOperation = null;

    return (e) => {
      e.preventDefault();
      const num1 = +num1Ref.current.value;
      const num2 = +num2Ref.current.value;
      const operation = e.nativeEvent.submitter.name;
      if (
        cachedNum1 === num1 &&
        cachedNum2 === num2 &&
        cachedOperation === operation
      ) {
        return;
      }

      cachedNum1 = num1;
      cachedNum2 = num2;
      cachedOperation = operation;

      if (num1 && num2 && operation) {
        const res = evaluateExpression(`${num1} ${operation} ${num2}`);
        setResult(() => res);
        signRef.current.textContent = operation;
      }
      setTotalOperations((prev) => prev + 1);
    };
  };

  const cachedOperationHandler = useMemo(operationSubmitHandler, []);

  const resetHandler = () => {
    signRef.current.textContent = " + ";
    num1Ref.current.value = "";
    num2Ref.current.value = "";
    setResult(() => null);
  };

  return (
    <div>
      <h4>Operations:{totalOperations}</h4>
      <form onSubmit={cachedOperationHandler}>
        <input ref={num1Ref} type="number" placeholder="Number 1" required />
        <span ref={signRef} style={{ display: "inline-block", width: "20px" }}>
          {" + "}
        </span>
        <input ref={num2Ref} type="number" placeholder="Number 2" required />

        <div style={{ marginBlock: "20px" }}>
          {operations?.map((btn) => (
            <button type={"submit"} name={btn} key={btn}>
              {btn}
            </button>
          ))}
        </div>
      </form>
      <div>{result}</div>
      <button onClick={resetHandler}>Reset</button>
    </div>
  );
};
