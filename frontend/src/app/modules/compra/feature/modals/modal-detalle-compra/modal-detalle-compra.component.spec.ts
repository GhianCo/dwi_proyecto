import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleCompraComponent } from './modal-detalle-compra.component';

describe('ModalDetalleCompraComponent', () => {
  let component: ModalDetalleCompraComponent;
  let fixture: ComponentFixture<ModalDetalleCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetalleCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
