import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {

  allProfilePictures = ['1.webp', 'female1.png', 'cat.png', 'dog.png', 'dog2.png', 'panda.png', 'cat2.png']

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>,) { }
}
