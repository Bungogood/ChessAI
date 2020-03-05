const cells = document.querySelectorAll('.cell');
var b = new Board();
var current = null;

function setup() {
	for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick);
    }
}

function turnClick(e) {
    let i = eval(e.target.id);
    let selected = b.getPiece(i);
    if (current != null) {
        unhighlight(current);
    }
    if (selected != null && selected.white == b.white) {
        highlight(selected);
        current = selected;
    } else if (current != null) {
        unhighlight(current);
        let test = move(current.i, i);
        let moves = current.generateMoves(b);
        for (let index=0; index<moves.length; index++) {
            if (moves[index] == test) {
                b.move(test);
                ai();
                b.show();
                break;
            }
        }
        current = null;
    }
}

function highlight(piece) {
    moves = piece.generateMoves(b);
    for (let i = 0; i < moves.length; i++) {
        colour(split(moves[i])[1], "yellow");
    }
}

function unhighlight(piece) {
    moves = piece.generateMoves(b);
    for (let i = 0; i < moves.length; i++) {
        colour(split(moves[i])[1], null);
    }
}

function colour(i, col) {
    cells[i].style.backgroundColor = col;  
}

function setcell(i, char) {cells[i].innerText = char}

function ai() {let start = performance.now();
    b.move(minimax(b));
    console.log(performance.now() - start);
    b.show()
}

setup();
b.show();