import { createElement, DetailedReactHTMLElement, RefObject } from "react";


function splitIntoLines(widthMeasuringDivRef: RefObject<HTMLDivElement>, textContainerElementClassName: string, text: string, maxWidth: number) {
    if (widthMeasuringDivRef.current) {

        //making it visible and giving it the same style as inputs so width can be accurately measured
        widthMeasuringDivRef.current.className = textContainerElementClassName;

        const completeText = text
            /*https://stackoverflow.com/questions/4514144/js-string-split-without-removing-the-delimiters splits at " " without removing the " "*/
            .split(/(?= )/g).filter(x => x !== "");
        const returnElements: HTMLDivElement[] = [];


        while (completeText.length) {
            widthMeasuringDivRef.current.innerHTML = "";
            let lineText = "";


            while (widthMeasuringDivRef.current.getBoundingClientRect().width < maxWidth) {
                widthMeasuringDivRef.current.innerHTML = widthMeasuringDivRef.current.innerHTML + completeText[0].replaceAll(" ", "-");


                if (widthMeasuringDivRef.current.getBoundingClientRect().width < maxWidth) {
                    lineText += (completeText[0].charAt(0) === " " ? "" : " ") + completeText[0];
                    completeText.splice(0, 1);

                } else {
                    break;
                } //no special case, the line just ended


                if (!completeText.length) {
                    break;
                }
            }


            const clonedContainer = document.createElement("div");
            clonedContainer.className = textContainerElementClassName;
            clonedContainer.innerHTML = text;
            returnElements.push(clonedContainer);
        }


        //hiding it again
        widthMeasuringDivRef.current.className = 'hidden';

        return returnElements;
    }
}


function splitIntoWords(textContainerElement: HTMLDivElement | HTMLSpanElement) { }



export { splitIntoLines, splitIntoWords }