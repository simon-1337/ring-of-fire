import { Component } from '@angular/core';
import { addDoc, collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {


  private coll: CollectionReference<DocumentData>;

  
  constructor(private firestore: Firestore, private router: Router) {
    this.coll = collection(this.firestore, 'games');
   }


  //Start Game
  newGame() {
    let game = new Game();  
    addDoc(this.coll, game.toJson()).then( (gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}
