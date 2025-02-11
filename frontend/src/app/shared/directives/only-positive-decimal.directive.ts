import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyPositiveDecimal]',
  standalone: true
})
export class OnlyPositiveDecimalDirective {

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

    const inputElement = this.el.nativeElement;
    const value = inputElement.value;

    // Permitir números y un único punto decimal
    if (event.key.match(/^[0-9]$/)) {
      return;
    }
    if (event.key === '.' && !value.includes('.')) {
      return;
    }

    // Prevenir cualquier otro carácter
    event.preventDefault();
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value;

    // Reemplazar cualquier carácter no numérico o más de un punto decimal
    const filteredValue = value
      .replace(/[^0-9.]/g, '') // Eliminar caracteres no válidos
      .replace(/\.(?=.*\.)/g, ''); // Eliminar puntos decimales adicionales

    // Establecer el valor filtrado
    inputElement.value = filteredValue;
  }
}
