import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizrComponent } from './matrizr.component';

describe('MatrizrComponent', () => {
  let component: MatrizrComponent;
  let fixture: ComponentFixture<MatrizrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrizrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrizrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
