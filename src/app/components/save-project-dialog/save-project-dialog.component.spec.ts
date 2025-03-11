import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveProjectDialogComponent } from './save-project-dialog.component';

describe('SaveProjectDialogComponent', () => {
  let component: SaveProjectDialogComponent;
  let fixture: ComponentFixture<SaveProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveProjectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
