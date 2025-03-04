import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-read-file-dialog',
  imports: [MatDialogContent, MatDialogTitle, MatButton, MatDialogActions],
  templateUrl: './read-file-dialog.component.html',
  styleUrl: './read-file-dialog.component.scss',
})
export class ReadFileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReadFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: string },
  ) {}
}
