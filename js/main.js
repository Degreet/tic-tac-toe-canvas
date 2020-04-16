let gameState = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
]

const points = [
    [60, 60], [150, 60], [240, 60],
    [60, 150], [150, 150], [240, 150],
    [60, 240], [150, 240], [240, 240]
]

const coords = {
    '60,60': [0, 0],
    '150,60': [0, 1],
    '240,60': [0, 2],
    '60,150': [1, 0],
    '150,150': [1, 1],
    '240,150': [1, 2],
    '60,240': [2, 0],
    '150,240': [2, 1],
    '240,240': [2, 2]
}

const cells = {
    '0,0': [60, 60],
    '0,1': [150, 60],
    '0,2': [240, 60],
    '1,0': [60, 150],
    '1,1': [150, 150],
    '1,2': [240, 150],
    '2,0': [60, 240],
    '2,1': [150, 240],
    '2,2': [240, 240]
}

const lines = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
]

const ctx = canvas.getContext('2d')
let turn = 'player'

// canvas.onclick = function (event) {
//     const point = points.find(point => isClose(...point, event.layerX, event.layerY))
//     if (!point) return
//     const [row, col] = coords[point.join()]
//     if (gameState[row][col] == " ") {
//         drawX(...point)
//         gameState[row][col] = "X"
//     }
// }

canvas.onclick = player

function player(event) {
    if (turn !== "player") return

    const point = points.find(point => isClose(...point, event.layerX, event.layerY))
    if (!point) return
    const [row, col] = coords[point.join()]
    let val = gameState[row][col]

    if (val !== " ") {
        return
    } else {
        gameState[row][col] = "X"
        drawX(...point)
    }

    turn = "opponent"
    if (checkWinner()) return
    setTimeout(opponent, 800)
}

let level = 1

function opponent() {
    let row, col, val
    let bestMove = find2of3("O") || find2of3("X")

    if (Math.random() > level) {
        bestMove = 0
    }

    if (!bestMove) {
        do {
            row = rnd(3)
            col = rnd(3)
            val = gameState[row][col]
        } while (val !== " ")
    } else {
        row = bestMove[0]
        col = bestMove[1]
    }

    gameState[row][col] = "O"
    const point = cells[[row, col].join()]
    drawO(...point)
    if (checkWinner()) return
    turn = "player"
}

function find2of3(sign) {
    for (let i = 0; i < 8; i++) {
        const line = lines[i]
        const str = gameState[line[0][0]][line[0][1]] + gameState[line[1][0]][line[1][1]] +
                    gameState[line[2][0]][line[2][1]]
        if (str == sign + sign + " " || str ==  sign + " " + sign || str == " " + sign + sign) {
            for (let j = 0; j < 3; j++) {
                if (gameState[line[j][0]][line[j][1]] == " ") {
                    return line[j]
                }
            }
        }
    }
}

function checkWinner() {
    let win = isFinished()
    if (win == "player") {
        return msg.innerText = "Вы выиграли!"
    } else if (win == "opponent") {
        return msg.innerText = "Вы проиграли!"
    } else if (win == "draw") {
        return msg.innerText = "Ничья!"
    }
}

function isFinished() {
    for (let i = 0; i < 8; i++) {
        const line = lines[i]
        const str = gameState[line[0][0]][line[0][1]] + gameState[line[1][0]][line[1][1]] +
                    gameState[line[2][0]][line[2][1]]
        if (str == "XXX") {
            return "player"
        } else if (str == "OOO") {
            return "opponent"
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] == " ") {
                return
            }
        }
    }

    return "draw"
}

function isClose(x1, y1, x2, y2) {
    if (Math.abs(x1 - x2) < 40 && Math.abs(y1 - y2) < 40) return true
}

function paintField() {
    drawTiltedLine(20, 110, 280, 110)
    drawTiltedLine(20, 190, 280, 190)
    drawTiltedLine(110, 20, 110, 280)
    drawTiltedLine(190, 20, 190, 280)
}

function drawX(x, y) {
    // drawLine(x - 30, y - 30, x + 30, y + 30)
    // drawLine(x + 30, y - 30, x - 30, y + 30)

    drawLine((3 - rnd(7)) + x - 25, (3 - rnd(7)) + y - 25, (3 - rnd(7)) + x + 25, (3 - rnd(7)) + y + 25)
    drawLine((3 - rnd(7)) + x + 25, (3 - rnd(7)) + y - 25, (3 - rnd(7)) + x - 25, (3 - rnd(7)) + y + 25)
}

function drawO(x, y) {
    ctx.beginPath()
    ctx.ellipse(x, y, (3 - rnd(7)) + 25, (3 - rnd(7)) + 25, Math.random() * 7, 0, 7)
    ctx.stroke()
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function drawTiltedLine(x1, y1, x2, y2) {
    drawLine( (5 - rnd(11)) + x1, (5 - rnd(11)) + y1, (5 - rnd(11)) + x2, (5 - rnd(11)) + y2 )
}

function rnd(num) {
    return Math.floor(Math.random() * num)
}

reload.onclick = function () {
    location.reload()
}

ctx.lineWidth = 2
paintField()
// drawX(150, 150)
// drawO(150, 60)

// points.forEach(point => drawX(...point))
// points.forEach(point => drawO(...point))