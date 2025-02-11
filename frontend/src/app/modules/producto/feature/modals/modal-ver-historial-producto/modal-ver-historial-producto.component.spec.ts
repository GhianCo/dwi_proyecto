import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerHistorialProductoComponent } from './modal-ver-historial-producto.component';

describe('ModalVerHistorialProductoComponent', () => {
  let component: ModalVerHistorialProductoComponent;
  let fixture: ComponentFixture<ModalVerHistorialProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVerHistorialProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVerHistorialProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
