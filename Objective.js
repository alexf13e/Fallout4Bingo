class Objective
{
    constructor(text, amount, checkBingo)
    {
        this.text = text;
        this.amount = amount;
        this.progress = 0;
        this.progressElement = null;
        this.element = this.createElement();
        this.checkBingo = checkBingo;
        this.highlighted = false;
    }

    createElement()
    {
        const div = document.createElement("div");
        const pText = document.createElement("p");

        div.classList.add("dvObjective");
        div.classList.add("dvObjectiveNotCompleted");

        div.addEventListener("mouseup", ((e)=> {
            e.stopPropagation();

            if (e.button === 0) this.addProgress();
            else if (e.button === 2) this.toggleHighlight();
        }).bind(this));

        div.oncontextmenu = () => { return false; };

        div.appendChild(pText);

        pText.classList.add("pObjectiveText");
        pText.textContent = this.text;

        if (this.amount > 1)
        {
            const dvProgress = document.createElement("div");
            const pProgress = document.createElement("p");
            const btnUndoProgress = document.createElement("button");

            pProgress.classList.add("pProgressText");
            pProgress.textContent = this.progress + "/" + this.amount;
            
            btnUndoProgress.classList.add("btnUndoProgress");
            btnUndoProgress.textContent = "-";
            btnUndoProgress.addEventListener("mouseup", ((e) => {
                e.stopPropagation();
                this.removeProgress();
            }).bind(this));

            this.progressElement = pProgress;
            dvProgress.appendChild(btnUndoProgress);
            dvProgress.appendChild(pProgress);
            div.appendChild(dvProgress);
        }

        return div;
    }

    updateDisplay()
    {
        if (this.progressElement) this.progressElement.textContent = this.progress + "/" + this.amount;
        
        this.element.className = "dvObjective";
        if (this.progress === this.amount) this.element.classList.add("dvObjectiveCompleted");
        else this.element.classList.add("dvObjectiveNotCompleted");

        if (this.highlighted) this.element.classList.add("dvObjectiveHighlighted");
    }

    addProgress()
    {
        if (this.progress < this.amount)
        {
            this.progress++;
            this.updateDisplay();
            this.checkBingo();
        }
        else
        {
            if (this.amount === 1)
            {
                this.removeProgress();
                this.checkBingo();
            }
        }

    }

    removeProgress()
    {
        if (this.progress > 0)
        {
            this.progress--;
            this.updateDisplay();
            this.checkBingo();
        }
    }

    toggleHighlight()
    {
        this.highlighted = !this.highlighted;
        this.updateDisplay();
    }
}