import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { Equipamients } from '../components/business/sale-equipment/equipament';
import { SaleEquipamentResp } from '../interfaces/equipaments.model';
import { pluck, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('SCtoken'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class EquipamientosService {
  url = environment.apiUrl + '/sun/equipamento/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  registerEquipamiento(data) {
    // let id = {id:data};
    return this.http.put(this.url + 'crear', data, httpOptions);
  }
  
  obtenerEquipamiento(id){
    // let id = {id: data};
    return this.http.get(this.url + `obtener/${id}`, httpOptions);
   }



   obtenerEquipamientoTodos(){
    // let id = {id: data};
    console.log('entro al service');
    
    return this.http.get(this.url + 'obtener/todos', httpOptions);
   }

 /*  obtenerEquipamientoTodos(): Observable<SaleEquipamentResp[]> {

    return this.http.get<SaleEquipamentResp[]>(this.url + 'obtener/todos', httpOptions).pipe(
      pluck('data'),
      catchError<[], Observable<SaleEquipamentResp[]>>((error) => of([]))
    )
  } */

  eliminarTraspaso(id: number): Observable<Equipamients> {
    return this.http.delete<Equipamients>(
      `${this.url}borrar/${id}`,
      httpOptions
    );
  }

  actualizarEquipamiento(data) {
    return this.http.post(this.url + 'actualizar', data, httpOptions);
  }

  consultaEquipamiento(data) {
    return this.http.post(this.url + 'buscar', data, httpOptions);
  }

  actualizarImagenEquipamiento(data){
    return this.http.post(this.url + 'imagen/actualizar', data, httpOptions);
  }
}
