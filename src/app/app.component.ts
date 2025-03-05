import { Component } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { ProjectWindowComponent } from './components/project-window/project-window.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, ProjectWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'InterSeis';
}
