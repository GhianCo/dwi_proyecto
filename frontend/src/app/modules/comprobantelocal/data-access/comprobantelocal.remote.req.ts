import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprobantelocalRemoteReq {

  private REMOTE_API_URI = environment.apiRest;


}
