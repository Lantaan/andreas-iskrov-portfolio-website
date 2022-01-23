//axis aligned bounding box (AABB)
//can move, detect and resolve collisions with other AABB
class AABB {
    //position
    x: number;
    y: number;

    width: number;
    height: number;

    velocityX: number = 0;
    velocityY: number = 0;

    mass: number;
    
    id: number = Math.random();


    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mass = Math.sqrt(width * height);
    }


    update(possibleCollisions: AABB[], bounds: AABB) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        possibleCollisions.forEach(aabb => {
            if (aabb.id !== this.id/*don't detect collisions with one self*/) {
                const collision = this.checkCollision(aabb);

                if (collision) {
                    if (collision.penetrationComponent === "x") {
                        const relativePenetrationVelocity = this.velocityX - aabb.velocityX,
                            relativePenetrationImpulse = relativePenetrationVelocity * (this.mass + aabb.mass);

                        //a bit of total velocity loss
                        this.velocityX = -relativePenetrationImpulse / (5 * this.mass);
                        //move out so this AABB doesn't remain inside the other AABB
                        this.x += collision.positionChange;
                        aabb.velocityX = relativePenetrationImpulse / (5 * aabb.mass);

                    } else {
                        const relativePenetrationVelocity = this.velocityY - aabb.velocityY,
                            relativePenetrationImpulse = relativePenetrationVelocity * (this.mass + aabb.mass);

                        //a bit of total velocity loss
                        this.velocityY = -relativePenetrationImpulse / (5 * this.mass);
                        //move out so this AABB doesn't remain inside the other AABB
                        this.y += collision.positionChange;
                        aabb.velocityY = relativePenetrationImpulse / (5 * aabb.mass);
                    }
                }
            }
        });

        //check whether this is out of bounds and back inside bounds (+mirror velocity) if it is out of bounds
        const boundsCheck = this.isOutOfBounds(bounds);
        if (boundsCheck) {
            if (boundsCheck.penetrationComponent === "x") {
                this.x += boundsCheck.positionChange;
                this.velocityX *= -.9;
            } else {
                this.y += boundsCheck.positionChange;
                this.velocityY *= -.9;
            }
        }
    }


    setImpulse(impulseX: number, impulseY: number) {
        this.velocityX = impulseX / this.mass;
        this.velocityY = impulseY / this.mass;
    }
    applyImpulse(impulseX: number, impulseY: number) {
        this.velocityX += impulseX / this.mass;
        this.velocityY += impulseY / this.mass;
    }


    checkCollision(collisionObject: AABB): { penetrationComponent: "x" | "y", positionChange:/*on penetration axis*/number } | null {
        const minMaxA = this.getMinMaxStuff(),
            minMaxB = collisionObject.getMinMaxStuff();

        if (minMaxA.minX <= minMaxB.maxX &&
            minMaxA.maxX >= minMaxB.minX &&
            minMaxA.minY <= minMaxB.maxY &&
            minMaxA.maxY >= minMaxB.minY) {
            //the "depth" at wich the rect is inside the other on the respective axis determines what part of the
            //velocity is the "penetration component" = the bump direction
            const dx = minMaxB.minX > minMaxA.minX/*detects on which side the overlapping is happening*/ ? minMaxA.maxX - minMaxB.minX : minMaxB.maxX - minMaxA.minX,
                dy = minMaxB.minY > minMaxA.minY ? minMaxA.maxY - minMaxB.minY : minMaxB.maxY - minMaxA.minY;

            if (dx < dy) return { penetrationComponent: "x", positionChange: minMaxB.minX > minMaxA.minX ? minMaxB.minX - minMaxA.maxX : minMaxB.maxX - minMaxA.minX };
            else return { penetrationComponent: "y", positionChange: minMaxB.minY > minMaxA.minY ? minMaxB.minY - minMaxA.maxY : minMaxB.maxY - minMaxA.minY };

        } else return null
    }


    isOutOfBounds(bounds: AABB): { penetrationComponent: "x" | "y", positionChange:/*on penetration axis*/number } | null {
        const minMaxA = this.getMinMaxStuff(),
            minMaxBounds = bounds.getMinMaxStuff();

        if (minMaxA.minX > minMaxBounds.minX &&
            minMaxA.minY > minMaxBounds.minY &&
            minMaxA.maxX < minMaxBounds.maxX &&
            minMaxA.maxY < minMaxBounds.maxY) return null

        else {
            const dx = minMaxBounds.minX < minMaxA.minX ? minMaxA.maxX - minMaxBounds.maxX : minMaxBounds.minX - minMaxA.minX,
                dy = minMaxBounds.minY < minMaxA.minY ? minMaxA.maxY - minMaxBounds.maxY : minMaxBounds.minY - minMaxA.minY;


            if (dx > dy) return { penetrationComponent: "x", positionChange: minMaxBounds.minX < minMaxA.minX ? minMaxBounds.maxX - minMaxA.maxX : minMaxBounds.minX - minMaxA.minX };
            else return { penetrationComponent: "y", positionChange: minMaxBounds.minY < minMaxA.minY ? minMaxBounds.maxY - minMaxA.maxY : minMaxBounds.minY - minMaxA.minY };
        }
    }


    pointIsInside/*check if a point is inside this AABB*/(pointX: number, pointY: number): boolean {
        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }

    getMinMaxStuff()/*return min and max pos*/: { minX: number, minY: number, maxX: number, maxY: number } {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.width,
            maxY: this.y + this.height
        }
    }
}



export default AABB;