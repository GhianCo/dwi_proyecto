import { Injectable } from '@angular/core';
import {
  addDays,
  differenceInDays,
  endOfDay,
  format,
  formatISO,
  formatISO9075,
  getUnixTime,
  intervalToDuration,
  parseISO,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  /**
   * Convierte un objeto Date a un string en el formato aceptado por el servidor
   */
  static formatForServer(date?: Date): string {
    if (!date) {
      date = new Date();
    }
    return formatISO9075(date);
  }

  static parseIsoDate(date: string): Date {
    return parseISO(date);
  }

  /**
   * Devuelve un string con la fecha y hora actual en el formato usado por Ionic.
   */
  static currentDateTimeStringForIonic(): string {
    return formatISO(new Date());
  }

  /**
   * Convierte una fecha en un string con el formato usado por Ionic.
   */
  static dateTimeStringForIonic(date: Date): string {
    return formatISO(date);
  }

  /**
   * Convierte un string con el formato usado por Ionic en un objeto Date.
   */
  static ionicDateTimeToObject(dateString: string): Date {
    return parseISO(dateString);
  }

  /**
   * Convierte un string que proviene desde el servidor en un objeto Date.
   */
  static dateFromServer(dateString: string): Date {
    return new Date(dateString);
  }

  static formatDateString(
    inputDate: string,
    outputFormat: string = 'dd/MM/yyyy HH:mm:ss',
  ): string {
    const parsedDate = new Date(inputDate);
    if (isNaN(parsedDate.getTime())) {
      return 'Fecha no válida';
    }
    return format(parsedDate, outputFormat);
  }

  static formatDate(
    inputDate: Date,
    outputFormat: 'fecha' | 'fechaHora' | 'hora' | string = 'dd/MM/yyyy HH:mm:ss',
  ): string | null {
    if (!(inputDate instanceof Date) || isNaN(inputDate.getTime())) {
      return null;
    }
    switch (outputFormat) {
      case 'fecha':
        return format(inputDate, 'd MMM yyyy', { locale: es }).toLowerCase();
      case 'fechaHora':
        return format(inputDate, 'd MMM yyyy HH:mm', { locale: es }).toLowerCase();
      case 'hora':
        return format(inputDate, 'HH:mm', { locale: es });
      default:
        return format(inputDate, outputFormat, { locale: es });
    }
  }

  static compareDates(
    date1: string | Date,
    date2: string | Date,
    unit: string = 'days',
  ): boolean {
    const date1Obj = typeof date1 === 'string' ? parseISO(date1) : date1;
    const date2Obj = typeof date2 === 'string' ? parseISO(date2) : date2;

    if (unit === 'days') {
      return differenceInDays(date1Obj, date2Obj) === 0;
    }
    return false;
  }

  static rangoFechasPorDefecto() {
    return {
      fechaInicio: startOfDay(addDays(new Date(), -30)),
      fechaFin: endOfDay(new Date()),
    };
  }

  static rangoFechasPorDefectov2() {
    return {
      fechaInicio: startOfDay(addDays(new Date(), -1)),
      fechaFin: endOfDay(new Date()),
    };
  }

  static secondsToDurationString(seconds: number): string {
    if (!seconds) {
      seconds = 0;
    }
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return `${duration.hours}h ${duration.minutes}m`;
  }

  static extractDateAndTime(dateTimeString: string): { date: string; time: string } {
    const dateTime = new Date(dateTimeString);
    return {
      date: format(dateTime, 'yyyy-MM-dd'),
      time: format(dateTime, 'HH:mm:ss'),
    };
  }

  static getCurrentTimeUnix(): number {
    return getUnixTime(new Date());
  }
}
