import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilleTreeOptionsComponent } from './fille-tree-options.component';

describe('FilleTreeOptionsComponent', () => {
  let component: FilleTreeOptionsComponent;
  let fixture: ComponentFixture<FilleTreeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilleTreeOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilleTreeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
