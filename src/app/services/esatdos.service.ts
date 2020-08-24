import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

const response = {
  statusCode: 200,
  headers: {
   "Access-Control-Allow-Origin": "https://www.salvaunnegocio.com.mx",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" 
  }
}

@Injectable({
  providedIn: 'root'
})
export class EsatdosService {
  url='https://api-sepomex.hckdrk.mx/query/';

  estados:any[]=[];
  headers = new HttpHeaders({'skip': 'true' });
  constructor( private http: HttpClient) { }


  obtenerEstados(): Observable<any> {
    return this.http.get(this.url+'get_estados', {headers: this.headers}).pipe(map((resp:any) => resp));
  }

  obtenerMunicipios(estado):Observable<any> {
    return this.http.get(this.url+`get_municipio_por_estado/${estado}`, {headers: this.headers}).pipe(map(resp =>resp))
  }

  obtenerColoniaPorCP(municipio){
    return this.http.get(this.url+ `get_colonia_por_cp/${municipio}`, {headers: this.headers})
  }

  obtenerInfoPorCP(cp){
    return this.http.get(this.url+`info_cp/${cp}?type=simplified`, {headers: this.headers})
  }
  obtenerCodigoPostarMunicipio(cp){
    return this.http.get(this.url+`get_cp_por_municipio/${cp}`, {headers: this.headers})
  }
  
} 
