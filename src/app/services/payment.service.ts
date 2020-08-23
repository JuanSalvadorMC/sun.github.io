import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url = environment.apiUrl + '/sun';

  constructor(private http: HttpClient) { }

  payment(req): Observable<any> {
    return this.http.post(this.url + '/subscripcion/pagar', req);
  }
}
