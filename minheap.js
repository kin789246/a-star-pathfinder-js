class Element
{
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}

class MinHeap
{
    constructor()
    {
        this.elements = [null];
    }

    enqueue(element, priority)
    {
        this.elements.push(new Element(element, priority));
        if (this.elements.length > 2) // 1 more elements in the queue
        {
            let idx = this.elements.length-1;
            while (idx > 1)
            {
                let parent = Math.floor(idx/2);
                if (this.elements[idx].priority < this.elements[parent].priority)
                {
                    [this.elements[idx], this.elements[parent]] =
                        [this.elements[parent], this.elements[idx]];
                    idx = parent;
                }
                else
                {
                    break;
                }
            }
        }
    }

    dequeue()
    {
        if (this.elements.length === 1)
        {
            console.log("heap is empty");
            return null;
        }
        [this.elements[1], this.elements[this.elements.length-1]] =
            [this.elements[this.elements.length - 1], this.elements[1]];
        let ele = this.elements.pop();
        let idx = 1;
        while (idx*2+1 < this.elements.length) /* right child is not null */
        {
            let left = idx*2;
            let right = idx*2+1;
            let min_child = (this.elements[right].priority<this.elements[left].priority && right<this.elements.length-1) ?
                right : left;
            if (this.elements[idx].priority > this.elements[min_child].priority)
            {
                [this.elements[idx], this.elements[min_child]] =
                    [this.elements[min_child], this.elements[idx]];
                idx = min_child;
            }
            else
            {
                break;
            }
        }
        
        return ele;
    }

    get_length()
    {
        return this.elements.length - 1;
    }
}