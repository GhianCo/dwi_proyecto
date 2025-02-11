import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[OnlyNumbers]',
  standalone: true
})
export class OnlyNumbersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const currentValue = this.el.nativeElement.value;

    // Solo permitir un punto decimal
    const hasDecimalPoint = currentValue.includes('.');

    // Verifica si el carácter ingresado es un número o un punto decimal
    const isValidChar = /^[0-9.]$/.test(inputChar);
    
    // Comprobar si el carácter ingresado es válido
    if (
      (inputChar === '.' && hasDecimalPoint) || // No permite un segundo punto decimal
      (!isValidChar) || // Solo permite números y punto decimal
      (inputChar === '.' && currentValue.length === 0) // No permite un punto al inicio
    ) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || window['clipboardData'];
    const pastedData = clipboardData.getData('text');

    // Permitir pegar solo números o un número decimal y asegurar que no haya más de un punto decimal
    const hasMoreThanOneDecimal = (pastedData.match(/\./g) || []).length > 1;

    if (!/^\d*\.?\d*$/.test(pastedData) || hasMoreThanOneDecimal) {
      event.preventDefault();
    }
  }
}
