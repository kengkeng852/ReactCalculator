import {actions} from './App';

export default function Digit({dispatch,digit}) {
    return (
    <button onClick={() => dispatch({type: actions.add_digit, payload: {digit} })}>
        {digit}
    </button>);
}