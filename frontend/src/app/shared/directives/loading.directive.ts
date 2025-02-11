import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appLoading]',
  standalone: true
})
export class LoadingDirective implements OnChanges {
  @Input() appLoading: boolean = false;

  private loadingOverlay: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.createLoadingOverlay();
  }

  ngOnChanges() {
    if (this.appLoading) {
      this.showLoading();
    } else {
      this.hideLoading();
    }
  }

  private createLoadingOverlay() {
    // Crear un div que servirá como overlay de loading
    this.loadingOverlay = this.renderer.createElement('div');

    // Aplicar estilos básicos al overlay
    this.renderer.setStyle(this.loadingOverlay, 'position', 'absolute');
    this.renderer.setStyle(this.loadingOverlay, 'top', '0');
    this.renderer.setStyle(this.loadingOverlay, 'left', '0');
    this.renderer.setStyle(this.loadingOverlay, 'width', '100%');
    this.renderer.setStyle(this.loadingOverlay, 'height', '100%');
    this.renderer.setStyle(this.loadingOverlay, 'background', 'rgba(255, 255, 255, 0.8)');
    this.renderer.setStyle(this.loadingOverlay, 'display', 'flex');
    this.renderer.setStyle(this.loadingOverlay, 'align-items', 'center');
    this.renderer.setStyle(this.loadingOverlay, 'justify-content', 'center');
    this.renderer.setStyle(this.loadingOverlay, 'z-index', '9999');
    this.renderer.setStyle(this.loadingOverlay, 'visibility', 'hidden');

    // Crear un spinner básico
    const spinner = this.renderer.createElement('div');
    this.renderer.setStyle(spinner, 'border', '8px solid #f3f3f3');
    this.renderer.setStyle(spinner, 'border-radius', '50%');
    this.renderer.setStyle(spinner, 'border-top', '8px solid #3498db');
    this.renderer.setStyle(spinner, 'width', '60px');
    this.renderer.setStyle(spinner, 'height', '60px');
    this.renderer.setStyle(spinner, 'animation', 'spin 0.5s linear infinite');

    this.renderer.appendChild(this.loadingOverlay, spinner);
    this.renderer.appendChild(this.el.nativeElement, this.loadingOverlay);

    // Añadir la animación CSS para el spinner
    const style = this.renderer.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    this.renderer.appendChild(this.el.nativeElement, style);
  }

  private showLoading() {
    this.renderer.setStyle(this.loadingOverlay, 'visibility', 'visible');
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative'); // Esto es importante para el overlay
  }

  private hideLoading() {
    this.renderer.setStyle(this.loadingOverlay, 'visibility', 'hidden');
  }
}
