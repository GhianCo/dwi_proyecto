
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IResponse } from '@shared/interfaces/IResponse';
import { Observable } from 'rxjs';
import Swal, { SweetAlertArrayOptions, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private REMOTE_API_URI = environment.api;

  constructor(
    private http: HttpClient
  ) { }

  upload({ file, folder }: { file: any, folder: string }): Observable<IResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post(this.REMOTE_API_URI + '/api/common/upload', formData) as Observable<IResponse>;

  }

  busquedaSensitiva(criteria: any): Observable<IResponse> {
    return this.http.post(this.REMOTE_API_URI + '/api/common/busquedaSensitiva', criteria) as Observable<IResponse>;
  }

  static async mostrarAlerta({
    titulo,
    mensaje,
    tipo = "success",
    confirmButtonText,
    cancelButtonText    
  }: {
    titulo: string,
    mensaje: string | string[],
    tipo: 'success' | 'error' | 'warning' | 'info' | 'question',
    confirmButtonText?: string,
    cancelButtonText?: string,
  }) {
    let textMensajes = null;

    if (Array.isArray(mensaje)) {
      textMensajes = mensaje.map(m => `<p>${m}</p>`).join('');
    } else {
      textMensajes = mensaje;
    }

    let sweetAlertOptions: SweetAlertOptions = {
      title: titulo,
      html: textMensajes,
      icon: tipo
    }

    if(confirmButtonText && cancelButtonText) {
      sweetAlertOptions.confirmButtonText = confirmButtonText;
      sweetAlertOptions.cancelButtonText = cancelButtonText;
    }

    const result = await Swal.fire(sweetAlertOptions);

    return result;

  }

}