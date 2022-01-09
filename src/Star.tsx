import React, { ReactNode } from 'react'
import * as THREE from 'three'

import colorByTemperature from "./colorByTemperature";



function uniforms() {
    return {
        colorB: { type: 'vec3', value: new THREE.Color(0xACB6E5) },
        colorA: { type: 'vec3', value: new THREE.Color(0x74ebd5) }
    }
}

function fragmentShader() {
    return `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;

    void main() {
      gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
    }
`}
function vertexShader() {
    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
`}



class Star extends React.Component<{}, any>{
    meshRef: React.RefObject<any> = React.createRef();
    size: number = 1;
    color: string = "#ffffff";

    removed: boolean = false;

    constructor(props: {}) {
        super(props);
    }

    render(): ReactNode {

        const sphereGeometry = <sphereGeometry args={[this.size]} />,
            sphereMaterial = /*<shaderMaterial args={[{
                uniforms: uniforms(),
                fragmentShader: fragmentShader(),
                vertexShader: vertexShader()
            }]} />*/<meshBasicMaterial color={this.color} />

        return (<><mesh ref={this.meshRef}>
            {sphereGeometry}
            {sphereMaterial}
        </mesh>
        </>)
    }

    updateColor() {
        const temperature = ~~((this.size + 1 / 40) * 400) * 100
        const color = colorByTemperature.deg2.get(temperature)
        if (color) this.color = color
        else console.log(temperature);
        this.setState({});
    }
}



export default Star;