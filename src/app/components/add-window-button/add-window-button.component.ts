import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-window-button',
  imports: [MatIconButton, MatTooltip, MatIcon],
  templateUrl: './add-window-button.component.html',
  styleUrl: './add-window-button.component.scss',
})
export class AddWindowButtonComponent {
  @Output() addWindow = new EventEmitter<void>();

  onClick(): void {
    this.addWindow.emit();
  }
}
