import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCantidadLoteComponent } from './modal-cantidad-lote.component';

describe('ModalCantidadLoteComponent', () => {
  let component: ModalCantidadLoteComponent;
  let fixture: ComponentFixture<ModalCantidadLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCantidadLoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCantidadLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
