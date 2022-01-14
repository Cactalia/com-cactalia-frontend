/*
 * DegreeService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a las carreras
 * FECHA DE CREACIÓN: 25/11/2020
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Degree } from '../models/Degree.model';

const API_DEGREE_URL = environment.apiHostname + 'api/degree/v1';

@Injectable({
  providedIn: 'root'
})
export class DegreeService {

  /**
   * constructor
   * Método para inicializar el servicio
   * @param http cliente http
   */
  constructor(private http: HttpClient) { }

  /**
   * selectAll
   * Método que solicita al backend las carreras sin coordinador
   */
  selectDegreesWithoutCoordinator(): Observable<Degree[]> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<Degree[]>(API_DEGREE_URL + '/without-coordinator', { headers }).pipe(
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