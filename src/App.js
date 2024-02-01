import { useReducer } from "react";
import "./styles.css"
import Digit from "./Digit.js";

export const actions = {
  add_digit: 'add-digit',
  choose_operation: 'choose-operation',
  square: 'square',
  clear: 'clear',
  delete_digit: 'delete-digit',
  evaluate: 'evaluate'
}

function calculate({ currentOperand, previousOperand, operation }) {
  const curr = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  let computeResult = 0;
  switch(operation) {
    case "+":
      computeResult = (prev + curr)
      break;
    case "*":
      computeResult = (prev * curr)
      break;
    case "-":
      computeResult = (prev - curr)
      break;
    case "÷":
      computeResult = (prev / curr)
      break;

    default:
      break;
  }
  return computeResult.toString()
}


function square(value) {
  const num = parseFloat(value)
  return (num * num).toString()
}
function reducer(state, {type,payload}) {
  // eslint-disable-next-line default-case
  switch (type) {

    // Add digit
    case actions.add_digit:
      if(state.overwrite) {
        return {
          ...state, 
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") 
        return state 

      if (state.currentOperand == null){
        return {
          ...state, 
          currentOperand: `${payload.digit}`
        }
      }
      return {
        ...state, 
        currentOperand: `${state.currentOperand }${payload.digit}`
      }

    // add operand
    case actions.choose_operation:
      if(state.currentOperand == null && state.previousOperand == null) return state
      if(state.previousOperand == null) 
      return {
        ...state, 
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null,
      }
      if(state.currentOperand == null) 
      return {
        ...state,
        operation: payload.operation,
                previousOperand: state.previousOperand,
                currentOperand: null,
      } 
      return {
        ...state,
        previousOperand: calculate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    
    // evaluate 
    case actions.evaluate:
      if (state.operation == null || state.previousOperand == null || state.currentOperand == null){
        return state 
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: calculate(state),
      }
    //delete digit
    case actions.delete_digit:
      if(state.overwrite) return {
        ...state,
        overwrite: false,
        currentOperand: null
      }
    if(state.currentOperand == null) return state
    if(state.currentOperand.length=== 1) {
      return {...state, currentOperand: null}
    }
    return {
      ...state, currentOperand: state.currentOperand.slice(0,-1)
    }

    // clear digit
    case actions.clear:
    return {}

    //square
    case actions.square:
    if(state.currentOperand == null) return state
    if(state.previousOperand != null) return state
    if(state.previousOperand == null && state.currentOperand != null)
    return {
        ...state,
        currentOperand: square(state.currentOperand)
    }
  }
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,{})
  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button  onClick={() => dispatch({type:actions.clear})}>AC</button>
      <button onClick={() => dispatch({type:actions.delete_digit})}>DEL</button>
      <button onClick={() => dispatch({type:actions.square})}>x²</button>
      <button onClick={() => dispatch({type: actions.choose_operation, payload: {operation: "÷"} })}>÷</button>
      <Digit digit="7" dispatch={dispatch} />
      <Digit digit="8" dispatch={dispatch} />
      <Digit digit="9" dispatch={dispatch} />
      <button onClick={() => dispatch({type: actions.choose_operation, payload: {operation: "*"} })}>*</button>
      <Digit digit="4" dispatch={dispatch} />
      <Digit digit="5" dispatch={dispatch} />
      <Digit digit="6" dispatch={dispatch} />
      <button onClick={() => dispatch({type: actions.choose_operation, payload: {operation: "-"} })}>-</button>
      <Digit digit="1" dispatch={dispatch} />
      <Digit digit="2" dispatch={dispatch} />
      <Digit digit="3" dispatch={dispatch} />
      <button onClick={() => dispatch({type: actions.choose_operation, payload: {operation: "+"} })}>+</button>
      <Digit digit="." dispatch={dispatch} />
      <Digit digit="0" dispatch={dispatch} />
      <button className='span2' onClick={() => dispatch({type:actions.evaluate})}>=</button>
    </div>
  )
}

export default App;
