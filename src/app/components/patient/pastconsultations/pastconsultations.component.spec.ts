import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastConsultationsComponent } from './pastconsultations.component';

describe('PastConsultationsComponent', () => {
  let component: PastConsultationsComponent;
  let fixture: ComponentFixture<PastConsultationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastConsultationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
