/*
King	♔ : ♚   900
Queen	♕ : ♛   90
Rook	♖ : ♜   50
Bishop	♗ : ♝   30
Knight	♘ : ♞   30
Pawn	♙ : ♟   10
*/

function move(from, to) {return (from << 6) | to}
function split(move) {return [move >> 6, move & 63]}
function xytoi(x, y) {return (y << 3) | x}
function itoxy(i) {return [i & 7, i >> 3]}

function t(n, s, num) {return (n >> s) & 2**(num)-1}
function decode(n) {return [t(n,17,1),t(n,11,6),t(n,6,5),t(n,5,1),t(n,0,5)]}
function encode(fm, f, m, t, a) {return (fm<<17) + (f<<11) + (m<<6) + (t<<5) + a}

class Piece {
    constructor (i, white, taken) {
        this.i = i;
        this.white = white;
        this.taken = taken;
    }
    
    withinBounds(x, y) {
        return x >= 0 && y >= 0 && x < 8 && y < 8;
    }

    line(dx, dy, b) {
        let moves = [];
        let [x, y] = itoxy(this.i);
        x += dx;
        y += dy;
        let attacking = b.getPiece(xytoi(x, y));
        while (this.withinBounds(x, y) && attacking == null) {
            moves.push(move(this.i, xytoi(x, y)));
            x += dx;
            y += dy;
            attacking = b.getPiece(xytoi(x, y));
        }
        if (this.withinBounds(x, y) && attacking != null && attacking.white != this.white) {
            moves.push(move(this.i, xytoi(x, y)));
        }
        return moves;
    }

    validMove(x, y, moves) {
        if (this.withinBounds(x, y)) {
            let attacking = b.getPiece(xytoi(x, y));
            if (attacking == null || attacking.white != this.white) {
                moves.push(move(this.i, xytoi(x, y)));
            }
        }
    }

    score() {
        let [x, y] = itoxy(this.i);
        if (this.white) {
            return this.value + this.table[y][x];
        } else {
            return this.value - this.table[7-y][7-x];
        }
    }
}

