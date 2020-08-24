import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  headers = new HttpHeaders({'skip': 'true' });

  constructor(private http: HttpClient) { }

  getIpAddress(): Observable<any> {
    return this.http.get('http://api.ipify.org/?format=json', {headers: this.headers});
  }
}
