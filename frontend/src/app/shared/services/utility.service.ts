
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  public static BACKEND_URL = environment.api;


  public static parsearUrlImagen(filePath: string): string {
    return `${this.BACKEND_URL}/${filePath}`;
  }
}