import {Component} from "react";


//just a constant for the force strength
const forceFactor = 1 / 10
//timeFactor < 1 slows simulation time timeFactor > 1 speeds it up
const timeFactor = 2 / 3;


//a object that is attracted to an attractor
//the total force of attraction doesn't depend on distance from the attractor (only direction)
class PhysicsObject {
    posX: number;
    posY: number;
    //point to which the PhysicsObject is attracted
    attractorX: number;
    attractorY: number;

    velocityX: number = 0;
    velocityY: number = 0;
    //just for display, doesn't calculate collisions
    radius: number = 3;


    constructor(posX: number, posY: number, attractorX: number, attractorY: number, velocityX?: number, velocityY?: number) {
        this.posX = posX;
        this.posY = posY;
        this.attractorX = attractorX;
        this.attractorY = attractorY;
        if (velocityX) this.velocityX = velocityX;
        if (velocityY) this.velocityY = velocityY;
    }


    update() {
        this.updateVelocity();
        this.updatePositions();
    }

    updateVelocity() {
        const dx = this.attractorX - this.posX,
            dy = this.attractorY - this.posY;
        const d = Math.sqrt(dx ** 2 + dy ** 2);
        //consider the case dy = 0. then velocity increases [constants] * dx/sqrt(dx**2) = [constants] * dx/dx = [constants]
        //dx or dy is still necessary as they determine the sign of the right hand side because d is always positive
        this.velocityX += dx * forceFactor * timeFactor / d;
        this.velocityY += dy * forceFactor * timeFactor / d;
    }
    updatePositions() {
        this.posX += this.velocityX * timeFactor;
        this.posY += this.velocityY * timeFactor;
    }
}



class PhysicsSim extends Component<any, any>{
    //scale between the PhysicsObject values and the display values
    scale: number = 5;
    //the base state of every newly created object
    objectFirstState: { x: number, y: number, ax: number, ay: number, vx: number, vy: number } = { x: 50, y: 0, ax: 0, ay: 0, vx: 0, vy: 1 }
    //all the PhysicsObjects that are part of the sim
    objects: PhysicsObject[] = [];
    //time until a new physicsObject is added after one was allready added
    framesBetweenNewObjects: number = 68/*brute forced constant*/ / timeFactor;
    //counst down from framesBetweenNewObjects. when newObjectInNFrames===0 a new physicsObject is added to the sim
    newObjectInNFrames: number = 0;
    //adds 6 objects in total. if 6 object are added finishAdding is set to true
    finishedAdding: boolean = false;


    constructor(props: any) {
        super(props);
    }


    render(): React.ReactNode {
        return <>
            {this.objects.map(object => <span className="bg-h2 absolute rounded-full" style={{
                left: object.posX * this.scale, top: object.posY * this.scale,
                width: object.radius * 2 * this.scale, height: object.radius * 2 * this.scale
            }}></span>)}
        </>
    }


    componentDidMount() {
        this.simulatePhysicsRecursive();
    }


    simulatePhysicsRecursive() {
        requestAnimationFrame(this.simulatePhysicsRecursive.bind(this));

        this.newObjectInNFrames--;
        //if its time for a new object
        if (this.newObjectInNFrames < 1) {
            //check if there is "space" for a new object
            if (this.objects.length <= 6) this.addStandartObject();
            else this.finishedAdding = true;

            //reset object creation cooldown
            this.newObjectInNFrames = this.framesBetweenNewObjects;
        }

        this.objects.forEach(object => object.update());
        this.setState({});
    }


    addStandartObject() {
        this.objects.push(
            new PhysicsObject(
                this.objectFirstState.x,
                this.objectFirstState.y,
                this.objectFirstState.ax,
                this.objectFirstState.ay,
                this.objectFirstState.vx,
                this.objectFirstState.vy
            )
        );
    }
}


export default PhysicsSim;