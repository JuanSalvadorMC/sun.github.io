import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  colorBotones = [
    { color: '#fbc107', tipo:'warning'},
    { color: '#dc3546', tipo:'error'},
    { color: '#37a744', tipo:'success'},
    { color: '#1a7cff', tipo:'info'},
    { color: '#32a2b8', tipo:'question'},
  ];
  
  loaderSubject = new Subject<string>();
  terminosSubject = new BehaviorSubject<boolean>(true);
  $terminosSubject = this.terminosSubject.asObservable();

  constructor( public spinnerService: NgxSpinnerService) { }

  lanzarNotificacion(mensaje: string, titulo: string, tipo: 'warning' | 'error' | 'success' | 'info' | 'question') {
    // const colorBoton = 
    return Swal.fire({
      title: titulo,
      text: mensaje, 
      icon: tipo,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: this.colorBotones.find(color=> color.tipo === tipo).color,
    });
  }
  lanzarToast(mensaje: string, titulo: string, tipo: 'warning' | 'error' | 'success' | 'info' | 'question') {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      title: titulo,
      text: mensaje,
      icon: tipo,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: this.colorBotones.find(color => color.tipo === tipo).color,
    });
  }
  confirmarAccion(mensaje: string, titulo: string, botonConfirmarTexto?: string, botonCancelarTexto?: string, tipo?: 'warning' | 'error' | 'success' | 'info' | 'question'){
    return Swal.fire({
      icon: tipo,
      title: titulo,
      text: mensaje,
      backdrop: true,
      // icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#37a744',
      cancelButtonColor: '#dc3546',
      confirmButtonText: botonConfirmarTexto ? botonConfirmarTexto : 'Aceptar',
      cancelButtonText: botonCancelarTexto ? botonCancelarTexto : 'Cancelar'
    });
  }

  // Loader
  activarDesactivarLoader(data: 'activar' | 'desactivar' | 'reset') {
    this.loaderSubject.next(data)
  }
  obtenerEstatusLoader(): Observable<any> {
    return this.loaderSubject;
  }

}
