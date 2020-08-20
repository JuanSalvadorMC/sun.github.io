import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EsatdosService {
  url='http://api-sepomex.hckdrk.mx/'

  estados:any[]=[];
  constructor( private http: HttpClient) { }


  obtenerEstados(): Observable<any> {
    return this.http.get(this.url+'query/get_estados').pipe(map((resp:any) => resp));
  }

  obtenerMunicipios(estado):Observable<any> {
    return this.http.get(this.url+`query/get_municipio_por_estado/${estado}`).pipe(map(resp =>resp))
  }
} 
