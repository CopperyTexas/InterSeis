import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureGraphCardComponent } from './procedure-graph-card.component';

describe('ProcedureGraphCardComponent', () => {
  let component: ProcedureGraphCardComponent;
  let fixture: ComponentFixture<ProcedureGraphCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureGraphCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureGraphCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
