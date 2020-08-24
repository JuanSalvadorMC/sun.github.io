import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Sales } from '../components/business/sale/sale';
import { Observable } from 'rxjs';

const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" ,
Authorization: 'Bearer ' + localStorage.getItem('SCtoken') }) };

@Injectable({
  providedIn: 'root'
})
export class TraspasosService {

  url = environment.apiUrl + '/sun/traspaso/';
 
  constructor( private http: HttpClient, private authService: AuthService  ){ }

  registerTraspaso(data){
    // let id = {id:data};
    return this.http.put(this.url + 'crear',data, httpOptions);
  }

  obtenerTraspasoTodos(){
    // let id = {id: data};
    
    return this.http.get(this.url + 'obtener/todos', httpOptions);
   }
 

   obtenerTraspaso(id){
    // let id = {id: data};
    return this.http.get(this.url + `obtener/${id}`, httpOptions);
   }

   eliminarTraspaso(id:number):Observable<Sales>{
    return this.http.delete<Sales>(`${this.url}borrar/${id}`, httpOptions)
  }

  actualizarTraspaso(data){
    return this.http.post(this.url + 'actualizar', data, httpOptions);
 }

  consultaTraspaso(data){
   return this.http.post(this.url + 'buscar', data, httpOptions);
 }
 actualizarImagenTraspaso(data){
  return this.http.post(this.url + 'imagen/actualizar', data, httpOptions);
}
}
