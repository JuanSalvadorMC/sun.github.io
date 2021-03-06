import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { EsatdosService } from '../../../services/esatdos.service';
import { TraspasosService } from 'src/app/services/traspasos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tranfer',
  templateUrl: './tranfer.component.html',
  styleUrls: ['./tranfer.component.css']
})
export class TranferComponent implements OnInit {

  formTranfer: FormGroup;
  catTipoNegocio: any[] = [];
  catEstados:any[]=[];
  catMunicipios:any[]=[];


  transferTodos: any[] = [];
  resultadoBusquedaLiquidez: any[] = [];
  mostrar = false;
  vacio = true;
  myProducts: any;
  usuario: any;
  BDRegistros: any[] = [];
  mos= "oculto";

  confirmacionCP: any;
  idUsuario;
isInversionista: any;
  constructor( private usuariosService: UsuariosService, private estadosService: EsatdosService,  
    private traspasoService: TraspasosService, private router: Router, private _usuarioService: UsuariosService ) { }

  ngOnInit(): void {
    

    this.isInversionista = JSON.parse(localStorage.getItem('isInversionista'));
    this.obterPublicacionesTraspasos();
     
    this.idUsuario = JSON.parse(localStorage.getItem('idusu'));
    this._usuarioService.consultarUsuario(this.idUsuario).subscribe((resp: any) => {
      this.confirmacionCP = resp.data.cp;
    });


    this.catTipoNegocio = this.usuariosService.catTipoNegocio
  /*   console.log(this.catTipoNegocio); */
    
    
    this.estadosService.obtenerEstados().subscribe(resp => {
      let estado:any[]= resp.response.estado
      estado.forEach((elm, i)=> {
        let estadoObject = { nombreEstado: elm, idEstado:i+1 }
        this.catEstados.push(estadoObject)
      })
    });
    this.formTranfe()
  }

  formTranfe(){
    this.formTranfer = new FormGroup({
      ubicacion: new FormControl( null),
      estado: new FormControl('', ),
      municipio: new FormControl('', ),
      tipoNegocio: new FormControl( null,  ),
      precioDesde: new FormControl( null,  ),
      precioHasta: new FormControl( null,  ),
      sinAntiguedad: new FormControl( null,  ),
      antiguedadPubl: new FormControl( null,  )
    })
  }
  buscarResultadosTranspasos() {

    console.log(this.BDRegistros);
    
    this.formTranfer.get('municipio').valid;

    this.resultadoBusquedaLiquidez = [];
    this.vacio = false;
    this.mostrar = true;

    let rq = this.formTranfer.getRawValue();

    console.log(rq);
    console.log(this.BDRegistros);
    if (!rq.tipoNegocio  && !rq.estado && !rq.municipio  && !rq.precioHasta && !rq.ubicacion && !rq.precioDesde ) {
      this.vacio = true;
      console.log('Busqueda vacia');
    } else {
      this.vacio = false;
      this.mostrar = true;
      console.log('Busqueda parametros');

    }
      this.formTranfer.get('municipio').valid;
      this.BDRegistros.forEach((element, index) => {
        /* console.log('arreglo bd', element); */
        /* BAJADA DE DATOS */
        /*  let buscar=this.formTranfer.get('tipoNegocio').value; */

        let local: any[] = [];
        let bd: any[] = [];

        local[0] = rq.tipoNegocio;
        local[1]= rq.tipoSocio;
        local[2] = rq.estado;
        local[3] = rq.municipio;
        local[4] = rq.ubicacion;
        local[5] = rq.precioHasta;

       
        bd[0] = element.tipoNegocio;
        bd[1]   = element.tipoSocio;
        bd[2]   = element.estado;
        bd[3]    = element.municipio;
        bd[4]    = element.ubicacion;
        bd[5]    = element.monto;
        /* BAJADA DE DATOS */

        /*   COMPARACION */
        let todosLosCampos=true;
       
    console.log(bd[3],local[3]);

        for (let i = 0; i < bd.length-1; i++) {
          if (local[i]   ) {
            if (local[i] != bd[i]  ) {
            todosLosCampos=false;
               
            } 
          }  
         } 
  
          if (rq.precioHasta) {
            let hasta =parseInt(rq.precioHasta, 10)+1;        
           if (bd[bd.length-1]>=hasta) {
            todosLosCampos=false;
           }
          } 
          if (rq.precioDesde) {
            let desde =parseInt(rq.precioDesde, 10)-1;      
           if (bd[bd.length-1]<=desde) {
            todosLosCampos=false;
           }
          } 

       


       if (todosLosCampos) {
        this.resultadoBusquedaLiquidez.push(element)
       } 

      })

   
    this.formTranfer.get('municipio').valid;
    return this.resultadoBusquedaLiquidez;
    this.formTranfer.get('municipio').valid;
    console.log(this.vacio);

  }
  perfil(idN) {
    if (this.confirmacionCP == "-----") {
      this.router.navigate([`/user/profile/${this.idUsuario}`]);
   
    } else {
    this.router.navigate([`/contacto-traspaso/${idN}`])
  } }
  obterPublicacionesTraspasos() {
    this.traspasoService.obtenerTraspasoTodos().subscribe((result: any) => {
      this.BDRegistros= result.data;
      this.transferTodos=this.BDRegistros;
    /*   console.log(result.data);
      console.log(this.resultadoBusquedaLiquidez); */

     /*  for (let i = 0; i < this.BDRegistros.length; i++) {
        this.BDRegistros[i].descripcion = this.limitar(this.BDRegistros[i].descripcion);
      } */
      
     
      this.usuario = localStorage.getItem('idusu');
      this.usuario = JSON.parse(this.usuario);
     
    })
  }

  obtenerMunicipios(){
    this.catMunicipios = [];
    this.estadosService.obtenerMunicipios(this.formTranfer.get('estado').value).subscribe(resp => {
      let municipio:any[]= resp.response.municipios
      municipio.forEach((elm, i)=> {
        let municipioObject = { nombreMunicipio: elm, idMunicipio:i+1}
        this.catMunicipios.push(municipioObject)
      });
    })

}



}