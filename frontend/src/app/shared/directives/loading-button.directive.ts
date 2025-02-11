import { Directive, ElementRef, Input, Renderer2, OnChanges, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[loadingButton]',
  standalone: true,
})
export class LoadingButtonDirective implements OnChanges {
  @Input() loadingButton: boolean = false;

  private originalContent: string | null = null;
  private spinnerRef: ComponentRef<MatProgressSpinner> | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnChanges() {
    this.updateButtonState();
  }

  private updateButtonState() {
    const button = this.el.nativeElement;

    if (this.loadingButton) {
      // Guardar el contenido original del botón y limpiarlo
      if (this.originalContent === null) {
        this.originalContent = button.innerHTML;
      }
      button.innerHTML = '';

      // Crear y agregar el componente MatProgressSpinner
      if (!this.spinnerRef) {
        const spinnerFactory = this.componentFactoryResolver.resolveComponentFactory(MatProgressSpinner);
        this.spinnerRef = this.viewContainerRef.createComponent(spinnerFactory);
        this.spinnerRef.instance.diameter = 24;
        this.spinnerRef.instance.mode = 'indeterminate';
      }

      // Insertar el spinner en el botón
      button.appendChild(this.spinnerRef.location.nativeElement);

      // Deshabilitar el botón
      this.renderer.setAttribute(button, 'disabled', 'true');
    } else {
      // Restaurar el contenido original y eliminar el spinner
      if (this.originalContent !== null) {
        button.innerHTML = this.originalContent;
      }
      if (this.spinnerRef) {
        this.spinnerRef.destroy();
        this.spinnerRef = null;
      }

      // Habilitar el botón
      this.renderer.removeAttribute(button, 'disabled');
    }
  }
}
