
const dvWelcomeBG = document.getElementById("dvWelcomeBG");
const dvWelcomeBorder = document.getElementById("dvWelcomeBorder");
const dvWelcome = document.getElementById("dvWelcome");
const pTimer = document.getElementById("pTimer");
const pCountdown = document.getElementById("pCountdown");
const btnStartGame = document.getElementById("btnStartGame");
const btnEndGame = document.getElementById("btnEndGame");
const btnConfirmEnd = document.getElementById("btnConfirmEnd");
const dvBoard = document.getElementById("dvBoard");


let gameStartTime;
let countdown;
let intervalUpdateTimer;
let timeoutConfirmEnd;
let bingo = false;
let board = [];

let allObjectives = [];
fetch("objectives.json")
.then((result) => result.json())
.then((values) => {
    allObjectives = values;
    populateBoard(true);
});


if (!localStorage.getItem("dontShowWelcome"))
{
    showWelcome();
}

btnStartGame.addEventListener("click", () => {
    beginCountdown();
    populateBoard(true);
    pTimer.textContent = "0:00:00";
    btnStartGame.style.display = "none";
    pCountdown.style.display = "block";
});

btnEndGame.addEventListener("click", () => {
    btnEndGame.style.display = "none";
    btnConfirmEnd.style.display = "block";
    timeoutConfirmEnd = setTimeout(() => {
        btnEndGame.style.display = "block";
        btnConfirmEnd.style.display = "none";
    }, 3000);
});

btnConfirmEnd.addEventListener("click", () => {
    clearInterval(intervalUpdateTimer);
    clearTimeout(timeoutConfirmEnd);
    btnStartGame.style.display = "block";
    btnConfirmEnd.style.display = "none";
    dvBoard.style.pointerEvents = "none";
});


function populateBoard(empty)
{
    dvBoard.replaceChildren();

    if (empty)
    {
        for (let i = 0; i < 25; i++)
        {
            const blankSquare = document.createElement("div");
            blankSquare.classList.add("dvObjective");
            dvBoard.appendChild(blankSquare);
        }
    }
    else
    {
        let indices = generateGameObjectiveIndices();
        board = [];

        for (let i = 0; i < 25; i++)
        {
            let index = indices[i];
            board.push(new Objective(allObjectives[index].text, allObjectives[index].amount, checkBingo));
            dvBoard.appendChild(board[i].element);
        }
    }
    
}

function generateGameObjectiveIndices()
{
    let indices = [];
    for (let i = 0; i < allObjectives.length; i++) indices.push(i);

    let start = 0;
    let temp = 0;

    for (let i = 0; i < indices.length - 1; i++)
    {
        let r = start + Math.floor(Math.random() * (indices.length - start));
        temp = indices[start];
        indices[start] = indices[r];
        indices[r] = temp;
        start++;
    }

    return indices;
}

function startGame()
{
    populateBoard(false);
    gameStartTime = Date.now();
    beginTimer();
    pCountdown.style.display = "none";
    btnEndGame.style.display = "block";
    dvBoard.style.pointerEvents = "auto";
}

function checkBingo()
{
    let rows = [true, true, true, true, true];
    let cols = [true, true, true, true, true];
    let diag = [true, true];

    for (let i = 0; i < 5; i++)
    {
        for (let j = 0; j < 5; j++)
        {
            rows[i] &= (board[j + i * 5].progress === board[j + i * 5].amount);
            cols[j] &= (board[j + i * 5].progress === board[j + i * 5].amount);
        }

        diag[0] &= board[i + i * 5].progress === board[i + i * 5].amount;
        diag[1] &= board[(4 - i) + i * 5].progress === board[(4 - i) + i * 5].amount;
    }

    let bingoThisCheck = false;

    for (let i = 0; i < 5; i++)
    {
        if (rows[i])
        {
            bingoThisCheck = true;
            break;
        }

        if (cols[i])
        {
            bingoThisCheck = true;
            break;
        }
    }

    if (diag[0] || diag[1]) bingoThisCheck = true;
    
    clearInterval(intervalUpdateTimer);
    if (bingoThisCheck)
    {
        clearTimeout(timeoutConfirmEnd);
        if (!bingo) updateTimerPrecise();
        bingo = true;
        btnStartGame.style.display = "block";
        btnEndGame.style.display = "none";
        btnConfirmEnd.style.display = "none";
    }
    else
    {
        bingo = false;
        updateTimer();
        beginTimer();
        btnStartGame.style.display = "none";
        btnEndGame.style.display = "block";
        btnConfirmEnd.style.display = "none";
    }

}

function beginCountdown()
{
    countdown = 3;
    pCountdown.textContent = countdown;
    setTimeout(updateCountdown, 1000);
}

function updateCountdown()
{
    countdown--;
    pCountdown.textContent = countdown;
    if (countdown > 0) setTimeout(updateCountdown, 1000);
    else startGame();
}

function beginTimer()
{
    intervalUpdateTimer = setInterval(updateTimer, 200);
}

function updateTimer()
{
    let seconds = Math.floor((Date.now() - gameStartTime) / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    pTimer.textContent = hours + ":" + minutes.toString().padStart(2, "0") + ":"
        + seconds.toString().padStart(2, "0");
}

function updateTimerPrecise()
{
    let seconds = (Date.now() - gameStartTime) / 1000;
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    let ms = (seconds - Math.floor(seconds)) * 1000;
    seconds = Math.floor(seconds);
    ms = Math.floor(ms / 10);

    pTimer.textContent = hours + ":" + minutes.toString().padStart(2, "0") + ":"
        + seconds.toString().padStart(2, "0") + "." + ms.toString().padStart(2, "0");
}

function getObjectives()
{
    let output = [];

    for (let obj of allObjectives)
    {
        output.push({"name": obj.text});
    }

    navigator.clipboard.writeText(JSON.stringify(output));

    alert("Objectives copied to clipboard");
}

function showWelcome()
{
    dvWelcomeBG.style.display = "block";
    dvWelcomeBorder.style.display = "block";
    dvWelcome.style.display = "block";
}

function hideWelcome()
{
    dvWelcomeBG.style.display = "none";
    dvWelcomeBorder.style.display = "none";
    dvWelcome.style.display = "none";
    localStorage.setItem("dontShowWelcome", true);
}