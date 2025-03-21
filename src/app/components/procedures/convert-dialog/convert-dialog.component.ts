import { Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { NgForOf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-convert-dialog',
  imports: [
    MatButton,
    MatLabel,
    MatDialogTitle,
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatInput,
    NgForOf,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './convert-dialog.component.html',
  styleUrl: './convert-dialog.component.scss',
})
export class ConvertDialogComponent {
  // Начальные настройки процедуры конвертации
  conversionParams = {
    inputFile: '',
    outputFile: '',
    dataFormat: 'I4', // I2, I4, R4
    sorting: 'SP', // SP, DP, OP
    preserveHeaders: true,
    byteSwap: false,
  };

  dataFormats = ['I2', 'I4', 'R4'];
  sortOptions = ['SP', 'DP', 'OP'];

  constructor(
    public dialogRef: MatDialogRef<ConvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      this.conversionParams = { ...this.conversionParams, ...data };
    }
  }

  // Обработчик выбора файла
  onFileSelected(event: Event, field: 'inputFile' | 'outputFile'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // В веб-приложении по соображениям безопасности не доступен полный путь к файлу.
      // Если используешь Electron, можно получить file.path.
      const file = input.files[0];
      // Например, если используешь Electron, то:
      this.conversionParams[field] = (file as any).path || file.name;
      // В браузере можно сохранить File объект, если это требуется.
      console.log(`Выбран файл для ${field}:`, this.conversionParams[field]);
    }
  }

  onSubmit(): void {
    console.log('Параметры конвертации:', this.conversionParams);
    this.dialogRef.close(this.conversionParams);
  }
}
