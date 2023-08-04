import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorloginComponent } from './doctorlogin.component';

describe('AdminloginComponent', () => {
  let component: DoctorloginComponent;
  let fixture: ComponentFixture<DoctorloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
