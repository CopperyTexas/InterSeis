import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeContainerComponent } from './file-tree-container.component';

describe('FileTreeContainerComponent', () => {
  let component: FileTreeContainerComponent;
  let fixture: ComponentFixture<FileTreeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileTreeContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileTreeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
