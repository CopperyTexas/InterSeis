import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewProjectData } from '../../interfaces/new-prodect-data.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-project-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './new-project-dialog.component.html',
  styleUrl: './new-project-dialog.component.scss',
})
export class NewProjectDialogComponent {
  projectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewProjectData,
    private fb: FormBuilder,
  ) {
    this.projectForm = this.fb.group({
      objectName: [data.objectName || '', Validators.required],
      profileName: [data.profileName || '', Validators.required],
      folderPath: [data.folderPath || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
