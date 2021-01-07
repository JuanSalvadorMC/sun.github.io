import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService2 } from './auth.service2';


const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" ,
Authorization: 'Bearer ' + localStorage.getItem('SCtoken') }) };

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  
  url = environment.apiUrl + '/sun/contacto/';

  constructor( private http: HttpClient, private authService: AuthService2  ){ }

  mostrarSeguimientos(){
    // let id = {id: data};
    return this.http.get(this.url + 'buscar', httpOptions);
   }

}
