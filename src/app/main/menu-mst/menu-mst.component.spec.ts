import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMstComponent } from './menu-mst.component';

describe('MenuComponent', () => {
  let component: MenuMstComponent;
  let fixture: ComponentFixture<MenuMstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuMstComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
