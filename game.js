/*
    implement A* Algroithm by ga-kin63 on 2023-8-24
*/
class Game
{
    constructor(canvas_id)
    {
        this.count = 0;
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.game_objs = [];
        this.previous_time_stamp = 0;
        this.frontier = new MinHeap();
        this.visited = [];
        this.path = [];
        this.cost_so_far = {};
        this.N = 20;
        this.start;
        this.end;
        this.stop_animate = false;
        this.no_solution = false;
        this.last_checked;
    }

    set_canvas()
    {
        this.canvas.width = window.innerHeight * 0.8;
        this.canvas.height = window.innerHeight * 0.8;
    }

    create_world()
    {
        let r = this.canvas.width / this.N / 2;
        let end_x = this.N-6;
        let end_y = this.N-10;
        for (let i=0; i<this.N; i++)
        {
            this.game_objs.push([]);
            for (let j=0; j<this.N; j++)
            {
                let y = i*2*r+r;
                let x = j*2*r+r; 
                let t = getStrongRandom(0, 10);
                let type = t < 2 ? 'wall' : 'spot';
                if (x===end_x && y===end_y)
                {
                    type = 'spot';
                }
                let weight = i+j;
                this.game_objs[i].push(new Spot(this.ctx, x, y, r, type, weight, i+','+j));
            }
        }
        
        this.start = this.game_objs[0][0];
        this.start.type = 'start';
        this.end = this.game_objs[this.N-6][this.N-10];
        this.end.type = 'end';
        this.process_adjacents();

        this.frontier.enqueue(this.start, 0);
        this.cost_so_far[this.start.name] = 0;

    }

    run(time_stamp)
    {
        let elapsed_time = (time_stamp - this.previous_time_stamp)/1000;
        elapsed_time = Math.min(elapsed_time, 0.1);
        this.previous_time_stamp = time_stamp;
        
        this.a_star();
        this.process_color(this.last_checked);

        this.game_objs.forEach((obj_i)=>
            obj_i.forEach((obj_j)=>
                obj_j.update(elapsed_time)
        ));
        this.clear_canvas();
        this.game_objs.forEach((obj_i)=>
            obj_i.forEach((obj_j)=>
                obj_j.draw()
        ));
        if (this.stop_animate) {
            console.log("animation stopped");
            if (this.no_solution)
            {
                this.draw_no_solution();
            }
            return;
        }
        this.animate_id = window.requestAnimationFrame((time_stamp) => this.run(time_stamp));
    }

    process_adjacents()
    {
        if (this.game_objs.length === 0)
        {
            return;
        }
        for (let i=0; i<this.N; i++)
        {
            for (let j=0; j<this.N; j++)
            {
                if (i>0)
                {
                    if (this.game_objs[i-1][j].type != 'wall')
                    {
                        this.game_objs[i][j].adjacents.push(this.game_objs[i-1][j]);
                    }
                }
                if (i<this.N-1)
                {
                    if (this.game_objs[i+1][j].type != 'wall')
                    { 
                        this.game_objs[i][j].adjacents.push(this.game_objs[i+1][j]); 
                    }
                }
                if (j>0)
                {
                    if (this.game_objs[i][j-1].type != 'wall')
                    {
                        this.game_objs[i][j].adjacents.push(this.game_objs[i][j-1]);
                    }
                }
                if (j<this.N-1)
                {
                    if (this.game_objs[i][j+1].type != 'wall')
                    {
                        this.game_objs[i][j].adjacents.push(this.game_objs[i][j+1]);
                    }
                }
            }
        }
    }

    a_star()
    {
        //console.log(this.frontier.get_length());
        if (this.frontier.get_length() === 0)
        {
            //console.log("no solution");
            this.stop_animate = true;
            this.no_solution = true;
            return;
        }
        let current = this.frontier.dequeue();
        this.last_checked = current.element;
        if (current.element === this.end)
        {
            this.stop_animate = true;
            console.log("find the path at (", current.element.name,")");
            return;
        }
        current.element.adjacents.forEach((next)=>
        {
            if (this.visited.includes(next))
            {
                return;
            }
            this.visited.push(next);
            let new_cost = this.cost_so_far[current.element.name] + next.weight;
            if (!(next.name in this.cost_so_far) || this.cost_so_far[next.name] > new_cost)
            {
                this.cost_so_far[next.name] = new_cost;
                let priority = new_cost + this.heuristic(next, this.end);
                this.frontier.enqueue(next, priority);
                next.came_from = current.element;
            }
        });
    }

    heuristic(next, end)
    {
        return (Math.abs(next.x - end.x) + Math.abs(next.y - end.y)) / this.N;
    }

    process_color(current)
    {
        //console.log("last_checked at (", current.name, ")");
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                if (this.game_objs[i][j].type != 'wall' &&
                    this.game_objs[i][j].type != 'start' &&
                    this.game_objs[i][j].type != 'end')
                {
                    this.game_objs[i][j].type = 'spot';
                }
            }
        }
        this.visited.forEach((ele) => {
            if (ele.type != 'end')
                ele.type = 'visited';
        });
        // set all frontier elements to scanning
        this.frontier.elements.forEach((ele)=>
        {
            if (ele != null)
            {
                if (ele.element.type != 'end')
                {
                    ele.element.type = 'scanning';
                }
            }
        });
        this.path = [];
        while (current)
        {
            this.path.unshift(current);
            current.type = current===this.end ? 'end' : 'thisway';
            if (current.came_from === undefined)
            {
                current.type = 'start';
            }
            current = current.came_from;
        }
    }

    draw_no_solution()
    {
        let offset = 10;
        let sz = this.canvas.width / this.N;
        let x = sz * (this.N/3-1);
        let y = sz * (this.N/2);
        let s = "No Way Home";
        this.ctx.font = sz + 'px Menlo';
        let w = this.ctx.measureText(s).width + offset*2;
        this.ctx.fillStyle = 'black';
        this.ctx.rect(x-offset, y-offset, w, sz+offset*2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'skyblue';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(s, x, y);
    }

    clear_canvas()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}