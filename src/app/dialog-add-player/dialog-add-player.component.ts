import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';




@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>,) { }

  name: string = '';


  /**
   * This funtion is used to close the dialog window where players can be added 
   */
  onNoClick() {
    this.dialogRef.close();
  }
}
