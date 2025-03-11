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
  selector: 'app-save-project-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  templateUrl: './save-project-dialog.component.html',
  styleUrl: './save-project-dialog.component.scss',
})
export class SaveProjectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaveProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object,
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
