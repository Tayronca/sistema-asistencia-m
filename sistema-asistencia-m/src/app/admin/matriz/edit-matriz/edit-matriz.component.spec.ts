import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatrizComponent } from './edit-matriz.component';

describe('EditMatrizComponent', () => {
  let component: EditMatrizComponent;
  let fixture: ComponentFixture<EditMatrizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMatrizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
