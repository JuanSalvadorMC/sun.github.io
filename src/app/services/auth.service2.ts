import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

const httpOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" ,
Authorization: 'Bearer ' + localStorage.getItem('SCtoken') }) };

@Injectable({
  providedIn: 'root'
})
export class AuthService2 {

  url = environment.apiUrl + '/sun/auth';
  headers : HttpHeaders = new HttpHeaders({
    "Conten-type": "application.json"
  })

  constructor( private http: HttpClient, private router:Router  ) {}

onlogin(data){
      return this.http.post(this.url + '/login', data, {headers : this.headers}).pipe(map(resp => resp))
}

/* loginRedSocial(data){
  return this.http.post(this.url + '/login/social', data, {headers : this.headers} )
      .pipe(map(data => data))
} */
loginRedSocial(data){
   return this.http.post(this.url + '/login/social', data, {headers : this.headers} )
      .pipe(map(data => data));

      console.log(data);
      
     /*  if (data.exito==false) {
        
      } */
}

registerUserRedSocial(data) {
    
  // let id = {id:data};
  
  
  return this.http.put(this.url + 'registrar', data);
}


getRefreshToken(){
    let token = localStorage.getItem('refreshToken');
    return token
}

setRefreshToken(refreshToken): void{
    localStorage.setItem('refreshToken',refreshToken);
}

refreshToken(){
      return this.http.post<any>(
        this.url + '/refreshToken',
        { 'refreshToken': this.getRefreshToken() }
      ).pipe(tap((tokens) => {
        let reToken = tokens.refreshtoken;
        this.setRefreshToken(reToken);
      }));
}

logout(){
  localStorage.removeItem('SCtoken');
  localStorage.removeItem('idusu');
  localStorage.removeItem('isInversionista');
  this.router.navigate([`//home`]);

  }

  setId(id){
    localStorage.setItem("idusu", id)
  }

  setRol(user): void
  {
    localStorage.setItem("isInversionista", user);
  }

  setToken(token): void{
      localStorage.setItem('SCtoken', token);
  }

  getToken(){
      return localStorage.getItem('SCtoken');
  }

getCurrentRol()
{
  let user_string = JSON.parse(localStorage.getItem('isInversionista'))
  
  console.log(user_string);
}
}

