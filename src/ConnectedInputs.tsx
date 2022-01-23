import { RefObject, ReactNode, KeyboardEvent } from "react";

//a zero width space (zws) represents a command to go to next line
//so basically a \n except a zws can be placed in a text input element

//lines amount tells in how many lines there is text (currently and on last update)
//if currently there is one additional line of text compared to the previous update,
//the next input element should be focused on
let currentLinesAmount = 0,
    previousUpdateLinesAmount = 0;


//so basically the only way to place smth on a ring is to have it as several different objects
//but that brings the problem of entering smth longer than line in an input/textarea
//so this functions manually simulates a textare by connecting many text input elements
//its at the same time the hackiest and most complex thing about this project
function ConnectedInputsAsSeperateComponents(amount: number, widthMeasuringDivRef: RefObject<HTMLDivElement>,
    refArray: RefObject<HTMLInputElement>[], cssClasses: string): ReactNode[] {

    const inputElements = Array.from(Array(amount)).map((element, i, allInputs) =>
        element =
        <input ref={refArray[i]} key={i} type={"text"} className={cssClasses}

            onChange={() => updateAllInputs(refArray, widthMeasuringDivRef, "")}
            onKeyDown={(e: KeyboardEvent) => {
                keydownInputHandler(e, i, refArray, widthMeasuringDivRef, cssClasses)
            }}
        />
    );


    return inputElements
}


function keydownInputHandler(e: KeyboardEvent, selfIndex: number/*index of the input that triggered the event*/,
    inputRefs: RefObject<HTMLInputElement>[], widthMeasuringDivRef: RefObject<HTMLDivElement>, cssClasses: string) {

    const allInputs: HTMLInputElement[] = [];
    //fills allInputs with the actual inputs, not the refs, if ref.current is a thing
    inputRefs.forEach(ref => ref.current ? allInputs.push(ref.current) : undefined);

    const self = allInputs[selfIndex],/*the input that triggered the event*/
        next = allInputs[selfIndex + 1],/*the input below self*/
        previous = allInputs[selfIndex - 1];/*the input above self*/


    if (e.key === "Enter") {
        //just in case
        e.stopPropagation();
        e.preventDefault();

        const caretPosition = self.selectionStart;
        const inputValue = self.value;

        if (caretPosition !== null/*should never be the case, but typescript*/
            /*not if(caretPosition)... as then a caretPosition of 0 would be "illegal"*/) {
            //add a zws encircled in normal spaces at the caret position 
            self.value = inputValue.substring(0, caretPosition)
                + " " +/*zero width space*/"​" + " " + inputValue.substring(caretPosition);

            updateAllInputs(inputRefs, widthMeasuringDivRef, "");
        }

    } else if (e.key === "ArrowDown") {
        e.stopPropagation();
        e.preventDefault();
        //if its the last input element (no next element), then the input element below it is the first element
        if (next) {
            next.focus();
            next.setSelectionRange(self.selectionStart, self.selectionStart);
        }else{
            allInputs[0].focus();
            allInputs[0].setSelectionRange(self.selectionStart, self.selectionStart);
        }

    } else if (e.key === "ArrowUp") {
        e.stopPropagation();
        e.preventDefault();
        //if its the first input element (no previous element), then the input element above it is the last element
        if (previous) {
            previous.focus();
            previous.setSelectionRange(self.selectionStart, self.selectionStart);
        }else{
            allInputs.at(-1)?.focus();
            allInputs.at(-1)?.setSelectionRange(self.selectionStart, self.selectionStart);
        }
    }
}


async function updateAllInputs(inputRefs: RefObject<HTMLInputElement>[], widthMeasuringDivRef: RefObject<HTMLDivElement>, cssClasses: string) {
    //I do only vagely know what happens here
    //so basically it loops over all the lines,
    //and looks at every word in every line
    //if the word doesn't fit into the current line or there is a zws,
    //the programm goes to the next line
    //also for some reason every new line starts with a " "
    //so I made this a feature and now even the first line starts with a " ",
    //which it wouldn't normally do
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