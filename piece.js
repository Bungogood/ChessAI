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
            if (attacking == null || (attacking != null && attacking.white != this.white)) {
                moves.push(move(this.i, xytoi(x, y)));
            }
        }
    }
}

class King extends Piece {
    constructor (i, white, taken=false) {
        super(i, white, taken);
        this.char = white ? "♔" : "♚";
        this.score = white ? 900 : -900;
    }

    clone() {
        return new King(this.i, this.white, this.taken);
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
        this.score = white ? 90 : -90;
    }

    clone() {
        return new Queen(this.i, this.white, this.taken);
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
        this.score = white ? 50 : -50;
    }

    clone() {
        return new Rook(this.i, this.white, this.taken);
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
        this.score = white ? 30 : -30;
    }

    clone() {
        return new Bishop(this.i, this.white, this.taken);
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
        this.score = white ? 30 : -30;
    }

    clone() {
        return new Knight(this.i, this.white, this.taken);
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
        this.score = white ? 10 : -10;
    }

    clone() {
        return new Pawn(this.i, this.white, this.taken, this.firstMove);
    }
    
    generateMoves(b) {
        let moves = [];
        let [x, y] = itoxy(this.i);
        let dy = this.white ? -1 : 1;
        if (this.firstMove) {
            let attacking = b.getPiece(xytoi(x, y+2*dy));
            if (attacking == null) {
                moves.push(move(this.i, xytoi(x, y+2*dy)));
            }
        }
        if (this.withinBounds(x, y+dy)) {
            let attacking = b.getPiece(xytoi(x, y+dy));
            if (attacking == null) {
                moves.push(move(this.i, xytoi(x, y+dy)));
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