/*
 * LoginService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a autenticación y permisos
 * FECHA DE CREACIÓN: 17/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../models/Token.model';
import { Login } from '../models/Login.model';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const CONS_ROUTES_ADMIN: RouteInfo[] = [
  { path: '/inicio', title: 'Inicio', icon: 'home', class: '' },
  { path: '/admin/administradores', title: 'Administradores', icon: 'badge', class: '' },
  { path: '/admin/clientes', title: 'Clientes', icon: 'people_alt', class: '' },
];

const API_OAUTH_URL = environment.apiHostname + 'api/security/v1/oauth/token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /**
   * constructor
   * Método para inicializar el servicio
   * @param http cliente http
   */
  constructor(private http: HttpClient) { }

  /**
   * login
   * Método que envía al backend los datos del formulario de ingreso al sistema
   * @param email email ingresado 
   * @param password contraseña ingresada
   */
  login(email: string, password: string): Observable<Login> {
    const headers = {
      'Authorization': 'Basic ' + btoa('angularapp:12345'),
      'Content-type': 'application/x-www-form-urlencoded'
    }
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password');

    return this.http.post<Login>(API_OAUTH_URL, body, { headers })
      .pipe(catchError(e => {
        return throwError(e.error.errors);
      })
      );
  }

  /**
     * getTokenModelByString
     * Método que decodifica el token recibido y lo retorna en un objeto Token
     * @param tokenString Cadena que contiene el token
     */
  getTokenModelByString(tokenString: string): Token {
    var tokenInfo: Token;

    tokenString = tokenString.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(tokenString).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    tokenInfo = JSON.parse(jsonPayload);
    return tokenInfo;
  }

  /**
  * setRoutesByRoles
  * Método que define las rutas permitidas para cada tipo de rol
  * @param roles Lista de roles del usuario
  */
  setRoutesByRoles(roles: string[]): any[] {
    let routes: any[];
    if (roles.includes("ROLE_ADMIN")) {
      routes = CONS_ROUTES_ADMIN.filter(menuItem => menuItem);
    } else {
      routes = null;
    }
    return routes;
  }

  /**
   * handleError
   * Método que retorna el error http suscitado
   * @param error error http
   */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}