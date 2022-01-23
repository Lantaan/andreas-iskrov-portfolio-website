import AABB from "./AABB";

//a 2d rectangle rigid body sim
class AABBSim {
    childrenBoundingBoxes: AABB[] = [];

    constructor() {}

    update(bounds: AABB) {
        this.childrenBoundingBoxes.forEach(aabb =>
            aabb.update([...this.childrenBoundingBoxes], bounds)
        )
    };
}



export default AABBSim;