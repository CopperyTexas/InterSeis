import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemComponentComponent } from './menu-item-component.component';

describe('MenuItemComponentComponent', () => {
  let component: MenuItemComponentComponent;
  let fixture: ComponentFixture<MenuItemComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
