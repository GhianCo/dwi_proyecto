import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | string): string {
    const decimales = 2;
    
    
    if( !value || value == 'NaN' || typeof value === 'undefined' || value == 'Infinity'){
      value = '0';
    }

    const numValue = parseFloat(value.toString());

    return numValue.toFixed(decimales);
  }
}