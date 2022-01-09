import { ReactThreeFiber, useFrame } from "@react-three/fiber";
import * as THREE from "three"
import React, { useEffect } from "react";
import Star from "./Star";
import { SphereGeometry, Vector3 } from "three";


const forceFactor = 0.00001;
const boundsRadius = 10;


//yes this should be done with a class component BUT for some reason
//the only way to do smth every frame (in react-three-fiber) is with useFrame, a react hook;
function StarSim(props: { starAmount: number }): JSX.Element {
    const starRefs: React.RefObject<Star>[] = [...Array(props.starAmount)].map(() => React.createRef());
    //hook instead of normal const as otherwise starInformation would not be preserved during rerenders
    const [starInformation] = React.useState([...Array(props.starAmount)].map(() => {
        return { velocity: new THREE.Vector3() }
    }));


    function updateVelocities() {
        starRefs.forEach((starRefA, i) => {
            if (starRefA.current && !starRefA.current.removed && starRefA.current.meshRef.current) {
                const meshA: THREE.Mesh = starRefA.current.meshRef.current;

                for (let j = i + 1; j < starRefs.length; j++) {
                    const starRefB = starRefs[j]

                    if (starRefB.current && !starRefB.current.removed && starRefB.current?.meshRef.current) {
                        const meshB: THREE.Mesh = starRefB.current.meshRef.current;

                        const posA = meshA.position,
                            posB = meshB.position;

                        const d: THREE.Vector3 = posB.clone().sub(posA);

                        const distSq = d.lengthSq();

                        const fA = (forceFactor * starRefB.current.size) / (distSq),
                            fB = -(forceFactor * starRefA.current.size) / (distSq)


                        starInformation[i].velocity.add(new THREE.Vector3(
                            fA * d.x,
                            fA * d.y,
                            fA * d.z
                        ));
                        starInformation[j].velocity.add(new THREE.Vector3(
                            fB * d.x,
                            fB * d.y,
                            fB * d.z
                        ));
                    }
                }
            }
        })
    }

    function updatePositions() {
        starRefs.forEach((starRef, i) => {
            if (starRef.current && !starRef.current.removed && starRef.current.meshRef.current) {
                const mesh: THREE.Mesh = starRef.current.meshRef.current;
                mesh.position.add(starInformation[i].velocity);
            }
        })
    }


    function handleCollisions() {
        starRefs.forEach((starRefA, i) => {
            if (starRefA.current && !starRefA.current.removed && starRefA.current.meshRef.current) {
                const meshA: THREE.Mesh = starRefA.current.meshRef.current;

                for (let j = i + 1; j < starRefs.length; j++) {
                    const starRefB = starRefs[j]

                    if (starRefB.current && !starRefB.current.removed && starRefB.current?.meshRef.current) {
                        const meshB: THREE.Mesh = starRefB.current.meshRef.current;

                        const posA = meshA.position,
                            posB = meshB.position;

                        const d: THREE.Vector3 = posB.clone().sub(posA);

                        if (d.length() <= starRefA.current.size + starRefB.current.size) {
                            const originalSizeA = starRefA.current.size,
                                originalSizeB = starRefB.current.size;
                            const volumeA = originalSizeA ** 3,
                                volumeB = originalSizeB ** 3;

                            if (volumeA > volumeB) {
                                starRefA.current.size = (volumeA + volumeB) ** (1 / 3);
                                starRefA.current.updateColor();
                                meshA.geometry = new THREE.SphereGeometry(starRefA.current.size);
                                //v1*m1+v2*m2/m12
                                starInformation[i].velocity = starInformation[i].velocity.multiplyScalar(originalSizeA)
                                    .add(starInformation[j].velocity.clone().multiplyScalar(originalSizeB)).divideScalar(starRefA.current.size);

                                starRefB.current.removed = true;
                                meshB.visible = false;
                            } else {
                                starRefB.current.size = (volumeA + volumeB) ** (1 / 3);
                                starRefB.current.updateColor();
                                meshB.geometry = new THREE.SphereGeometry(starRefB.current.size);

                                starRefA.current.removed = true;
                                meshA.visible = false;
                            }
                        }
                    }
                }
            }
        });
    }


    function checkBounds() {
        starRefs.forEach((starRefA, i) => {
            if (starRefA.current && !starRefA.current.removed && starRefA.current.meshRef.current) {
                const mesh: THREE.Mesh = starRefA.current.meshRef.current;

                const dist = new THREE.Vector3().sub(mesh.position);

                if (dist.length() > boundsRadius) {
                    const newPos = mesh.position.clone().normalize().multiplyScalar(boundsRadius);
                    mesh.position.set(newPos.x, newPos.y, newPos.z);
                    starInformation[i].velocity = new THREE.Vector3();
                }
            }
        });
    }


    function init() {
        starRefs.forEach((starRef, i) => {
            if (starRef.current && starRef.current.meshRef.current) {
                const mesh: THREE.Mesh = starRef.current.meshRef.current;

                const x = Math.random()-.5,
                    y = Math.random()-.5,
                    z = Math.random()-.5;

                const size = Math.random() / 10;

                mesh.position.set(x, y, z).normalize().multiplyScalar(10);
                starRef.current.size = size;
                starRef.current.updateColor();
            }
        })
    }


    //https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once
    useEffect(() => {
        init();
    }, []);

    useFrame(() => {
        updateVelocities();
        updatePositions();
        handleCollisions();
        checkBounds();
    });

    return <>{[...Array(props.starAmount)].map((x, i) => <Star ref={starRefs[i]} />)}</>
}




export default StarSim;