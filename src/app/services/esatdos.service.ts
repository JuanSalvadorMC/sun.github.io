import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EsatdosService {
  url='https://api-sepomex.hckdrk.mx/query/'
  headers;

  estados:any[]=[];
  constructor( private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Access-Control-Allow-Headers', 'Authorization');
   }


  obtenerEstados(): Observable<any> {
    return this.http.get(this.url+'get_estados', this.headers).pipe(map((resp:any) => resp));
  }

  obtenerMunicipios(estado):Observable<any> {
    return this.http.get(this.url+`get_municipio_por_estado/${estado}`, this.headers).pipe(map(resp =>resp))
  }

  obtenerColoniaPorCP(municipio){
    return this.http.get(this.url+ `get_colonia_por_cp/${municipio}`, this.headers)
  }

  obtenerInfoPorCP(cp){
    return this.http.get(this.url+`info_cp/${cp}?type=simplified`)
  }
  obtenerCodigoPostarMunicipio(cp){
    return this.http.get(this.url+`get_cp_por_municipio/${cp}`, this.headers)
  }
  
} 
