import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { ProjectService } from '../../services/project.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-open-project-dialog',
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatIcon,
    MatDialogActions,
    MatIconButton,
    MatInput,
    MatButton,
    MatLabel,
    MatSuffix,
  ],
  templateUrl: './open-project-dialog.component.html',
  styleUrl: './open-project-dialog.component.scss',
})
export class OpenProjectDialogComponent {
  openProjectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OpenProjectDialogComponent>,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private fileService: FileService,
  ) {
    this.openProjectForm = this.fb.group({
      filePath: ['', Validators.required],
    });
  }

  async onSelectFolder(): Promise<void> {
    try {
      // Метод selectProjectFile должен открывать диалог выбора файла с фильтром .ips
      const filePath = await this.fileService.selectProjectFile();
      if (filePath) {
        this.openProjectForm.patchValue({ filePath });
      }
    } catch (error) {
      console.error('Ошибка выбора файла проекта:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.openProjectForm.valid) {
      const { filePath } = this.openProjectForm.value;
      try {
        // Считываем содержимое файла проекта (предполагается, что readProject возвращает уже распарсенный объект)
        const projectData = await this.fileService.readProject(filePath);
        // Обновляем глобальное состояние проекта
        this.projectService.setProjectInfo(projectData);
        console.log('Проект открыт:', projectData);
        // Закрываем диалог и возвращаем данные проекта (при необходимости)
        this.dialogRef.close(projectData);
      } catch (error) {
        console.error('Ошибка при открытии проекта:', error);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
