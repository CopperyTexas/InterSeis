import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadFileDialogComponent } from './read-file-dialog.component';

describe('ReadFileDialogComponent', () => {
  let component: ReadFileDialogComponent;
  let fixture: ComponentFixture<ReadFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadFileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
