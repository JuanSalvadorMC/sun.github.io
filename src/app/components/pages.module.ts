//modulos
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//directive

//rutas
import { pages_routes } from './pages.router';

//componentes

import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { CommonModule } from '@angular/common';

//externals
import { MaterialModule } from '../@material/material.module';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { LoginComponent } from './user/login/login.component';
import { LiquidityComponent } from './business/liquidity/liquidity.component';
import { SaleComponent } from './business/sale/sale.component';
import { SaleEquipmentComponent } from './business/sale-equipment/sale-equipment.component';
import { InfoHelpComponent } from './esp/info-help/info-help.component';
import { MembershipComponent } from './membership/membership.component';
import { SaleEquiComponent } from './investment/sale-equi/sale-equi.component';
import { InfoIversComponent } from './esp/info-ivers/info-ivers.component';
import { HomeComponent } from './esp/home/home.component';
import { InvestmentComponent } from './investment/investment.component';
import { TranferComponent } from './investment/tranfer/tranfer.component';
import { MemberComponent } from './investment/member/member.component';
import { BusinessComponent } from './business/business.component';
import { PersonalInfoComponent } from './profile/personal-info/personal-info.component';
import { ResultSaleEquipamentComponent } from './result/result-sale-equipament/result-sale-equipament.component';
import { ResultSaleComponent } from './result/result-sale/result-sale.component';
import { ResultLiquidityComponent } from './result/result-liquidity/result-liquidity.component';
import { ResulCLiquidityComponent } from './resultComplete/resul-cliquidity/resul-cliquidity.component';
import { ResulCSaleComponent } from './resultComplete/resul-csale/resul-csale.component';
import { PayComponent } from './membership/pay/pay.component';
import { InverComponent } from './user/register/inver/inver.component';
import { EmpreComponent } from './user/register/empre/empre.component';
import { ModalLiquidezComponent } from './modals/modal-liquidez/modal-liquidez.component';
import { ModalTraspasoComponent } from './modals/modal-traspaso/modal-traspaso.component';
import { ModalEquiposComponent } from './modals/modal-equipos/modal-equipos.component';
import { PublicacionComponent } from './profile/publicacion/publicacion.component';
import { DatosRegistroRedSocialComponent } from './modals/datos-registro-red-social/datos-registro-red-social.component';
import { NgxSpinnerModule} from 'ngx-spinner'
import { ModalContraComponent } from './modals/modal-contra/modal-contra.component';
import { ContactoEquipamientoComponent } from './resultComplete/contacto-equipamiento/contacto-equipamiento.component';
import { ContactoTraspasoComponent } from './resultComplete/contacto-traspaso/contacto-traspaso.component';
import { RecuperarContraseniaComponent } from './modals/recuperar-contrasenia/recuperar-contrasenia.component';
import { SeguimientosComponent } from './profile/seguimientos/seguimientos.component';
import { TerminosCondicionesComponent } from './user/terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from './user/politica-privacidad/politica-privacidad.component';



const components = [
  ProfileComponent,
  ModalContraComponent,
  LoginComponent,
  LiquidityComponent,
  SaleComponent,
  SaleEquipmentComponent,
  MemberComponent,
  TranferComponent,
  SaleEquiComponent,
  MembershipComponent,
  InfoHelpComponent,
  InfoIversComponent,
  HomeComponent,
  InvestmentComponent,
  BusinessComponent,
  PersonalInfoComponent,
  PublicacionComponent,
  ResultSaleEquipamentComponent,
  ResultSaleComponent,
  ResultLiquidityComponent,
  ResulCLiquidityComponent,
  ResulCSaleComponent,
  PayComponent,
  InverComponent,
  EmpreComponent,
  ModalLiquidezComponent,
  ModalTraspasoComponent,
  ModalEquiposComponent,
  DatosRegistroRedSocialComponent,
  RecuperarContraseniaComponent,
  TerminosCondicionesComponent,
  PoliticaPrivacidadComponent
];

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    pages_routes,
    AppRoutingModule,
    CommonModule,
    MaterialModule,
    NgxSpinnerModule
  ],
  declarations: [...components, ContactoEquipamientoComponent, ContactoTraspasoComponent, SeguimientosComponent, 
    ],
  exports: [ReactiveFormsModule, ...components],
})
export class PageModule {}
