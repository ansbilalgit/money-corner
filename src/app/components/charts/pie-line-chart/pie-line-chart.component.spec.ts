import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieLineChartComponent } from './pie-line-chart.component';

describe('PieLineChartComponent', () => {
  let component: PieLineChartComponent;
  let fixture: ComponentFixture<PieLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
