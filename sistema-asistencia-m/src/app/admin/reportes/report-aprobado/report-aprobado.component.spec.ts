import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAprobadoComponent } from './report-aprobado.component';

describe('ReportAprobadoComponent', () => {
  let component: ReportAprobadoComponent;
  let fixture: ComponentFixture<ReportAprobadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAprobadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAprobadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
