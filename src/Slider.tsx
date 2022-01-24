import React from "react";
import AABB from "./AABB";
import AABBSim from "./AABB-sim";
import ShowHideComponent from "./ShowHideEventComponent";


class Slider extends ShowHideComponent<{
    height: number, maxValue: number, fillTime: number,
    classNameBG: string, classNameFG: string, classNameFGHover: string, classNameContainer: string,//css classes that are applied to the respected elements
    children: React.ReactNode, bgBorderWidth: number
}> {

    //constants
    maxValue: number;
    fillTime: number;
    fillingSpeed: number | null = null;
    children: React.ReactNode[];

    //each child is put in a containter. This array keeps the refs to these containers
    childContainerRefs: React.RefObject<HTMLSpanElement>[] = [];
    //ref to the foreground aka the sliding bit
    fgRef: React.RefObject<HTMLDivElement> = React.createRef();

    //sim.childrenBoundingBoxes are in the same order as children
    sim: AABBSim = new AABBSim();

    state: Readonly<{ value: number, hovering: boolean, hoverOverChild: boolean, aabbGrabbed: AABB | null }>;
    //needed to determine difference and thus speed to launch a child in one direction when its grabbed and then released
    mouseGrabPos: { x: number, y: number } | null = null;


    constructor(props: {
        height: number, maxValue: number, fillTime: number,
        classNameBG: string, classNameFG: string, classNameFGHover: string, classNameContainer: string,//css classes that are applied to the respected elements
        children: React.ReactNode, bgBorderWidth: number
    }) {
        super(props);

        //set the constants
        this.maxValue = props.maxValue;
        this.fillTime = props.fillTime;
        this.children = React.Children.toArray(props.children);

        //init base values
        this.childContainerRefs = this.children.map(() => React.createRef());
        this.state = {
            value: 0,
            hovering: false,
            hoverOverChild: false,
            aabbGrabbed: null
        }
    }

    render(): React.ReactNode {
        const childrenInContainers = this.children.map((component, i) => {
            if (this.sim.childrenBoundingBoxes[i]) {
                const boundingBox = this.sim.childrenBoundingBoxes[i];

                return <span ref={this.childContainerRefs[i]}
                    style={{ left: boundingBox.x, top: boundingBox.y }} key={i}
                    className={"absolute hover:z-10 select-none " + (this.state.aabbGrabbed ? "cursor-grabbing" : "cursor-grab")}
                    onMouseEnter={() => this.setState({ hoverOverChild: true })}
                    onMouseLeave={() => this.setState({ hoverOverChild: false })}>{component}</span>

            } else return <span ref={this.childContainerRefs[i]} key={i} className={"absolute "}>{component}</span>
        })

        //for some reason the slider foreground is further down in firefox than in other browsers
        //I have no idea why that is the case, so heres a workaround
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;


        return <span className={this.props.classNameContainer + (this.state.aabbGrabbed ? " cursor-grabbing" : " ")}//main container
            onMouseEnter={() => this.setState({ hovering: true })}
            onMouseLeave={() => this.setState({ hovering: false })}>


            <div style={{ width: this.state.value, height: this.props.height, left: this.state.value / 2 }} className=""
            /*empty, invisible div that has a non-absolute positioning so height of Slider can be measured*/></div>


            <div style={{//background div
                left: (this.state.value / 2) - this.props.bgBorderWidth,//without this the whole slider would move, as the foreground gets larger
                top: -this.props.bgBorderWidth + (isFirefox ? this.props.height / 2 : 0)
            }}
                className={this.props.classNameBG + " absolute"/*absolute necessarry so when measuring the slider height, the background height
                isn't added to the foreground height thus doubling the total registered size*/}></div>


            <div style={{
                width: this.state.value,
                height: this.props.height, left: this.state.value / 2,
                top: (isFirefox ? this.props.height / 2 : 0)
            }}
                className={(this.state.hovering ? this.props.classNameFGHover : this.props.classNameFG) + " absolute"}

                ref={this.fgRef}

                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (this.fgRef.current) {
                        const rect = this.fgRef.current.getBoundingClientRect();
                        const x = (e.clientX - rect.left) * this.fgRef.current.clientWidth / rect.width,
                            y = (e.clientY - rect.top) * this.fgRef.current.clientHeight / rect.height;

                        const targetAABB = this.sim.childrenBoundingBoxes.find(aabb => aabb.pointIsInside(x, y));
                        if (targetAABB) this.setState({ aabbGrabbed: targetAABB });
                        this.mouseGrabPos = { x, y };
                    }
                }}

                onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => this.resetMouseStuff(e)}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => this.resetMouseStuff(e)}>

                {this.state.hovering ? childrenInContainers : ""/*don't display anything special if mouse isn't over element*/}
            </div>

        </span>
    }

    //resets all object properties that rely on mousedown
    //used when mouse is released or leaves the slider
    resetMouseStuff(e: React.MouseEvent<HTMLDivElement>) {

        if (this.fgRef.current && this.mouseGrabPos) {
            const rect = this.fgRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) * this.fgRef.current.clientWidth / rect.width,//local mouse pos
                y = (e.clientY - rect.top) * this.fgRef.current.clientHeight / rect.height;

            //yeet the grabbed aabb (if existant) in the direction in which the mouse moved before releasing
            this.state.aabbGrabbed?.setImpulse(this.mouseGrabPos.x - x, this.mouseGrabPos.y - y);
        }

        this.setState({ aabbGrabbed: null });
        this.mouseGrabPos = null;
    }


    async componentDidMount() {
        //start incrementing the slider foreground
        this.fillAndMoveLoop();

        //sleep until the children mount, normally when mouse first hovers over Slider
        while (!this.childContainerRefs[0].current) await new Promise(resolve => setTimeout(resolve, 1));


        //create a bounding box for each child. this bounsing box is then added to the sim
        this.childContainerRefs.forEach(ref => {
            if (ref.current && this.fgRef.current) {

                let childBoundingBox = new AABB(Math.random() * this.fgRef.current.clientWidth, Math.random() * this.fgRef.current.clientHeight,
                    ref.current.clientWidth, ref.current.clientHeight);
                    
                let tries: number = 0;


                //attempt to place the bounding box, so that it doesn't overlapp anything
                //but give up after 1000 tries and such a placement is not allways possible
                while ((childBoundingBox.isOutOfBounds(new AABB(0, 0, this.fgRef.current!.clientWidth, this.fgRef.current!.clientHeight))
                    || this.sim.childrenBoundingBoxes.find(aabb => aabb.checkCollision(childBoundingBox))) && tries < 1000) {

                    tries++;
                    childBoundingBox = new AABB(Math.random() * this.fgRef.current.clientWidth, Math.random() * this.fgRef.current.clientHeight,
                        ref.current.clientWidth, ref.current.clientHeight);
                }


                this.sim.childrenBoundingBoxes.push(childBoundingBox);
            }
        })

    }


    fillAndMoveLoop() {
        requestAnimationFrame(this.fillAndMoveLoop.bind(this));

        //local variable so setState isn't called multiple times
        let setState: null | Object = null;


        if (this.fillingSpeed && ((this.fillingSpeed > 0 && this.state.value < this.maxValue) || (this.fillingSpeed < 0 && this.state.value > 0))) {
            //increment value === increment foreground width
            let value = this.state.value + this.fillingSpeed;

            //check bound for value. A negative value wouldn't make sense would it
            if (value > this.maxValue) value = this.maxValue;
            if (value < 0) value = 0;

            setState = { value }
        }


        //sim update if children are currently displayed
        //(other things in the if statement should allways be true but are requiered because Typescript)
        if (this.state.hovering && !this.state.hoverOverChild && !this.state.aabbGrabbed && this.fgRef.current) {
            this.sim.update(new AABB(0, 0, this.fgRef.current!.clientWidth, this.fgRef.current!.clientHeight));
            setState = {};
        }


        //rerender component, if asked to
        if (setState) this.setState(setState);
    }


    onShow() {
        this.fillingSpeed = this.maxValue * 30 / this.fillTime; /*velocity = distance / time*/
        /*30 because fillingSpeed is in fps but fillTime is in milliseconds*/
    }
    onHide() { this.fillingSpeed = - this.maxValue * 30/*30fps*/ / this.fillTime; /*start decrementing the slider width when it is ALMOST invisible*/ }
}


export default Slider;