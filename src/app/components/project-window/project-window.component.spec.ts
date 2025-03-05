import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWindowComponent } from './project-window.component';

describe('ProjectWindowComponent', () => {
  let component: ProjectWindowComponent;
  let fixture: ComponentFixture<ProjectWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
