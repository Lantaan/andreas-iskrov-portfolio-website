import { Euler, Vector3 } from 'three'
import { forwardRef, ForwardedRef, ReactNode } from 'react'
import { Html } from '@react-three/drei'


//return a 3d Text object
function TextMesh(props: {
    children: ReactNode; className?: string; rotation?: Euler; position?: Vector3;
    spanRef?: ForwardedRef<any>/*ref to the span that holds all the children*/; opacity?: number;
}): JSX.Element {
    return (
        <mesh rotation={props.rotation} position={props.position}>
            <Html as='span' transform>
                <span className={props.className} style={{opacity: props.opacity?.toString()}} ref={props.spanRef}> {props.children} </span>
            </Html>
        </mesh>
    )
}

//allows to reference the inner span
export default forwardRef((props: { children: React.ReactNode; className?: string; rotation?: Euler; position?: Vector3; opacity?: number; },
    spanRef: any) => <TextMesh
        spanRef={spanRef} {...props}
/>);