import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-folder-name-dialog',
  templateUrl: './folder-name-dialog.component.html',
  imports: [
    MatDialogContent,
    MatFormField,
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatInput,
    MatDialogTitle,
    MatLabel,
  ],
})
export class FolderNameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FolderNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { folderName: string },
  ) {}

  // Закрыть диалог, возвращая введённое имя или null при отмене
  onCancel(): void {
    this.dialogRef.close(null);
  }
}
