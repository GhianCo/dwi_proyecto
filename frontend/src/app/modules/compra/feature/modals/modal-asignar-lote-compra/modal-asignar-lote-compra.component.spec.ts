import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarLoteCompraComponent } from './modal-asignar-lote-compra.component';

describe('ModalAsignarLoteCompraComponent', () => {
  let component: ModalAsignarLoteCompraComponent;
  let fixture: ComponentFixture<ModalAsignarLoteCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarLoteCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAsignarLoteCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
