import React from "react";


const forceFactor = 1 / 10,
    timeFactor = 4 / 6;


class PhysicsObject {
    posX: number;
    posY: number;
    attractorX: number;
    attractorY: number;
    velocityX: number = 0;
    velocityY: number = 0;
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
        this.velocityX += dx * forceFactor * timeFactor / d;
        this.velocityY += dy * forceFactor * timeFactor / d;
    }
    updatePositions() {
        this.posX += this.velocityX * timeFactor;
        this.posY += this.velocityY * timeFactor;
    }
}



class OscillatorSim extends React.Component<any, any>{
    scale: number = 5;
    objectFirstState: { x: number, y: number, ax: number, ay: number, vx: number, vy: number } = { x: 50, y: 0, ax: 0, ay: 0, vx: 0, vy: 1 }
    objects: PhysicsObject[] = [];
    framesBetweenNewObjects: number = 68 / timeFactor;
    newObjectInNFrames: number = 0;
    finishedAdding: boolean = false;


    constructor(props: any) {
        super(props);//this.addStandartObject();
    }


    render(): React.ReactNode {
        return <>
            {this.objects.map(object => <span className="bg-primary absolute rounded-full" style={{
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
        if (this.newObjectInNFrames < 1) {
            if (this.objects.length <= 6) this.addStandartObject();
            else this.finishedAdding = true;
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


export default OscillatorSim;