import React from "react";


//an abstract class that has a show and a hide event
//the onHide event is triggered when something is (almost) no longer visible due to low opacity
//the onShow event is triggered when something is visible AGAIN after being on low opacity
//these events do NOT trigger when something moves out/in of the cameras FoV
abstract class ShowHideComponent <propsType> extends React.Component<propsType, any>{
    constructor(props: propsType) {super(props);}

    abstract render(): React.ReactNode

    abstract onShow():void
    abstract onHide():void
}


export default ShowHideComponent;