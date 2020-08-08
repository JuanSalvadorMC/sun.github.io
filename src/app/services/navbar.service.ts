import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  visible:any; 
  id;

  constructor() { }

  ocultarNavOpciones(){
    this.visible = JSON.parse(localStorage.getItem('isInversionista'));
    
  }

  obtenerId(){
    this.id = localStorage.getItem('idusu');
  }
}
