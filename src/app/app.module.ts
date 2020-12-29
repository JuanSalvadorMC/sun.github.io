import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationModule } from '@angular/core';

import { MaterialModule } from './@material/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { safeUrlPipe } from './shared/pipes/safe-url.pipe';
import { FctrlxAngularFileReader } from 'fctrlx-angular-file-reader';
import { PageModule} from './components/pages.module';

//Angular social Login
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatListModule } from '@angular/material/list';
import { TruncatePipe } from './shared/pipes/truncate.pipe';

//INTERCEPTOR
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  entryComponents:[
  ],
  declarations: [
    AppComponent,
    safeUrlPipe,
    TruncatePipe,
   
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    FctrlxAngularFileReader,
    PageModule,
    SocialLoginModule,
    NgxSpinnerModule,
    MatListModule,
    
   
    
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('589525219834-e8smkl242qrtkeooo01nh4e16ok4guda.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
          
            provider: new FacebookLoginProvider('1282025052136939'),
          /*   provider: new FacebookLoginProvider('293635001873719'),  bucio*/
          }
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
