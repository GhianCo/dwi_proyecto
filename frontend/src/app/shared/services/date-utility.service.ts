import { Injectable } from '@angular/core';
import { addDays, format, parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateUtilityService {

  static parseFechaFromServer(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  static sumarDiasAFecha(fecha: Date, dias: number  = 0) {
    return addDays(fecha, dias);
  }

  static parsearSoloFecha(fecha: Date): string {
    return format(fecha, 'yyyy-MM-dd');
  }

  static formatearFecha(fecha: Date | string) {
    // Si la fecha es un string, se convierte a un objeto Date
    const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  
    // Formatear la fecha en el formato deseado
    return format(fechaObj, 'dd/MM/yyyy HH:mm:ss');
  }

  static formatearFechaSinHora(fecha: Date | string) {
    // Si la fecha es un string, se convierte a un objeto Date
    const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  
    // Formatear la fecha en el formato deseado
    return format(fechaObj, 'dd/MM/yyyy');
  }


}