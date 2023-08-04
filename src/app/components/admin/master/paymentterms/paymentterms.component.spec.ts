import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymenttermsComponent } from './paymentterms.component';

describe('PaymenttermsComponent', () => {
  let component: PaymenttermsComponent;
  let fixture: ComponentFixture<PaymenttermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymenttermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymenttermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
