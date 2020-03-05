class Board {
    constructor (Pieces=null, white=true) {
        this.Pieces = (Pieces == null ? this.setupPieces() : Pieces);
        this.white = white;
    }

    clone() {
        return new Board(this.Pieces.map(p => p.clone()), this.white);
    }

    setupPieces() { 
        let Pieces = [];
        Pieces.push(new   Rook( 0, false));
        Pieces.push(new Knight( 1, false));
        Pieces.push(new Bishop( 2, false));
        Pieces.push(new   King( 3, false));
        Pieces.push(new  Queen( 4, false));
        Pieces.push(new Bishop( 5, false));
        Pieces.push(new Knight( 6, false));
        Pieces.push(new   Rook( 7, false));
        Pieces.push(new   Pawn( 8, false));
        Pieces.push(new   Pawn( 9, false));
        Pieces.push(new   Pawn(10, false));
        Pieces.push(new   Pawn(11, false));
        Pieces.push(new   Pawn(12, false));
        Pieces.push(new   Pawn(13, false));
        Pieces.push(new   Pawn(14, false));
        Pieces.push(new   Pawn(15, false));

        Pieces.push(new   Pawn(48, true));
        Pieces.push(new   Pawn(49, true));
        Pieces.push(new   Pawn(50, true));
        Pieces.push(new   Pawn(51, true));
        Pieces.push(new   Pawn(52, true));
        Pieces.push(new   Pawn(53, true));
        Pieces.push(new   Pawn(54, true));
        Pieces.push(new   Pawn(55, true));
        Pieces.push(new   Rook(56, true));
        Pieces.push(new Knight(57, true));
        Pieces.push(new Bishop(58, true));
        Pieces.push(new   King(59, true));
        Pieces.push(new  Queen(60, true));
        Pieces.push(new Bishop(61, true));
        Pieces.push(new Knight(62, true));
        Pieces.push(new   Rook(63, true));
        return Pieces;
    }

    getPiece(i) {
        for (let index=0; index < this.Pieces.length; index++) {
            if (!this.Pieces[index].taken && this.Pieces[index].i == i) {
                return this.Pieces[index];
            }
        }
        return null;
    }

    show() {
        for (let i=0; i < 64; i++) {
            setcell(i, "");
        }
        for (let i=0; i < this.Pieces.length; i++) {
            if (!this.Pieces[i].taken) {
                setcell(this.Pieces[i].i, this.Pieces[i].char);
            }
        }
    }

    move(move) {
        let [from, to] = split(move);
        let moving = this.getPiece(from);
        let taking = this.getPiece(to);
        if (taking != null) {
            taking.taken = true;
        }
        if (moving instanceof Pawn) {
            moving.firstMove = false;
        }
        moving.i = to;
        this.white = !this.white;
    }

    generateboards() {
        let boards = [];
        let moves = this.generateMoves();
        for (var i = 0; i < moves.length; i++) {
            let newboard = this.clone();
            newboard.move(moves[i]);
            boards.push(newboard);
        }
        return boards;
    }

    generateMoves() {
        let moves = [];
        for (let i = 0; i < this.Pieces.length; i++) {
            if (!this.Pieces[i].taken && this.white == this.Pieces[i].white) {
                moves = moves.concat(this.Pieces[i].generateMoves(this));
            }
        }
        return moves;
    }

    gameover() {
        return this.generateMoves().length == 0;
    }

    score() {
        let total = 0;
        for (let i = 0; i < this.Pieces.length; i++) {
            if (!this.Pieces[i].taken) {
                total += this.Pieces[i].score;
            }
        }
        return -total;
    }
}