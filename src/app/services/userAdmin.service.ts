/*
 * UserAdminService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a los usuarios administradores
 * FECHA DE CREACIÓN: 25/01/2022
 * CREADO POR: Oscar Emmanuel Lechuga Velazquez
 */

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

const API_USER_ADMIN_URL = environment.apiHostname + 'service-user/api/v1/user/admin';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  /**
   * constructor
   * Método para inicializar el servicio
   * @param http cliente http
   */
   constructor(private http: HttpClient) { }

   /**
   * selectAll
   * Método que solicita al backend los administradores registrados
   * @param page página a retornar
   */
  selectAll(page: number, size: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    let params = new HttpParams();
    params = params.append('size', size.toString());
    params = params.append('page', page.toString());

    return this.http.get<any>(API_USER_ADMIN_URL, { headers, params
    }).pipe(
      catchError(this.handleError)
    );
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
