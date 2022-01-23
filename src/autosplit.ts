import { ReactElement, RefObject } from "react";


function splitIntoLines(widthMeasuringDivRef: RefObject<HTMLDivElement>, textContainerElement: ReactElement, text: string, maxWidth: number) {
    if (widthMeasuringDivRef.current) {

        //making it visible and giving it the same style as inputs so width can be accurately measured
        widthMeasuringDivRef.current.className = '';

        const completeText = text
            /*https://stackoverflow.com/questions/4514144/js-string-split-without-removing-the-delimiters splits at " " without removing the " "*/
            .split(/(?= )/g).filter(x => x !== "");
        const returnElements: (HTMLDivElement | HTMLSpanElement)[] = [];


        while (completeText.length) {
            widthMeasuringDivRef.current.innerHTML = "";
            let lineText = "";


            while (widthMeasuringDivRef.current.getBoundingClientRect().width < maxWidth) {
                widthMeasuringDivRef.current.innerHTML = widthMeasuringDivRef.current.innerHTML + completeText[0].replaceAll(" ", "-");


                if (widthMeasuringDivRef.current.getBoundingClientRect().width < maxWidth) {
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

            //TODO every line has a " " at the start
            /*if(lineText.charAt(0) === ' ') {
                console.log(lineText.charAt(0), lineText)
                lineText = lineText.substring(1);
            }*/

            console.log(lineText);
        }


        //hiding it again
        widthMeasuringDivRef.current.className = 'hidden';
    }
}

function splitIntoWords(textContainerElement: HTMLDivElement | HTMLSpanElement) { }


export { splitIntoLines, splitIntoWords }