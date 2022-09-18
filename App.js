const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
const operations = ['+', '-', '/', '*'];
const ids = {
    7: 'seven',
    8: 'eight',
    9: 'nine',
    4: 'four',
    5: 'five',
    6: 'six',
    1: 'one',
    2: 'two',
    3: 'three',
    0: 'zero',
    '+': 'add',
    '-': 'subtract',
    '/': 'divide',
    '*': 'multiply'
}

function App() {

    const [display, setDisplay] = React.useState('')
    const [answer, setAnswer] = React.useState(0)

    const [decimalFlag, setDecimalFlag] = React.useState(false)

    let lastPressed = display[display.length - 1]

    let beforeLastPressed = display[display.length - 2]

    const handleNumber = (event) => {
        const number = event.target.textContent

        // nothing changed in display for an input of zero when the display is empty
        if (number === '0' && display === '') {
            setDisplay(display)
        }

        // after a calculation is done pressing any number will clear the answer screen and display the number
        else if (lastPressed === '=' && /[0-9.]/.test(number)) {
            setDisplay(number)
            setAnswer(0)
        }

        // if zero is pressed, if the last number is zero and there is an operator before the last number of zero as well, display will be unchanged
        else if (lastPressed === '0' && operations.includes(beforeLastPressed) && number === '0') {
            setDisplay(display)
        }

        // if any number other than zero is pressed, if the last number is zero and there is an operator before the last number of zero as well, the last zero will be removed and replaced with the new number
        else if (lastPressed === '0' && operations.includes(beforeLastPressed) && number !== '0') {
            setDisplay(display.slice(0, -1) + number)
        }
        else {
            setDisplay(display + number)
        }
    }

    const handleOperator = (event) => {
        const operator = event.target.textContent

        // allow operators only when there is something on display 
        if (display.length) {
            setDisplay(display + operator)

            // when there is a operator at the end, the new operator pressed is checked
            // if new operator is not minus or in case there are already two operators in the display (such case is only possible with any operator at first and minus as the second operator)
            if ((operations.includes(lastPressed) && operator !== '-') || operations.includes(lastPressed) && operations.includes(beforeLastPressed)) {
                // firstly the case with two operators is checked here
                // for two operators already present in the display, display is sliced to remove both operators and the newly pressed operator key is included in the display
                if (operations.includes(beforeLastPressed)) {
                    const updatedDisplay = `${display.slice(0, display.length - 2)}${operator}`
                    setDisplay(updatedDisplay)
                }

                // if there has been only one operator previously and the newly pressed operator is not minus, the last operator is removed and replaced with the operator(that is not minus)
                else {
                    setDisplay(`${display.slice(0, display.length - 1)}${operator}`)
                }
            }

            // after a calculation is finished, when an operator is pressed a new calculation is started
            else if (lastPressed == '=') {
                setDisplay(answer + operator)
            }

            // in case there are not operators then the newly pressed operator is added
            else { setDisplay(display + operator) }
        }

    }

    const handleDecimal = () => {

        // for nothing in the display
        if (display === '') {
            setDisplay('0.')
        }

        // if the last content of display is an operator
        else if (operations.includes(lastPressed)) {
            setDisplay(display + '0.')
        }

        // after a calculation, the answer is cleared and new calculation with decimal started
        else if (lastPressed === '=') {
            setDisplay('0.')
            setAnswer(0)
        }

        // prevents more than one decimal in a number
        else if (lastPressed === '.' || beforeLastPressed === '.') {
            setDisplay(display)
        }
        else {
            setDisplay(display + '.')
        }

    }

    const handleEqual = () => {
        // evaluates the string and fixes the answer to 4 decimal places
        // in case the answer is in less than 4 decimal places, the extra zeros are stripped off
        setAnswer(eval(display).toFixed(4).replace(/\.?0+$/, ""))
        setDisplay(store => store + '=')
    }

    const handleAllClear = () => {
        setDisplay('')
        setAnswer(0)
    }

    const handleClear = () => {
        setDisplay(store => store.split('').slice(0, store.length - 1).join(''))
        setAnswer(0)
    }

    return (
        <div className='calculator'>
            <div id='display' className='display'>
                <input
                    type='text'
                    value={display}
                    placeholder='0'
                    disabled />

                <div className='answer'>{answer}</div>
            </div>
            <div className='numbers-container'>
                <button
                    id='clear'
                    className='big-h light-grey ac'
                    onClick={handleAllClear}>
                    AC
                </button>

                <button
                    className='light-grey'
                    onClick={handleClear}>
                    C
                </button>

                {numbers.map(num => (
                    <button
                        id={ids[num]}
                        className={`dark-grey ${num === 0 && 'big-h'} `}
                        key={num}
                        onClick={handleNumber}>
                        {num}
                    </button>
                ))}
                <button
                    id='decimal'
                    className='dark-grey'
                    onClick={handleDecimal}>
                    .
                </button>
            </div>
            <div className='operations-container'>
                {operations.map(op => (
                    <button
                        id={ids[op]}
                        className='orange'
                        key={op}
                        onClick={handleOperator}>
                        {op}
                    </button>
                ))}
                <button
                    id='equals'
                    className='orange'
                    onClick={handleEqual}>
                    =
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))