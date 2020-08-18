import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: 'Bearer ' + localStorage.getItem('SCtoken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = environment.apiUrl + '/sun/usuario/';
  headers: HttpHeaders = new HttpHeaders({
    "Conten-type": "application.json"
  })

  constructor(private http: HttpClient, private authService: AuthService) { }

  registerUser(data) {
    // let id = {id:data};
    return this.http.put(this.url + 'registrar', data);
  }

  registerUserRedSocial(data) {
    // let id = {id:data};
    return this.http.put(this.url + 'registrar', data);
  }

  consultUsers() {
    return this.http.get(this.url + 'obtener/todos', httpOptions);
  }

  consultarUsuario(id) {
    return this.http.get(this.url + `obtener/${id}`, httpOptions);
  }

  buscarUserId(data) {
    let id = { id: data };
    return this.http.post(this.url + 'buscar', id, httpOptions);
  }

  consultUserId(data){
    let id = {id: data};
    return this.http.post(this.url + 'buscar', id, httpOptions);
   }

   editarPerfil(data){
    return this.http.post(this.url + 'actualizar', data, httpOptions);
  }

  cambiarContra(data){
    return this.http.post(this.url + 'cambiar/pwd', data, httpOptions);
  }

  restablecerContra(data){
    return this.http.post(this.url + 'reestablecer/pwd', data);
  }

}
