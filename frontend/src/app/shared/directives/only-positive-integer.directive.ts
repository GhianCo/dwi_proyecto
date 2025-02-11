import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyPositiveInteger]',
  standalone: true
})
export class OnlyPositiveIntegerDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Permitir teclas de control y navegación
    if (
      event.key === 'Backspace' ||
      event.key === 'Tab' ||
      event.key === 'Enter' ||
      event.key === 'Escape' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Home' ||
      event.key === 'End'
    ) {
      return;
    }

    // Permitir solo números
    if (event.key.match(/^[0-9]$/)) {
      return;
    }

    // Prevenir cualquier otro carácter
    event.preventDefault();
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value;

    // Reemplazar cualquier carácter no numérico
    const filteredValue = value.replace(/[^0-9]/g, '');

    // Establecer el valor filtrado
    inputElement.value = filteredValue;
  }
}
