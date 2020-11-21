import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  constructor(private router: Router,private _usuarioService: UsuariosService,private _NTS: NotificacionesService,) { }

  ngOnInit(): void {
    console.log("on init buniss");
    
    this.idUsuario = JSON.parse(localStorage.getItem('idusu'));
    this._usuarioService.consultarUsuario(this.idUsuario).subscribe((resp: any) => {
      this.confirmacionCP = resp.data.cp;
      if (this.confirmacionCP=="-----") {
      
        
        this.router.navigate([`/user/profile/${this.idUsuario}`]);
        /* return this._NTS.lanzarNotificacion('Para continuar debes complementar algunos datos importantes', 'No has completado tu informacion personal', 'warning');
         */ 
      }
      
    });
    console.log(this.confirmacionCP );
    this.confirmacionDatos();
  } 


  confirmacionCP: any;
  idUsuario;


confirmacionDatos(){

  if (this.confirmacionCP=="-----") {
    console.log("entrojkhuklgyuklyuklguil");
    
   /*  this.router.navigate([`/user/profile/${this.idUsuario}`]); */
    /* return this._NTS.lanzarNotificacion('Para continuar debes complementar algunos datos importantes', 'No has completado tu informacion personal', 'warning');
     */ 
  }

}




}
