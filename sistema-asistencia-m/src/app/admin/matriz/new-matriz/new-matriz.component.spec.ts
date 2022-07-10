import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMatrizComponent } from './new-matriz.component';

describe('NewMatrizComponent', () => {
  let component: NewMatrizComponent;
  let fixture: ComponentFixture<NewMatrizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMatrizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
