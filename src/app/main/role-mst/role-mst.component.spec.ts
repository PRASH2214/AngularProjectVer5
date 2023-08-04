import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMstComponent } from './role-mst.component';

describe('RoleMstComponent', () => {
  let component: RoleMstComponent;
  let fixture: ComponentFixture<RoleMstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
