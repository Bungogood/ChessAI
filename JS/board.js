class Board {
    constructor (Pieces=null, white=true) {
        this.Pieces = (Pieces == null ? this.setupPieces() : Pieces);
        this.white = white;
        this.history = [];
        this.value = 0;
    }

    setupPieces() { 
        let Pieces = [];
        Pieces.push(new   Rook( 0, false));
        Pieces.push(new Knight( 1, false));
        Pieces.push(new Bishop( 2, false));
        Pieces.push(new   King( 4, false));
        Pieces.push(new  Queen( 3, false));
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
        Pieces.push(new   King(60, true));
        Pieces.push(new  Queen(59, true));
        Pieces.push(new Bishop(61, true));
        Pieces.push(new Knight(62, true));
        Pieces.push(new   Rook(63, true));
        return Pieces;
    }

    getPiece(i) {
        let index = this.getIndex(i);
        if (index < 0) {
            return null;
        } else {
            return this.Pieces[index];
        }
    }

    getIndex(i) {
        for (let index=0; index < this.Pieces.length; index++) {
            if (!this.Pieces[index].taken && this.Pieces[index].i == i) {
                return index;
            }
        }
        return -1;
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
        let moving = this.getIndex(from);
        let attacking = this.getIndex(to);
        let firstMove = false;
        let taking = false;
        this.value -= this.Pieces[moving].score();
        if (attacking != -1) {
            this.Pieces[attacking].taken = true;
            this.value -= this.Pieces[attacking].score();
            taking = true;
        } else {
            attacking = 0;
        }
        if (this.Pieces[moving] instanceof Pawn && this.Pieces[moving].firstMove) {
            this.Pieces[moving].firstMove = false;
            firstMove = true;
        }
        this.Pieces[moving].i = to;
        this.white = !this.white;
        this.value += this.Pieces[moving].score();
        this.history.push(encode(firstMove, from, moving, taking, attacking));
    }

    remove() {
        let [firstMove, from, moving, taking, attacking] = decode(this.history.pop());
        this.value -= this.Pieces[moving].score();
        if (taking) {
            this.Pieces[attacking].taken = false;
            this.value += this.Pieces[attacking].score();
        }
        if (firstMove && this.Pieces[moving] instanceof Pawn) {
            this.Pieces[moving].firstMove = true;
        }
        this.Pieces[moving].i = from;
        this.white = !this.white;
        this.value += this.Pieces[moving].score();
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
    
    Wordermoves(moves) {
        let bestscore = [];
        let tmp, tmpscore;
        for (let i = 0; i < Math.min(6,moves.length); i++) {
            this.move(moves[i]);
            bestscore.push(this.value);
            this.remove();
            for (let j = i; j > 0; j--) {
                if (bestscore[j] > bestscore[j-1]) {
                    tmpscore = bestscore[j-1];
                    bestscore[j-1] = bestscore[j];
                    bestscore[j] = tmpscore;
                    tmp = moves[j-1];
                    moves[j-1] = moves[j];
                    moves[j] = tmp;
                } else {
                    break;
                }
            }
        }
        for (let i = 6; i < moves.length; i++) {
            this.move(moves[i]);
            let score = this.value;
            this.remove();
            if (score > bestscore[5]) {
                bestscore[5] = score;
                tmp = moves[i];
                moves[i] = moves[5];
                moves[5] = tmp;
                for (let j = 5; j > 0; j--) {
                    if (bestscore[j] > bestscore[j-1]) {
                        tmpscore = bestscore[j-1];
                        bestscore[j-1] = bestscore[j];
                        bestscore[j] = tmpscore;
                        tmp = moves[j-1];
                        moves[j-1] = moves[j];
                        moves[j] = tmp;
                    } else {
                        break;
                    }
                }
            }
        }
        return moves;
    }

    Bordermoves(moves) {
        let bestscore = [];
        let tmp, tmpscore;
        for (let i = 0; i < Math.min(6,moves.length); i++) {
            this.move(moves[i]);
            bestscore.push(this.value);
            this.remove();
            for (let j = i; j > 0; j--) {
                if (bestscore[j] < bestscore[j-1]) {
                    tmpscore = bestscore[j-1];
                    bestscore[j-1] = bestscore[j];
                    bestscore[j] = tmpscore;
                    tmp = moves[j-1];
                    moves[j-1] = moves[j];
                    moves[j] = tmp;
                } else {
                    break;
                }
            }
        }
        for (let i = 6; i < moves.length; i++) {
            this.move(moves[i]);
            let score = this.value;
            this.remove();
            if (score < bestscore[5]) {
                bestscore[5] = score;
                tmp = moves[i];
                moves[i] = moves[5];
                moves[5] = tmp;
                for (let j = 5; j > 0; j--) {
                    if (bestscore[j] < bestscore[j-1]) {
                        tmpscore = bestscore[j-1];
                        bestscore[j-1] = bestscore[j];
                        bestscore[j] = tmpscore;
                        tmp = moves[j-1];
                        moves[j-1] = moves[j];
                        moves[j] = tmp;
                    } else {
                        break;
                    }
                }
            }
        }
        return moves;
    }
    
    eval(move) {
        this.move(move);
        let score = this.value;
        this.remove();
        return score;
    }

    gameover() {
        return this.generateMoves().length == 0;
    }

    score() {
        let total = 0;
        for (let i = 0; i < this.Pieces.length; i++) {
            if (!this.Pieces[i].taken) {
                total += this.Pieces[i].score();
            }
        }
        return total;
    }
}