import { RefObject, createRef, ReactNode, KeyboardEvent } from "react";

//if it increases, it means the text went to the next line => new input element has to be focused on
let currentLinesAmount = 0,
    previousUpdateLinesAmount = 0;


function ConnectedInputsAsSeperateComponents(amount: number, widthMeasuringDivRef: RefObject<HTMLDivElement>, cssClasses: string): ReactNode[] {
    const inputRefs: RefObject<HTMLInputElement>[] = Array.from(Array(amount)).map(x =>
        x = (createRef() as RefObject<HTMLInputElement>));

    const inputElements = Array.from(Array(amount)).map((element, i, allInputs) =>
        element = (<input key={i} ref={inputRefs[i]} type={"text"} className={cssClasses}
            onChange={() => updateAllInputs(inputRefs, widthMeasuringDivRef, "")}

            onKeyDown={(e: KeyboardEvent) => {
                keydownInputHandler(e, i, inputRefs, widthMeasuringDivRef, cssClasses)
            }}
        />)
    );


    return inputElements
}

function keydownInputHandler(e: KeyboardEvent, selfIndex: number,
    inputRefs: RefObject<HTMLInputElement>[], widthMeasuringDivRef: RefObject<HTMLDivElement>, cssClasses: string) {
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

            //next.focus();
            updateAllInputs(inputRefs, widthMeasuringDivRef, "");
            //next.setSelectionRange(0, 0);
        }

    } else if (e.key === "Backspace") {
        if (self.selectionStart === 0) {
            e.stopPropagation();
            e.preventDefault();
            updateAllInputs(inputRefs, widthMeasuringDivRef, "");
            if (previous) {
                /*previous.focus();
                previous.value = previous.value.slice(0, -2);
                const previousValueLength = previous.value.length;
                updateAllInputs(inputRefs, widthMeasuringDivRef, "");
                previous.setSelectionRange(previousValueLength, previousValueLength);*/
            }
        }

    } else if (e.key === "ArrowDown") {
        e.stopPropagation();
        e.preventDefault();
        next?.focus();
        next?.setSelectionRange(self.selectionStart, self.selectionStart);

    } else if (e.key === "ArrowUp") {
        e.stopPropagation();
        e.preventDefault();
        previous?.focus();
        previous?.setSelectionRange(self.selectionStart, self.selectionStart);
    }
}


async function updateAllInputs(inputRefs: RefObject<HTMLInputElement>[], widthMeasuringDivRef: RefObject<HTMLDivElement>, cssClasses: string) {
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

            if (completeText.length/*there is still text to be managed*/) currentLinesAmount = i;

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


                    } else if (widthMeasuringDivRef.current.innerHTML.substring(1).search("-") === -1/*every line starts with a " " yes that is a bug*a single word takes up a whole line*/) {
                        //TODO doesn't work if more than 1 letter is added at a time (for example when pasted into)
                        const currentWordWithoutLastLetter = completeText[0].slice(0, -1),//remove last letter
                            lastLetter = completeText[0].slice(-1);
                        lineText += currentWordWithoutLastLetter;
                        completeText.splice(0, 1);
                        completeText.unshift(lastLetter);//"push from front"
                        break;

                    } else break; //no special case, the line just ended


                    if (!completeText.length) {
                        break;
                    }
                }
            }

            //TODO every line has a " " at the start
            /*if(lineText.charAt(0) === ' ') {
                console.log(lineText.charAt(0), lineText)
                lineText = lineText.substring(1);
            }*/

            inputElements[i].value = lineText;
        }


        if (previousUpdateLinesAmount < currentLinesAmount/*new line was entered*/) {
            const selectedDOMElement = document.activeElement,
                selectedInputIndex = inputElements.findIndex(input => input === selectedDOMElement);

            inputElements[selectedInputIndex + 1]?.focus();

        } else if (previousUpdateLinesAmount > currentLinesAmount /*one line became empty*/) {
            const selectedDOMElement = document.activeElement,
                selectedInputIndex = inputElements.findIndex(input => input === selectedDOMElement);

            inputElements[selectedInputIndex - 1]?.focus();
        }

        previousUpdateLinesAmount = currentLinesAmount


        //hiding it again
        widthMeasuringDivRef.current.className = 'hidden';
    }
}



export default ConnectedInputsAsSeperateComponents;