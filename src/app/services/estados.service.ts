import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private http: HttpClient) { }

  obtenerEstados(){
    return this.http.get('https://api-sepomex.hckdrk.mx/query/get_estados')
  }
  obtenerMunicipio(Estado){
    return this.http.get(`https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/${Estado}`)
  }
}
