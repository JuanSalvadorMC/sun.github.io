import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent ,HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2'
import { NotificacionesService } from './notificaciones.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  private isRefresing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  logout: boolean = false;

  constructor(private authService: AuthService, private notificacionesService: NotificacionesService) 
  {

  }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    const token: string = localStorage.getItem('SCtoken');

    if(token && !request.headers.get('skip'))
    {
      request = this.addToken(request, token);
    } else {
      request = request.clone({ headers: request.headers.delete('skip','true') });
    }

    return next.handle(request).pipe(catchError(error => {
      if(error instanceof HttpErrorResponse && error.status === 401)
      {
        return this.handle401Error(request, next);
      }
      else
      {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string)
  {
    return request.clone({
      setHeaders: {
        Authorization: "Bearer " + token
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler)
  {
    if(!this.isRefresing)
    {
      this.isRefresing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefresing = false;
          this.refreshTokenSubject.next(token.refreshtoken);
          return next.handle(this.addToken(request, token.refreshtoken));
        }), error => {
          this.isRefresing = false;
          this.logout = true;
          this.notificacionesService.lanzarNotificacion('La sesión caducó','Error', 'error');
          this.authService.logout();
          return Observable.throw(error);
        }
      )
    }
    else
    {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      )
    }
  }
}
