import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { NgForOf } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FileService } from '../../../services/file.service';

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
    MatIconModule,
    MatIcon,
    ReactiveFormsModule,
    MatSuffix,
  ],
  templateUrl: './convert-dialog.component.html',
  styleUrl: './convert-dialog.component.scss',
})
export class ConvertDialogComponent implements OnInit {
  convertForm!: FormGroup;

  dataFormats = ['I2', 'I4', 'R4'];
  sortOptions = ['SP', 'DP', 'OP'];

  constructor(
    private fileService: FileService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConvertDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.convertForm = this.fb.group({
      inputFile: ['', Validators.required],
      outputFile: ['', Validators.required],
      dataFormat: ['I4', Validators.required],
      sorting: ['SP', Validators.required],
      preserveHeaders: [true],
      byteSwap: [false],
    });
  }

  // Метод для открытия диалога выбора входного файла (.pc)
  onSelectInputFile(): void {
    this.fileService
      .openFileDialog({
        title: 'Выберите PC-файл',
        filters: [{ name: 'PC Files', extensions: ['pc'] }],
        properties: ['openFile'],
      })
      .then((filePath) => {
        if (filePath && filePath.length > 0) {
          this.convertForm.patchValue({ inputFile: filePath[0] });
        }
      })
      .catch((err) => console.error('Ошибка выбора входного файла:', err));
  }

  // Метод для открытия диалога выбора выходного файла (.segy)
  onSelectOutputFile(): void {
    this.fileService
      .openSaveDialog({
        title: 'Сохранить SEG-Y файл',
        defaultPath: 'output.segy', // можно задать значение по умолчанию
        filters: [{ name: 'SEG-Y Files', extensions: ['segy'] }],
      })
      .then((filePath: string) => {
        if (filePath) {
          this.convertForm.patchValue({ outputFile: filePath });
        }
      })
      .catch((err) => console.error('Ошибка выбора выходного файла:', err));
  }

  onSubmit(): void {
    if (this.convertForm.valid) {
      console.log('Параметры конвертации:', this.convertForm.value);
      this.dialogRef.close(this.convertForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
