import * as THREE from 'three'


function MeshToVertexSpheres(props: { position: THREE.Vector3, color: string, mesh?: THREE.Mesh }): JSX.Element {
    if (props.mesh) {
        const meshGeometry = props.mesh.geometry;
        //https://stackoverflow.com/questions/18967423/three-js-how-do-i-get-the-vertices-of-an-object
        const vertices = meshGeometry.attributes.position.array;
        const vertexSpheres: JSX.Element[] = [];

        const sphereGeometry = <sphereGeometry args={[0.05]} />,
        sphereMaterial = <meshStandardMaterial color={props.color}/>

        for (let i = 0; i < vertices.length; i = i + 3) {
            const pos = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            vertexSpheres.push(<mesh position={pos}>
                {sphereGeometry}
                {sphereMaterial}
            </mesh>)
        }//console.log(vertexSpheres)
        return <>{vertexSpheres}</>
    } else return <></>
}


export default MeshToVertexSpheres;