//modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//componentes

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
/* import { NotFoundComponent } from '../pages/not-found/not-found.component'; */
import { PagesComponent } from '../components/pages/pages.component';
import { OnlyNumber } from './directives/only-number.directive';
import { CurrencyFormatterDirective } from './directives/currency-formatter.directive';
import { LimitePipe } from './pipes/limite.pipe';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [
    NavbarComponent,
    FooterComponent,
    /* NotFoundComponent, */
    PagesComponent,
    OnlyNumber,
    CurrencyFormatterDirective,
    LimitePipe,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    /* NotFoundComponent, */
    PagesComponent,
    OnlyNumber,
    CurrencyFormatterDirective,
  ],
})
export class SharedModule {}
