import React from "react";
import AABB from "./AABB";
import ShowHideComponent from "./ShowHideEventComponent";


class Slider extends ShowHideComponent {
    state: Readonly<{ value: number, hovering: boolean, hoverOverChild: boolean, aabbGrabbed: AABB | null }>;
    maxValue: number;
    fillTime: number;
    fillingSpeed: number | null = null;
    children: React.ReactNode[];
    //childContainerRefs and childrenBoundingBoxes are in the same order as children
    childContainerRefs: React.RefObject<HTMLSpanElement>[] = [];
    childrenBoundingBoxes: AABB[] = [];
    fgRef: React.RefObject<HTMLDivElement> = React.createRef();
    mouseGrabPos: { x: number, y: number } | null = null;

    constructor(props: {
        width: number, height: number, maxValue: number, fillTime: number,
        classNameBG: string, classNameFG: string, classNameFGHover: string, classNameContainer: string,
        children: React.ReactNode, bgBorderWidth: number
    }) {
        super(props);
        this.maxValue = props.maxValue;
        this.fillTime = props.fillTime;
        this.children = React.Children.toArray(props.children)
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
            if (this.childrenBoundingBoxes[i]) {
                const boundingBox = this.childrenBoundingBoxes[i];
                return <span ref={this.childContainerRefs[i]}
                    style={{ left: boundingBox.x, top: boundingBox.y }} key={i}
                    className={"absolute hover:z-10 select-none " + (this.state.aabbGrabbed ? "cursor-grabbing" : "cursor-grab")}
                    onMouseEnter={() => this.setState({ hoverOverChild: true })}
                    onMouseLeave={() => this.setState({ hoverOverChild: false })}>{component}</span>

            } else return <span ref={this.childContainerRefs[i]} key={i} className={"absolute "}>{component}</span>
        })

        //don't judge me it works ok.
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;


        return <span onMouseEnter={() => this.setState({ hovering: true })} onMouseLeave={() => this.setState({ hovering: false })}
            className={this.props.classNameContainer + (this.state.aabbGrabbed ? " cursor-grabbing" : " ")}>

            <div style={{ width: this.state.value, height: this.props.height, left: this.state.value / 2 }} className=""
            /*empty, invisible div that has a non-absolute positioning so height of Slider can be measured*/></div>


            <div style={{ left: (this.state.value / 2) - this.props.bgBorderWidth, top: -this.props.bgBorderWidth+(isFirefox?this.props.height/2:0)  }}
                className={this.props.classNameBG + " absolute"}></div>


            <div style={{ width: this.state.value, height: this.props.height, left: this.state.value / 2, top:(isFirefox?this.props.height/2:0) }} ref={this.fgRef}
                className={(this.state.hovering ? this.props.classNameFGHover : this.props.classNameFG) + " absolute"}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (this.fgRef.current) {
                        const rect = this.fgRef.current.getBoundingClientRect();
                        const x = (e.clientX - rect.left) * this.fgRef.current.clientWidth / rect.width,
                            y = (e.clientY - rect.top) * this.fgRef.current.clientHeight / rect.height;

                        const targetAABB = this.childrenBoundingBoxes.find(aabb => aabb.pointIsInside(x, y));
                        if (targetAABB) this.setState({ aabbGrabbed: targetAABB });
                        this.mouseGrabPos = { x, y };
                    }
                }}

                onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => this.resetMouseStuff(e)}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => this.resetMouseStuff(e)}>
                {this.state.hovering ? childrenInContainers : ""}
            </div>

        </span>
    }

    resetMouseStuff(e: React.MouseEvent<HTMLDivElement>) {
        if (this.fgRef.current && this.mouseGrabPos) {
            const rect = this.fgRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) * this.fgRef.current.clientWidth / rect.width,
                y = (e.clientY - rect.top) * this.fgRef.current.clientHeight / rect.height;
            this.state.aabbGrabbed?.setImpulse(this.mouseGrabPos.x - x, this.mouseGrabPos.y - y);
        }
        this.setState({ aabbGrabbed: null });
        this.mouseGrabPos = null;
    }


    async componentDidMount() {
        this.fillAndMoveLoop();

        //sleep until the children mount, normally when mouse first hovers over Slider
        while (!this.childContainerRefs[0].current) await new Promise(resolve => setTimeout(resolve, 1));

        this.childContainerRefs.forEach((ref, i) => {
            if (ref.current) {

                let childBoundingBox = new AABB(Math.random() * 60, Math.random() * 10, ref.current.clientWidth, ref.current.clientHeight);
                let tries: number = 0;

                while ((childBoundingBox.isOutOfBounds(new AABB(0, 0, this.fgRef.current!.clientWidth, this.fgRef.current!.clientHeight))
                    || this.childrenBoundingBoxes.find(aabb => aabb.checkCollision(childBoundingBox))) && tries < 1000) {

                    tries++; console.log(tries)
                    childBoundingBox = new AABB(Math.random() * 60, Math.random() * 10,
                        ref.current.clientWidth, ref.current.clientHeight);
                }

                /*childBoundingBox.applyImpulse(Math.random() * ref.current.clientWidth - ref.current.clientWidth / 2,
                    Math.random() * ref.current.clientHeight - ref.current.clientHeight / 2);*/
                this.childrenBoundingBoxes.push(childBoundingBox);
            }
        })

    }


    fillAndMoveLoop() {
        requestAnimationFrame(this.fillAndMoveLoop.bind(this));
        if (this.fillingSpeed && ((this.fillingSpeed > 0 && this.state.value < this.maxValue) || (this.fillingSpeed < 0 && this.state.value > 0))) {
            let value = this.state.value + this.fillingSpeed;

            if (value > this.maxValue) value = this.maxValue;
            if (value < 0) value = 0;

            this.setState({ value });
        }

        if (this.state.hovering && !this.state.hoverOverChild && !this.state.aabbGrabbed && this.fgRef.current) {
            this.childrenBoundingBoxes.forEach((aabb, i) =>
                aabb.update([...this.childrenBoundingBoxes].splice(i - 1, 1),//delete this aabb to prevent detecting collision with itself
                    new AABB(0, 0, this.fgRef.current!.clientWidth, this.fgRef.current!.clientHeight)));
            this.setState({});
        }
    }

    onShow() {
        this.fillingSpeed = this.maxValue * 30/*30fps*/ / this.fillTime;
    }
    onHide() {
        this.fillingSpeed = -this.maxValue * 30/*30fps*/ / this.fillTime;
    }
}


export default Slider;