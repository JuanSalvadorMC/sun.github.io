import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { LiquidityComponent } from './components/business/liquidity/liquidity.component';
import { SaleComponent } from './components/business/sale/sale.component';
import { SaleEquipmentComponent } from './components/business/sale-equipment/sale-equipment.component';
import { MemberComponent } from './components/investment/member/member.component';
import { SaleEquiComponent } from './components/investment/sale-equi/sale-equi.component';
import { TranferComponent } from './components/investment/tranfer/tranfer.component';
import { MembershipComponent } from './components/membership/membership.component';
import { HomeComponent } from './components/esp/home/home.component';
import { InfoIversComponent } from './components/esp/info-ivers/info-ivers.component';
import { InfoHelpComponent } from './components/esp/info-help/info-help.component';
import { InvestmentComponent } from './components/investment/investment.component';
import { BusinessComponent } from './components/business/business.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResultLiquidityComponent } from './components/result/result-liquidity/result-liquidity.component';
import { ResultSaleComponent } from './components/result/result-sale/result-sale.component';
import { ResultSaleEquipamentComponent } from './components/result/result-sale-equipament/result-sale-equipament.component';
import { ResulCLiquidityComponent } from './components/resultComplete/resul-cliquidity/resul-cliquidity.component';
import { PayComponent } from './components/membership/pay/pay.component';
import { InverComponent } from './components/user/register/inver/inver.component';
import { EmpreComponent } from './components/user/register/empre/empre.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';


const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
