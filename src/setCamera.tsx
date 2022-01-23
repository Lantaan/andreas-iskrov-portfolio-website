import * as THREE from 'three'
import { useThree } from '@react-three/fiber'


//a component that doesn't has any HTML anything but sets the camera to a given location and looking at a given target
function SetCamera(props: {position?: THREE.Vector3, target?: THREE.Vector3}): JSX.Element {
    const {camera} = useThree();
    if(props.position) camera.position.copy(props.position);
    if(props.target) camera.lookAt(props.target);
    
    //sometimes the camera rotates weirdly and the text rings end up the other way around
    //this prevents it
    camera.rotation.z = 0;
    return (<></>)
}


export default SetCamera;