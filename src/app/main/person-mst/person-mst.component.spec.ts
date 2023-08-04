import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonMstComponent } from './person-mst.component';

describe('PersonMstComponent', () => {
  let component: PersonMstComponent;
  let fixture: ComponentFixture<PersonMstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonMstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
