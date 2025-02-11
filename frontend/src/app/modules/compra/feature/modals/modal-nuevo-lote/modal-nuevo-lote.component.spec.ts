import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoLoteComponent } from './modal-nuevo-lote.component';

describe('ModalNuevoLoteComponent', () => {
  let component: ModalNuevoLoteComponent;
  let fixture: ComponentFixture<ModalNuevoLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNuevoLoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalNuevoLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
