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
  
  catTipoNegocio=[
    { idTipoNegocio:1,  tipoNegocio: 'Restaurante'},
    { idTipoNegocio:2, tipoNegocio: 'Hoteles'},
    { idTipoNegocio:3,  tipoNegocio: 'Salón de Belleza'},
    { idTipoNegocio:4, tipoNegocio: 'Centro Médico'},
    { idTipoNegocio:5, tipoNegocio: 'Laboratorios'},
    { idTipoNegocio:6, tipoNegocio: 'Agencia de Viajes'},
    { idTipoNegocio:7, tipoNegocio: 'Agencia de Bienes Raíces'},
    { idTipoNegocio:8, tipoNegocio: 'Constructoras'},
    { idTipoNegocio:9, tipoNegocio: 'Bancos'},
    { idTipoNegocio:10,  tipoNegocio: 'Financieras'},
    { idTipoNegocio:11,  tipoNegocio: 'Seguros'},
    { idTipoNegocio:12,  tipoNegocio: 'Transportes'},
    { idTipoNegocio:13,  tipoNegocio: 'Escuelas'},
    { idTipoNegocio:14,  tipoNegocio: 'Consultorías'},
    { idTipoNegocio:15,  tipoNegocio: 'Confección'},
    { idTipoNegocio:16,  tipoNegocio: 'Mueblería'},
    { idTipoNegocio:17,  tipoNegocio: 'Autolavados'},
    { idTipoNegocio:18,  tipoNegocio: 'Tienda de Alimentos'},
    { idTipoNegocio:19,  tipoNegocio: 'Tienda de Ropa'},
    { idTipoNegocio:20,  tipoNegocio: 'Joyerías'},
    { idTipoNegocio:21,  tipoNegocio: 'Spa'},
    { idTipoNegocio:22,  tipoNegocio: 'Concesoras'},
    { idTipoNegocio:23,  tipoNegocio: 'Gimnasios'},
    { idTipoNegocio:23,  tipoNegocio: 'Otros'}
    ]

    catTipoSocio=[
      {idTipoSocio:1, tipoSocio: 'Socio Capitalista'},
      {idTipoSocio:2, tipoSocio: 'Comunidad de Bienes'},
      {idTipoSocio:3, tipoSocio: 'Sociedad de Responsabilidad Limitada'},
      {idTipoSocio:4, tipoSocio: 'Sociedad Comanditaría Simple'},
      {idTipoSocio:5, tipoSocio: 'Sociedad Colectiva'},
      {idTipoSocio:6, tipoSocio: 'Sociedad Civil'},
      {idTipoSocio:7, tipoSocio: 'Sociedad Comanditaria por Acciones'},
      {idTipoSocio:8, tipoSocio: 'Sociedad de Responsabilidad Limitada Laboral'},
      {idTipoSocio:9, tipoSocio: 'Sociedad Anónima Laboral'}
      ]

      /*catFiltroAvanzado=[
        {idFiltroAvanzado: 1 filtroAvanzado: Persona que aporta su capital a una empresa o sociedad mercantil, con objeto de participar en las ganancias futuras, especialmente cuando hay uno o varios socios industriales, pero habitualmente no participa en la gestión de la compañía.},
        {idFiltroAvanzado: 2 filtroAvanzado: Es la fórmula más adecuada cuando la propiedad de un bien o derecho pertenece proindiviso a varias personas y forma parte de una actividad empresarial realizada en común, por ejemplo, el alquiler de viviendas y locales. La comunidad de bienes no tributa por las rentas obtenidas, sino que éstas se atribuyen a los comuneros que las liquidan por IRPF o el Impuesto de Sociedades, principalmente.},
        {idFiltroAvanzado: 3 filtroAvanzado: Es el tipo de sociedad mercantil más popular, porque evita responder con el patrimonio personal. Divide su capital social en participaciones, que son indivisibles y acumulables. De este modo, está integrada por las aportaciones de todos los socios.},
        {idFiltroAvanzado: 4 filtroAvanzado: Su peculiaridad es la existencia de socios colectivos que aportan capital y trabajo y responden subsidiaria, personal y solidariamente de las deudas sociales, y de socios comanditarios, que solamente aportan capital, limitando su responsabilidad a esta aportación.},
        {idFiltroAvanzado: 5 filtroAvanzado: Sociedad mercantil de carácter personalista, en la que todos los socios, en nombre colectivo y bajo una razón social, se comprometen a participar en la proporción que establezcan, de los mismos derechos y obligaciones.},
        {idFiltroAvanzado: 6 filtroAvanzado: Se trata de un contrato por el que dos o más personas ponen en común capital con propósito de repartir entre sí las ganancias. Su tributación debe ser en el Impuesto de Sociedades cuando tienen un objetivo mercantil, y cuando no es así se atribuyen al régimen al que se acoja cada uno de sus socios.},
        {idFiltroAvanzado: 7 filtroAvanzado: Su capital social se divide en acciones formadas por las aportaciones de los socios. Uno de los socios debe asumir la administración de la sociedad, respondiendo personalmente de las deudas sociales como socio colectivo.},
        {idFiltroAvanzado: 8 filtroAvanzado: Su principal característica es que al menos el 51% del capital social es propiedad de los trabajadores que prestan en ella servicios retribuidos de forma personal y directa, y con una relación laboral indefinida.},
        {idFiltroAvanzado: 9 filtroAvanzado: La mayoría del capital social es propiedad de los trabajadores que prestan en ella servicio retribuido y personal con carácter indefinido, si bien en este caso su fórmula es más adecuada para proyectos con mayores perspectivas de crecimiento.}

      ]*/

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

}
