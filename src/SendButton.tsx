import { RefObject, useState } from "react";

function SendButton(props: { connectedInputsRefArgs: RefObject<HTMLInputElement>[] }) {
    const [pressedAtLeastOnce, setPressedAtLeastOnce] = useState(false);

    return <button className='text-h1 border-2 border-h1 rounded-md hover:bg-h1 w-44 hover:text-black' onClick={() => {
        setPressedAtLeastOnce(true)
        fetch("/sendText", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text:
                    props.connectedInputsRefArgs.reduce((previousValue, currentValue) => {
                        if (currentValue.current) return previousValue + "\n" + currentValue.current.value;
                        else return previousValue + "\n"
                    }, "")
            })
        });console.log(props.connectedInputsRefArgs.reduce((previousValue, currentValue) => {
            if (currentValue.current) return previousValue + "\n" + currentValue.current.value;
            else return previousValue + "\n"
        }, ""))
    }}>{pressedAtLeastOnce ? "send again" : "send"}</button>
}


export default SendButton;