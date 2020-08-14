import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  urlApi: string = 'https://sandbox-api.srpago.com/v1/payment/card';

  constructor(private http: HttpClient) { }

  pay(req): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic',
      'skip': 'true'
    })

    return this.http.post(this.urlApi, req,{headers});
  }
}
