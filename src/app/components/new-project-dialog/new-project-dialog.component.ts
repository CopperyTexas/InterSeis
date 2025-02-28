import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-new-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './new-project-dialog.component.html',
  styleUrl: './new-project-dialog.component.scss',
})
export class NewProjectDialogComponent {
  projectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
    private fb: FormBuilder,
    private fileService: FileService,
  ) {
    this.projectForm = this.fb.group({
      objectName: ['', Validators.required],
      profileName: ['', Validators.required],
      folderPath: ['', Validators.required],
    });
  }

  async onSelectFolder(): Promise<void> {
    try {
      const result = await this.fileService.selectFolder();
      if (result && result.folderPath) {
        this.projectForm.patchValue({ folderPath: result.folderPath });
      }
    } catch (error) {
      console.error('Ошибка выбора папки:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      try {
        const filePath = await this.fileService.createProject(projectData);
        console.log('Файл проекта создан:', filePath);
        this.dialogRef.close({ ...projectData, filePath });
      } catch (error) {
        console.error('Ошибка создания проекта:', error);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
