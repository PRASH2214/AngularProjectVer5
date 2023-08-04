import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeingComponent } from './ageing.component';

describe('AgeingComponent', () => {
  let component: AgeingComponent;
  let fixture: ComponentFixture<AgeingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
