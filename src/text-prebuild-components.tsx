import { ReactNode } from "react";



function T(props: { children: ReactNode }) { return <div className='text-primary [opacity:inherit] w-48 text-xs'>{props.children}</div> }
function H(props: { children: ReactNode }) { return <div className='text-h1 text-lg [opacity:inherit] w-48'>{props.children}</div> }

function Blue(props: { children: ReactNode }) { return <span className='text-h2'>{props.children}</span> }


function SM(props: { children: ReactNode }) { return <div className='text-primary text-[8px] [opacity:inherit] w-48 h-3'>{props.children}</div> }


function HoverUnderline(props: { children: ReactNode }) { return <span className='hover:underline'>{props.children}</span> }
function LinkInNewTab(props: { children: ReactNode, href: string }) {
    return <a /*https://stackoverflow.com/questions/15551779/open-link-in-new-tab-or-window*/
        target="_blank" rel="noopener noreferrer" href={props.href}>{props.children}</a>
}


export { T, Blue, H, HoverUnderline, LinkInNewTab, SM};