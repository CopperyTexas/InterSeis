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
  selector: 'app-close-confirmation-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  templateUrl: './close-confirmation-dialog.component.html',
  styleUrl: './close-confirmation-dialog.component.scss',
})
export class CloseConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CloseConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  closeDialog(choice: string): void {
    this.dialogRef.close(choice);
  }
}
