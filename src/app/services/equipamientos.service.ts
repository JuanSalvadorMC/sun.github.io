import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Equipamients } from '../components/business/sale-equipment/equipament';


const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" ,
Authorization: 'Bearer ' + localStorage.getItem('SCtoken') }) };

@Injectable({
  providedIn: 'root'
})
export class EquipamientosService {
  url = environment.apiUrl + '/sun/equipamento/';

  constructor( private http: HttpClient, private authService: AuthService  ){ }


  registerEquipamiento(data){
    // let id = {id:data};
    return this.http.put(this.url + 'crear',data, httpOptions);
  }
  
  obtenerEquipamiento(id){
    // let id = {id: data};
    return this.http.get(this.url + `obtener/${id}`, httpOptions);
   }

  obtenerEquipamientoTodos(){
    // let id = {id: data};
    return this.http.get(this.url + 'obtener/todos', httpOptions);
   }

  eliminarTraspaso(id:number):Observable<Equipamients>{
    return this.http.delete<Equipamients>(`${this.url}borrar/${id}`, httpOptions)
  }

  actualizarEquipamiento(data){
    return this.http.post(this.url + 'actualizar', data, httpOptions);
 }

   consultaEquipamiento(data){
    return this.http.post(this.url + 'buscar', data, httpOptions);
  }
}
