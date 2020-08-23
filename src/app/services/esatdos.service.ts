import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EsatdosService {
  url='https://api-sepomex.hckdrk.mx/query/'

  estados:any[]=[];
  constructor( private http: HttpClient) { }


  obtenerEstados(): Observable<any> {
    return this.http.get(this.url+'get_estados').pipe(map((resp:any) => resp));
  }

  obtenerMunicipios(estado):Observable<any> {
    return this.http.get(this.url+`get_municipio_por_estado/${estado}`).pipe(map(resp =>resp))
  }

  obtenerColoniaPorCP(municipio){
    return this.http.get(this.url+ `get_colonia_por_cp/${municipio}`)
  }

  obtenerInfoPorCP(cp){
    return this.http.get(this.url+`info_cp/${cp}?type=simplified`)
  }
  obtenerCodigoPostarMunicipio(cp){
    return this.http.get(this.url+`get_cp_por_municipio/${cp}`)
  }
  
} 
