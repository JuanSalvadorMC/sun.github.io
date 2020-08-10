import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Liquid } from '../components/business/liquidity/liquidity';
import { Observable } from 'rxjs';


const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" ,
Authorization: 'Bearer ' + localStorage.getItem('SCtoken') }) };

@Injectable({
  providedIn: 'root'
})
export class LiquidezService {

  url = environment.apiUrl + '/sun/liquidez/';
  headers : HttpHeaders = new HttpHeaders({
    "Conten-type": "application.json"
  })


  constructor( private http: HttpClient, private authService: AuthService  ){ }


  registerLiquidez(data): Observable<any>{
    return this.http.put(this.url + 'crear', data , httpOptions);
  }



  obtenerLiquidez(id){
    // let id = {id: data};
    return this.http.get(this.url + `obtener/${id}`, httpOptions);
   }
  
   obtenerLiquidezTodos(){
    // let id = {id: data};
    return this.http.get(this.url + 'obtener/todos', httpOptions);
   }

   eliminarLiquidez(id:number):Observable<Liquid>{
     return this.http.delete<Liquid>(`${this.url}borrar/${id}`, httpOptions)
   }

   actualizarLiquidez(data){
    return this.http.post(this.url + 'actualizar', data, httpOptions);
 }

   consultaLiquidez(data){
    return this.http.post(this.url + 'buscar', data, httpOptions);
  }
}