class King extends Piece {
    constructor (i, white, taken=false) {
        super(i, white, taken);
        this.char = white ? "♔" : "♚";
        this.value = white ? 900 : -900;
        this.table = [
            [-3.0,-4.0,-4.0,-5.0,-5.0,-4.0,-4.0,-3.0],
            [-3.0,-4.0,-4.0,-5.0,-5.0,-4.0,-4.0,-3.0],
            [-3.0,-4.0,-4.0,-5.0,-5.0,-4.0,-4.0,-3.0],
            [-3.0,-4.0,-4.0,-5.0,-5.0,-4.0,-4.0,-3.0],
            [-2.0,-3.0,-3.0,-4.0,-4.0,-3.0,-3.0,-2.0],
            [-1.0,-2.0,-2.0,-2.0,-2.0,-2.0,-2.0,-1.0],
            [ 2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
            [ 2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
        ];
    }
    
    generateMoves(b) {
        let moves = [];
        let [x, y] = itoxy(this.i);
        for (let dy=-1; dy<2; dy++) {
            for (let dx=-1; dx<2; dx++) {
                if (!(dy == 0 && dx == 0) && this.withinBounds(x+dx, y+dy)) {
                    let attacking = b.getPiece(xytoi(x+dx, y+dy));
                    if (!(attacking != null && attacking.white == this.white)) {
                        moves.push(move(this.i, xytoi(x+dx, y+dy)));
                    }
                }
            }
        }
        return moves;
    }
}

class Queen extends Piece {
    constructor (i, white, taken=false) {
        super(i, white, taken);
        this.char = white ? "♕" : "♛";
        this.value = white ? 90 : -90;
        this.table = [
            [-2.0,-1.0,-1.0,-0.5,-0.5,-1.0,-1.0,-2.0],
            [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,-1.0],
            [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0,-1.0],
            [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0,-0.5],
            [ 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0,-0.5],
            [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0,-1.0],
            [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0,-1.0],
            [-2.0,-1.0,-1.0,-0.5,-0.5,-1.0,-1.0,-2.0]
        ];
    }
    
    generateMoves(b) {
        let moves = [];
        moves = moves.concat(this.line( 0, 1, b));
        moves = moves.concat(this.line( 0,-1, b));
        moves = moves.concat(this.line( 1, 0, b));
        moves = moves.concat(this.line(-1, 0, b));
        moves = moves.concat(this.line( 1, 1, b));
        moves = moves.concat(this.line( 1,-1, b));
        moves = moves.concat(this.line(-1, 1, b));
        moves = moves.concat(this.line(-1,-1, b));
        return moves;
    }
}

class Rook extends Piece {
    constructor (i, white, taken=false) {
        super(i, white, taken);
        this.char = white ? "♖" : "♜";
        this.value = white ? 50 : -50;
        this.table = [
            [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [ 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
            [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,-0.5],
            [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,-0.5],
            [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,-0.5],
            [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,-0.5],
            [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,-0.5],
            [ 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
        ];
    }

    generateMoves(b) {
        let moves = [];
        moves = moves.concat(this.line( 0, 1, b));
        moves = moves.concat(this.line( 0,-1, b));
        moves = moves.concat(this.line( 1, 0, b));
        moves = moves.concat(this.line(-1, 0, b));
        return moves;
    }
}

class Bishop extends Piece {
    constructor (i, white, taken=false) {
        super(i, white, taken);
        this.char = white ? "♗" : "♝";
        this.value = white ? 30 : -30;
        this.table = [
            [-2.0,-1.0,-1.0,-1.0,-1.0,-1.0,-1.0,-2.0],
            [-1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,-1.0],
            [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0,-1.0],
            [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5,-1.0],
            [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,-1.0],
            [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,-1.0],
            [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5,-1.0],
            [-2.0,-1.0,-1.0,-1.0,-1.0,-1.0,-1.0,-2.0]
        ];
    }

    generateMoves(b) {
        let moves = [];
        moves = moves.concat(this.line( 1, 1, b));
        moves = moves.concat(this.line( 1,-1, b));
        moves = moves.concat(this.line(-1, 1, b));
        moves = moves.concat(this.line(-1,-1, b));
        return moves;
    }
}

class Knight extends Piece {
    constructor (i, white, taken=false) {
        super(i, white, taken);
        this.char = white ? "♘" : "♞";
        this.value = white ? 30 : -30;
        this.table = [
            [-5.0,-4.0,-3.0,-3.0,-3.0,-3.0,-4.0,-5.0],
            [-4.0,-2.0, 0.0, 0.0, 0.0, 0.0,-2.0,-4.0],
            [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0,-3.0],
            [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5,-3.0],
            [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0,-3.0],
            [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5,-3.0],
            [-4.0,-2.0, 0.0, 0.5, 0.5, 0.0,-2.0,-4.0],
            [-5.0,-4.0,-3.0,-3.0,-3.0,-3.0,-4.0,-5.0]
        ];
    }
    
    generateMoves(b) {
        let moves = [];
        let [x, y] = itoxy(this.i);
        this.validMove(x-1, y-2, moves);
        this.validMove(x+1, y-2, moves);
        this.validMove(x-1, y+2, moves);
        this.validMove(x+1, y+2, moves);
        this.validMove(x-2, y-1, moves);
        this.validMove(x+2, y-1, moves);
        this.validMove(x-2, y+1, moves);
        this.validMove(x+2, y+1, moves);
        return moves;
    }
}

class Pawn extends Piece {
    constructor (i, white, taken=false, firstMove=true) {
        super(i, white, taken);
        this.firstMove = firstMove;
        this.char = white ? "♙" : "♟";
        this.value = white ? 10 : -10;
        this.table = [
            [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [ 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
            [ 1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
            [ 0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
            [ 0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
            [ 0.5,-0.5,-1.0, 0.0, 0.0,-1.0,-0.5, 0.5],
            [ 0.5, 1.0, 1.0,-2.0,-2.0, 1.0, 1.0, 0.5],
            [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        ];
    }
    
    generateMoves(b) {
        let moves = [];
        let [x, y] = itoxy(this.i);
        let dy = this.white ? -1 : 1;
        if (this.withinBounds(x, y+dy)) {
            let attacking = b.getPiece(xytoi(x, y+dy));
            if (attacking == null) {
                moves.push(move(this.i, xytoi(x, y+dy)));
                if (this.firstMove) {
                    attacking = b.getPiece(xytoi(x, y+2*dy));
                    if (attacking == null) {
                        moves.push(move(this.i, xytoi(x, y+2*dy)));
                    }
                }
            }
        }
        if (this.withinBounds(x+1, y+dy)) {
            let attacking = b.getPiece(xytoi(x+1, y+dy));
            if (attacking != null && attacking.white != this.white) {
                moves.push(move(this.i, xytoi(x+1, y+dy)));
            }
        }
        if (this.withinBounds(x-1, y+dy)) {
            let attacking = b.getPiece(xytoi(x-1, y+dy));
            if (attacking != null && attacking.white != this.white) {
                moves.push(move(this.i, xytoi(x-1, y+dy)));
            }
        }
        return moves;
    }
}