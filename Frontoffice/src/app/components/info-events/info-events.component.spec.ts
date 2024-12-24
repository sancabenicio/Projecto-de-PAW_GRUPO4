import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEventsComponent } from './info-events.component';

describe('InfoEventsComponent', () => {
  let component: InfoEventsComponent;
  let fixture: ComponentFixture<InfoEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoEventsComponent]
    });
    fixture = TestBed.createComponent(InfoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
