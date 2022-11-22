import "./styles/Shape.css"

class Shape {
    constructor(xPos, yPos, dropXPos, dropYPos, height, width, relX, relY, isDragging, isTarget) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.dropXPos = dropXPos;
        this.dropYPos = dropYPos;
        this.isDragging = isDragging;
        this.isTarget = isTarget;
        this.height = height;
        this.width = width;
        this.relX = relX;
        this.relY = relY;
    }

    findOverlap(x, y, shape) {
        let botX = x + this.width;
        let botY = y + this.height;
        let shapeBotX = shape.dropXPos + this.width;
        let shapeBotY = shape.dropYPos + this.height;
        let width = Math.max(0, Math.min(botX, shapeBotX) - Math.max(x, shape.dropXPos))
        let height = Math.max(0, Math.min(botY, shapeBotY) - Math.max(y, shape.dropYPos))
        this.height = height
        this.width = width

        if (width === 0 || height === 0) {
            return false
        } else {
            return [height, width]
        }
    }


    shapeStyle(canDrag, relX, relY) {
        var trueX = this.xPos - relX
        var trueY = this.yPos - relY
        return {
            position: 'absolute',
            left: this.isDragging && canDrag ? trueX : this.dropXPos,
            top: this.isDragging && canDrag ? trueY : this.dropYPos,
            cursor: this.isDragging ? 'grabbing' : 'pointer',
            height: this.height,
            width: this.width,
            transition: !this.isDragging && "left 2s, top 2s, height 2s, width 2s"
        }
    }

};

export default Shape;