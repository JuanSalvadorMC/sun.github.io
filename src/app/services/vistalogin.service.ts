import { Injectable,EventEmitter  } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class VistaloginService {

  vistaNav$ = new EventEmitter<boolean>();
vistaLogin$ = new EventEmitter<boolean>();
vistaRegistro$ = new EventEmitter<boolean>();
  constructor() { }
}



