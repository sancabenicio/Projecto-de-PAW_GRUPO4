import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPropertiesComponent } from './info-properties.component';

describe('InfoPropertiesComponent', () => {
  let component: InfoPropertiesComponent;
  let fixture: ComponentFixture<InfoPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPropertiesComponent]
    });
    fixture = TestBed.createComponent(InfoPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
