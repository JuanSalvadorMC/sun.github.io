import { Injectable,EventEmitter  } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class VistaloginService {

vistaLogin$ = new EventEmitter<boolean>();
vistaRegistro$ = new EventEmitter<boolean>();
  constructor() { }
}



