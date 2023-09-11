import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieBarChartComponent } from './pie-bar-chart.component';

describe('PieBarChartComponent', () => {
  let component: PieBarChartComponent;
  let fixture: ComponentFixture<PieBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
