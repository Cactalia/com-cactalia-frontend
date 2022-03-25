import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

const API_USER_CLIENT_URL = environment.apiHostname + 'service-client/api/v1/client';

@Injectable({
  providedIn: 'root'
})
export class UserClientService {

  /**
   * Método para inicializar el servicio
   * @param http cliente http
   */
   constructor(private http: HttpClient) { }

   /**
   * Método que solicita al backend los clientes registrados
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

    return this.http.get<any>(API_USER_CLIENT_URL, { headers, params}).pipe(
      catchError(e => {
        return this.handleError(e);
      })
    );
  }

  /**
   * Método que solicita al backend un cliente por su id
   * @param id del usuario
   */
   findById(id: string): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    
    return this.http.get<any>(API_USER_CLIENT_URL+"/"+id, { headers}).pipe(
      catchError(e => {
        return this.handleError(e);
      })
    );
  }

  /**
  * Método que retorna el error http suscitado
  * @param error error http
  */
   handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
