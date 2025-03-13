import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgForOf } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-logs',
  imports: [MatButton, NgForOf],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnInit {
  logs: string[] = [];

  ngOnInit(): void {
    if (window.electron) {
      window.electron.onLog((message: string) => {
        this.logs.push(message);
      });

      // Отправляем тестовый лог
      window.electron.sendLog('Логирование запущено...');
    }
  }

  clearLogs(): void {
    this.logs = [];
  }
}
