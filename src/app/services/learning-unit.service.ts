/*
 * LearningUnitService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a las unidades de aprendizaje
 * FECHA DE CREACIÓN: 26/04/2021
 * CREADO POR: Oscar Emmanuel Lechuga Velazquez
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LearningUnit } from '../models/LearningUnit.model';

const API_LEARNING_UNIT_URL = environment.apiHostname + 'api/learning-unit/v1';

@Injectable({
  providedIn: 'root'
})
export class LearningUnitService {

  /**
   * constructor
   * Método para inicializar el servicio
   * @param http cliente http
   */
  constructor(private http: HttpClient) { }

  /**
   * selectByDegree
   * Método que solicita al backend las unidades de aprendizaje registradas
   * @param idCoordinator id del coordinador para obtener carrera
   * @param page página a retornar
   */
  selectByDegree(idCoordinator: number, page: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_LEARNING_UNIT_URL + '/coordinator/' + idCoordinator + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectListByDegree
   * Método que solicita al backend las unidades de aprendizaje registradas
   * @param idCoordinator id del coordinador para obtener carrera
   */
  selectListByDegree(idCoordinator: number): Observable<LearningUnit[]> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_LEARNING_UNIT_URL + '/coordinator/' + idCoordinator, { headers }).pipe(
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