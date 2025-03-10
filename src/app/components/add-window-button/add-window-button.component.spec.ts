import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWindowButtonComponent } from './add-window-button.component';

describe('AddWindowButtonComponent', () => {
  let component: AddWindowButtonComponent;
  let fixture: ComponentFixture<AddWindowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWindowButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWindowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
