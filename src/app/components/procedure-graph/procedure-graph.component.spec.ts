import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureGraphComponent } from './procedure-graph.component';

describe('ProcedureGraphComponent', () => {
  let component: ProcedureGraphComponent;
  let fixture: ComponentFixture<ProcedureGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
