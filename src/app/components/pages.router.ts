import { RouterModule ,Routes } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { LoginComponent } from './user/login/login.component';
import { InverComponent } from './user/register/inver/inver.component';
import { EmpreComponent } from './user/register/empre/empre.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './esp/home/home.component';
import { InfoIversComponent } from './esp/info-ivers/info-ivers.component';
import { InfoHelpComponent } from './esp/info-help/info-help.component';
import { LiquidityComponent } from './business/liquidity/liquidity.component';
import { SaleComponent } from './business/sale/sale.component';
import { SaleEquipmentComponent } from './business/sale-equipment/sale-equipment.component';
import { MemberComponent } from './investment/member/member.component';
import { MembershipComponent } from './membership/membership.component';
import { TranferComponent } from './investment/tranfer/tranfer.component';
import { SaleEquiComponent } from './investment/sale-equi/sale-equi.component';
import { InvestmentComponent } from './investment/investment.component';
import { BusinessComponent } from './business/business.component';
import { ResultLiquidityComponent } from './result/result-liquidity/result-liquidity.component';
import { ResultSaleComponent } from './result/result-sale/result-sale.component';
import { ResultSaleEquipamentComponent } from './result/result-sale-equipament/result-sale-equipament.component';
import { PayComponent } from './membership/pay/pay.component';
import { ResulCLiquidityComponent } from './resultComplete/resul-cliquidity/resul-cliquidity.component';

const pagesRoutes: Routes = [
          {
            path: '', component: NavbarComponent,
         children : [
            { path : 'user/login', component : LoginComponent },
            { path : 'user/register/investment', component : InverComponent },
            { path : 'user/register/entrepreneur', component : EmpreComponent },
            { path : 'user/profile/:id', component : ProfileComponent },
            { path : 'esp/home', component : HomeComponent },
            { path : 'esp/info-invers', component : InfoIversComponent },
            { path : 'esp/info-help', component : InfoHelpComponent },
            { path : 'liquidity', component : LiquidityComponent },
            { path : 'sale', component : SaleComponent },
            { path : 'sale-equipment', component : SaleEquipmentComponent },
            { path : 'investment/member', component : MemberComponent },
            { path : 'investment/sale', component : SaleEquiComponent },
            { path : 'investment/transfer', component : TranferComponent },
            { path : 'membership', component : MembershipComponent },
            { path : 'investment', component : InvestmentComponent },
            { path : 'business', component : BusinessComponent },
            { path : 'result/liquidity', component: ResultLiquidityComponent },
            { path : 'result/sale', component: ResultSaleComponent },
            { path : 'result/sale-equipament', component: ResultSaleEquipamentComponent },
            { path : 'pay', component: PayComponent },
            { path : 'prueba', component: ResulCLiquidityComponent },
             { path : '', component : HomeComponent },
            
           /*  { path : '', component: NavbarComponent } */
           
         /*    
          
            { path: '**', component: NotFoundComponent } */
            
         ]
      } ,
      
]
export const pages_routes = RouterModule.forChild(pagesRoutes); 