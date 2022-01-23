import * as THREE from 'three'
import { Component, Children, createRef } from 'react'

import TextMesh from './TextObjects'
import ShowHideComponent from './ShowHideEventComponent'


class TextRingVarR extends Component<{
    children: React.ReactNode, ringOrigin: THREE.Vector3,
    opacityRefPoint/*the point from which out the opacity is calculated*/: THREE.Vector3, onSelect?:/*fires when ring becomes main ring*/ Function
}, any>{

    children: React.ReactNode[];
    //Refs to the TextMesh components
    //childContainerRefs and childrenHeights are in the same order as children
    childContainerRefs: React.RefObject<HTMLSpanElement>[] = [];
    //heights are measured and filled in after first render
    childrenHeights: number[] = [];

    state: Readonly<{
        radius: number,
        ringOrigin: THREE.Vector3
    }>;

    constructor(props: {
        children: React.ReactNode, ringOrigin: THREE.Vector3,
        opacityRefPoint: THREE.Vector3/*the point from which out the opacity is calculated*/, onSelect?:/*fires when ring becomes main ring*/ Function
    }) {
        super(props);

        //https://www.smashingmagazine.com/2021/08/react-children-iteration-methods/
        this.children = Children.toArray(props.children);
        this.childContainerRefs = this.children.map(() => createRef());

        this.state = {
            radius: 0,
            ringOrigin: props.ringOrigin
        }
    }

    render(): React.ReactNode {
        let currentDegree = 0;


        const meshPositionsAndRotations = this.children.map((component, index) => {
            const pos = new THREE.Vector3(
                this.state.ringOrigin.x,
                Math.cos(currentDegree) * this.state.radius + this.state.ringOrigin.y,
                Math.sin(currentDegree) * this.state.radius + this.state.ringOrigin.z
            )

            //only occurs on rerender as on first render this.childrenHeights is []
            if (this.childrenHeights[index]) {
                const height = this.childrenHeights[index];

                //if you draw a triangle, one point of which is the text ring origin,
                //and the other two points being the top and bottom of the component,
                //you have a triangle with 2 equal sides (radius) and one base
                //beta is the angle between the radius and the base
                const beta = Math.acos((height) / this.state.radius);
                //alpha is the angle between the two equal sides
                const alpha = Math.PI - 2 * beta;

                currentDegree += alpha;
            }

            return { pos, rotation: new THREE.Euler(currentDegree - /*brute forced constant*/(Math.PI * 9) / 16, 0, 0) };
        });


        //text ring is wrapped around x-axis and so dist only distance on y and z direction tells
        //about where smth is on the ring
        const distances2dFromOpacityPoint = meshPositionsAndRotations.map(a => Math.sqrt(
            (a.pos.y - this.props.opacityRefPoint.y) ** 2 +
            (a.pos.z - this.props.opacityRefPoint.z) ** 2));

        const maxDist = Math.max(...distances2dFromOpacityPoint),
            minDist = Math.min(...distances2dFromOpacityPoint);

        //array of values between 0 and 1
        const normalizedDist = distances2dFromOpacityPoint.map(a => (a - minDist) / maxDist),
            opacities = normalizedDist.map(distNorm => 1 - distNorm * 2)


        const meshes = this.children.map((component, index) => {
            const previousOpacity = Number(this.childContainerRefs[index].current?.style.opacity),
                newOpacity = opacities[index];

            //if the component is a ShowHideComponent check if onShow or onHide events schould be fired
            if ((component as any).ref && (component as any).ref.current && (component as any).ref.current instanceof ShowHideComponent && !isNaN(previousOpacity)) {
                if (previousOpacity < 0.6/*0.6 is not exactly hidden, but after some experimantation this is the best looking value for the show and hide events*/
                    && newOpacity >= 0.6) ((component as any).ref.current as ShowHideComponent<any>).onShow();
                else if (previousOpacity >= 0.6 && newOpacity < 0.6) ((component as any).ref.current as ShowHideComponent<any>).onHide();
            }

            return (<>
                <TextMesh ref={this.childContainerRefs[index]} position={meshPositionsAndRotations[index].pos}
                    rotation={meshPositionsAndRotations[index].rotation} opacity={newOpacity} key={index}>{component}</TextMesh>
            </>)
        });

        return (<>
            {meshes}
        </>)
    }


    async componentDidMount() {
        //the TextMesh objects aren't rendered yet so the function "sleeps" until they are
        while (!this.childContainerRefs[0].current) await new Promise(resolve => setTimeout(resolve, 1));


        this.childrenHeights = this.childContainerRefs.map((ref) => {
            if (ref.current) {
                //creates a new element to read its height
                const copyElement = document.createElement("span");

                copyElement.className = ref.current.className;
                copyElement.style.display = 'block';

                //kidnap children
                Array.from(ref.current.children).forEach(child => copyElement.appendChild(child));


                document.body.appendChild(copyElement)
                const height = copyElement.clientHeight / 80/*brute forced constant*/;
                document.body.removeChild(copyElement)


                //return kidnapped children
                Array.from(copyElement.children).forEach(child => ref.current!.appendChild(child))

                return height
            } else return 0
        });

        const perimeter = this.childrenHeights.reduce((a, b) => a + b, 0);
        const radius = perimeter / (Math.PI);

        this.setState({ radius, cameraPos: new THREE.Vector3() })
    }
}


export { TextRingVarR };