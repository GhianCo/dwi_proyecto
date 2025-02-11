import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaOrdenCompraComponent } from './nueva-orden-compra.component';

describe('NuevaOrdenCompraComponent', () => {
  let component: NuevaOrdenCompraComponent;
  let fixture: ComponentFixture<NuevaOrdenCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaOrdenCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
