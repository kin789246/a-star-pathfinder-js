class GameObject
{
    constructor(ctx, x, y, vx, vy)
    {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
}

class Spot extends GameObject
{
    constructor(ctx, x, y, radius, type, weight, name)
    {
        super(ctx, x, y, 0, 0);
        this.type = type;
        this.radius = radius;
        this.fill_color = 'aqua'; 
        this.adjacents = [];
        this.weight = weight;
        this.name = name;
        this.came_from = undefined;
    }

    update(elapsed_time)
    {
        switch (this.type) {
            case 'wall':
                this.fill_color = 'darkslategray';
                break;
            case 'thisway':
                this.fill_color = 'blue';
                break;
            case 'scanning':
                this.fill_color = 'yellow';
                break;
            case 'visited':
                this.fill_color = 'lightgreen';
                break;
            case 'start':
                this.fill_color = 'mediumseagreen';
                break;
            case 'end':
                this.fill_color = 'red';
                break;
            default:
                this.fill_color = 'aqua';
                break;
        }
    }

    draw()
    {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill_color;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        this.ctx.fill();
        if (this.type != 'wall')
        {
            let s = this.radius/2 + 'px Menlo';
            this.ctx.font = s;
            this.ctx.fillStyle = this.type==='thisway' ? 'yellow' : 'purple';
            this.ctx.fillText(this.weight, this.x, this.y);
        }
    }
}