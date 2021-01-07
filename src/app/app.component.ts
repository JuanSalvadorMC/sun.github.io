import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificacionesService } from './services/notificaciones.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
      <ngx-spinner bdColor="rgba(0, 0, 0, 0.8)" size="medium" color="#fff" type="square-jelly-box" [fullScreen]="true">
        <p style="color: white"> Loading... </p>
      </ngx-spinner>
       <router-outlet></router-outlet>
   `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  subsLoader = new Subscription();
  title = 'sun';

  constructor(private notificacionesService: NotificacionesService, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.subsLoader = this.notificacionesService.obtenerEstatusLoader().subscribe(estadoLoader => {
     /*  console.log(estadoLoader); */
      switch (estadoLoader) {
        case 'activar':
          this.spinnerService.show()
          break;
          case 'desactivar':
            this.spinnerService.hide()
          break;
      }
    });
  }
  ngOnDestroy(): void {
    this.subsLoader.unsubscribe();
  }

}


