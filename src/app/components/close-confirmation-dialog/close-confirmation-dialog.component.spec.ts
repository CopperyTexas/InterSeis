import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseConfirmationDialogComponent } from './close-confirmation-dialog.component';

describe('CloseConfirmationDialogComponent', () => {
  let component: CloseConfirmationDialogComponent;
  let fixture: ComponentFixture<CloseConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
