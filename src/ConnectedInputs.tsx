import { Html } from "@react-three/drei";
import React from "react";


function ConnectedInputsAsSeperateComponents(amount: number, widthMeasuringDivRef: React.RefObject<HTMLDivElement>, cssClasses: string): React.ReactNode[] {
    const inputRefs: React.RefObject<HTMLInputElement>[] = Array.from(Array(amount)).map(x =>
        x = (React.createRef() as React.RefObject<HTMLInputElement>));

    const inputElements = Array.from(Array(amount)).map((element, i, allInputs) =>
        element = (<input key={i} ref={inputRefs[i]} type={"text"} className={cssClasses}
            onChange={() => updateAllInputs(inputRefs, widthMeasuringDivRef, "")}

            onKeyDown={(e: React.KeyboardEvent) => {
                keydownInputHandler(e, i, inputRefs, widthMeasuringDivRef, cssClasses)
            }}
        />)
    );


    return inputElements
}

function keydownInputHandler(e: React.KeyboardEvent, selfIndex: number,
    inputRefs: React.RefObject<HTMLInputElement>[], widthMeasuringDivRef: React.RefObject<HTMLDivElement>, cssClasses: string) {
    const allInputs: HTMLInputElement[] = [];
    inputRefs.forEach(ref => ref.current ? allInputs.push(ref.current) : undefined);

    const self = allInputs[selfIndex],
        next = allInputs[selfIndex + 1],
        previous = allInputs[selfIndex - 1];

    if (e.key === "Enter") {
        //just in case
        e.stopPropagation();
        e.preventDefault();

        const caretPosition = self.selectionStart;
        const inputValue = self.value;

        if (caretPosition !== null) {
            self.value = inputValue.substring(0, caretPosition)
                + " " +/*zero width space*/"​" + " " + inputValue.substring(caretPosition);

            next.focus();
            updateAllInputs(inputRefs, widthMeasuringDivRef, "");
            next.setSelectionRange(0, 0);
        }

    } else if (e.key === "Backspace") {
        if (self.selectionStart === 0) {
            e.stopPropagation();
            e.preventDefault();
            previous.focus();
            previous.value = previous.value.slice(0, -2);
            const previousValueLength = previous.value.length;
            updateAllInputs(inputRefs, widthMeasuringDivRef, "");
            previous.setSelectionRange(previousValueLength, previousValueLength);
        }

    } else if (e.key === "ArrowDown") {
        e.stopPropagation();
        e.preventDefault();
        next.focus();
        next.setSelectionRange(self.selectionStart, self.selectionStart);

    } else if (e.key === "ArrowUp") {
        e.stopPropagation();
        e.preventDefault();
        previous.focus();
        previous.setSelectionRange(self.selectionStart, self.selectionStart);
    }
}


async function updateAllInputs(inputRefs: React.RefObject<HTMLInputElement>[], widthMeasuringDivRef: React.RefObject<HTMLDivElement>, cssClasses: string) {
    const inputElements: HTMLInputElement[] = [];
    inputRefs.forEach(ref => ref.current ? inputElements.push(ref.current) : undefined);

    const exapleElement = inputElements[0],
        inputWidth = exapleElement.clientWidth;


    if (widthMeasuringDivRef.current) {
        //making it visible and giving it the same style as inputs so width can be accurately measured
        widthMeasuringDivRef.current.className = '';

        const completeText = inputElements
            /*https://stackoverflow.com/questions/4514144/js-string-split-without-removing-the-delimiters splits at " " without removing the " "*/
            .map(x => x.value.split(/(?= )/g))
            .flat().filter(x => x !== "");

        for (let i = 0; i < inputElements.length; i++) {
            widthMeasuringDivRef.current.innerHTML = "";
            let lineText = "";

            while (widthMeasuringDivRef.current.getBoundingClientRect().width < inputWidth && completeText.length) {
                if (completeText[0].search("​"/*zero width space*/) > -1) {
                    lineText += completeText[0];
                    completeText.splice(0, 1);
                    break;

                } else {

                    widthMeasuringDivRef.current.innerHTML = widthMeasuringDivRef.current.innerHTML + completeText[0].replaceAll(" ", "-");


                    if (widthMeasuringDivRef.current.getBoundingClientRect().width < inputWidth) {
                        lineText += (completeText[0].charAt(0) === " " ? "" : " ") + completeText[0];
                        completeText.splice(0, 1);


                    } else if (widthMeasuringDivRef.current.innerHTML.search("-") === -1/* && !completeText.length*/)/*a single word takes up a whole line*/ {
                        console.log("as")
                        const currentWordLetters = completeText[0].split('');
                        let lettersThatFitIntoInput: string = "";

                        widthMeasuringDivRef.current.innerHTML = "";

                        while (widthMeasuringDivRef.current.getBoundingClientRect().width < inputWidth) {
                            const currentLetter = currentWordLetters[0];
                            widthMeasuringDivRef.current.innerHTML = widthMeasuringDivRef.current.innerHTML + currentLetter;

                            if (widthMeasuringDivRef.current.getBoundingClientRect().width < inputWidth) {
                                lettersThatFitIntoInput += currentLetter;
                                currentWordLetters.splice(0, 1);
                            } else {
                                //lettersThatFitIntoInput += "​"+" ";
                                break;
                            }
                        }

                        lineText = lettersThatFitIntoInput; console.log(completeText)
                        completeText.splice(0, 1, currentWordLetters.join(""));
                        console.log(completeText)
                        break;
                    }


                    if (!completeText.length) {
                        break;
                    }
                }
            }

            while (lineText.charAt(0) === ' ') {
                lineText = lineText.substring(1);
            }

            inputElements[i].value = lineText;
        }

        //hiding it again
        widthMeasuringDivRef.current.className = 'hidden';
    }
}



export default ConnectedInputsAsSeperateComponents;