import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSlotComponent } from './patientslot.component';

describe('PatientSlotComponent', () => {
  let component: PatientSlotComponent;
  let fixture: ComponentFixture<PatientSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
