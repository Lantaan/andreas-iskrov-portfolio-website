import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'



function TextMesh(props: {
    children: React.ReactNode; className?: string; rotation?: THREE.Euler; position?: THREE.Vector3;
    spanRef?: React.ForwardedRef<any>; opacity?: number;
}): JSX.Element {
    return (
        <mesh rotation={props.rotation} position={props.position}>
            <Html as='span' transform>
                <span className={props.className} style={{opacity: props.opacity?.toString()}} ref={props.spanRef}> {props.children} </span>
            </Html>
        </mesh>
    )
}


export default React.forwardRef((props: { children: React.ReactNode; className?: string; rotation?: THREE.Euler; position?: THREE.Vector3; opacity?: number; },
    spanRef: any) => <TextMesh
        spanRef={spanRef} {...props}
    />);