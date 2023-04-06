import { Component, inject, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { addDoc, collection, collectionData, CollectionReference, doc, docData, DocumentData, DocumentSnapshot, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  game !: Game;
  
  docSnap: any;
  docRef: any;

  gameId: string;
  
  game$: Observable<any>;

  private coll: CollectionReference<DocumentData>;


  constructor(private firestore: Firestore, private route: ActivatedRoute, public dialog: MatDialog) { 
    this.coll = collection(this.firestore, 'games');
   }


  ngOnInit() {
    this.newGame();
    this.setRoute();
    this.setCurrentGame()
  }


  setRoute() {
    this.route.params.subscribe( (params) => {
      this.gameId = params['id'];
    });
  }


  setCurrentGame() {
    this.docRef = doc(this.coll, this.gameId);
    this.game$ = docData(this.docRef);
    this.game$.subscribe( (game: any) =>  {  
       const currentGame = game;
       console.log(currentGame);
       this.game.playedCards = game.playedCards;
       this.game.players = game.players;
       this.game.stack = game.stack;
       this.game.currentPlayer = game.currentPlayer;
       this.game.pickCardAnimation = game.pickCardAnimation;
       this.game.currentCard = game.currentCard;
    });
  }


  newGame() {
    this.game = new Game();
  }

  //Whenever a player does an action, the data in firebase needs to be updated
  saveGame() {
    updateDoc(this.docRef, this.game.toJson());
  }


  takeCard() {
    if (!this.game.pickCardAnimation)
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % (this.game.players.length);
    this.saveGame();
    setTimeout(() => {
      this.game.pickCardAnimation = false;
      this.game.playedCards.push(this.game.currentCard);
      this.saveGame();
    }, 1000);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

}


