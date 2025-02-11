import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleOrdenCompraComponent } from './modal-detalle-orden-compra.component';

describe('ModalDetalleOrdenCompraComponent', () => {
  let component: ModalDetalleOrdenCompraComponent;
  let fixture: ComponentFixture<ModalDetalleOrdenCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleOrdenCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetalleOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
