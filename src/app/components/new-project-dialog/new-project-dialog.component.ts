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
import { ProjectService } from '../../services/project.service';

declare const window: any; // Декларация Electron API

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
    private projectService: ProjectService,
  ) {
    this.projectForm = this.fb.group({
      objectName: ['', Validators.required],
      profileName: ['', Validators.required],
      folderPath: ['', Validators.required],
    });
  }

  async onSelectFolder(): Promise<void> {
    try {
      window.electron.sendLog('🟢 Открытие диалога выбора папки...');
      const result = await this.fileService.selectFolder();

      if (result && result.folderPath) {
        this.projectForm.patchValue({ folderPath: result.folderPath });
        window.electron.sendLog(`📂 Папка выбрана: ${result.folderPath}`);
      } else {
        window.electron.sendLog('⚠️ Выбор папки отменён пользователем.');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Ошибка выбора папки:', err);
      window.electron.sendLog(`❌ Ошибка выбора папки: ${err.message}`);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      window.electron.sendLog('📌 Начало создания проекта...');
      window.electron.sendLog(
        `📊 Данные проекта: ${JSON.stringify(projectData)}`,
      );

      try {
        const filePath = await this.fileService.createProject(projectData);
        window.electron.sendLog(`✅ Файл проекта создан: ${filePath}`);

        const projectContent = await this.fileService.readProject(filePath);
        window.electron.sendLog('📖 Файл проекта прочитан.');

        this.projectService.setProjectInfo(projectContent);
        window.electron.sendLog('🔄 Данные проекта загружены в сервис.');

        this.dialogRef.close(projectContent);
      } catch (error) {
        const err = error as Error;
        console.error('Ошибка создания/открытия проекта:', err);
        window.electron.sendLog(
          `❌ Ошибка создания/открытия проекта: ${err.message}`,
        );
      }
    } else {
      window.electron.sendLog('⚠️ Форма проекта невалидна.');
    }
  }

  onCancel(): void {
    window.electron.sendLog('🚪 Создание проекта отменено пользователем.');
    this.dialogRef.close(null);
  }
}
