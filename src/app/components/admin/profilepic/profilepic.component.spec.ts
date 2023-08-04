import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfilePicComponent } from './profilepic.component';

describe('AdminProfilePicComponent', () => {
  let component: AdminProfilePicComponent;
  let fixture: ComponentFixture<AdminProfilePicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProfilePicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProfilePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
