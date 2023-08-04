import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePrivsComponent } from './role-privs.component';

describe('RolePrivsComponent', () => {
  let component: RolePrivsComponent;
  let fixture: ComponentFixture<RolePrivsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePrivsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePrivsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
