import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminloginOTPComponent } from './adminloginotp.component';

describe('AdminloginOTPComponent', () => {
  let component: AdminloginOTPComponent;
  let fixture: ComponentFixture<AdminloginOTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminloginOTPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminloginOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
