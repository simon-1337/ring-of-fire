import { Component, inject, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { addDoc, collection, collectionData, CollectionReference, doc, docData, DocumentData, DocumentSnapshot, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{

  game !: Game;

  gameOver = false;
  
  docSnap: any;
  docRef: any;

  gameId: string;
  
  game$: Observable<any>;

  private coll: CollectionReference<DocumentData>;


  constructor(private firestore: Firestore, private route: ActivatedRoute, public dialog: MatDialog) { 
    this.coll = collection(this.firestore, 'games');
   }


   /**
    * This function is used to initialize the game
    */
  ngOnInit() {
    this.newGame();
    this.setRoute();
    this.setCurrentGame()
  }


  /**
   * This function is used to get the game id from the url
   */
  setRoute() {
    this.route.params.subscribe( (params) => {
      this.gameId = params['id'];
    });
  }


  /**
   * This function is used get the game from the database and subscribe to it to get the updates
   */
  setCurrentGame() {
    this.docRef = doc(this.coll, this.gameId);
    this.game$ = docData(this.docRef);
    this.game$.subscribe( (game: any) =>  {  
       this.getDataFromFirestore(game);
    });
  }


  /**
   * This function is used to save the data from the database in the local game variables
   * 
   * @param game - The game loaded from the database
   */
  getDataFromFirestore(game) {
    this.game.playedCards = game.playedCards;
    this.game.players = game.players;
    this.game.playerImages = game.playerImages;
    this.game.stack = game.stack;
    this.game.currentPlayer = game.currentPlayer;
    this.game.pickCardAnimation = game.pickCardAnimation;
    this.game.currentCard = game.currentCard;
  }


  /**
   * This function is used to start a new Game
   */
  newGame() {
    this.game = new Game();
  }


  /**
   * This function updates the data in firebase
   */
  saveGame() {
    updateDoc(this.docRef, this.game.toJson());
  }


  /**
   * This function is used to take a card from the stack, play the animations, and save the changes to the firestore database
   */
  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.players.length > 1) {
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
  }


  /**
   * This function is used to open the window to add a new player
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('1.webp')
        this.saveGame();
      }
    });
  }


  /**
   * This function is used to edit the players image or to delete the player
   * 
   * @param playerId - The id of the player that will be edited
   */
  editPlayer(playerId: number) {   
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == "DELETE") {
          this.game.players.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

}


