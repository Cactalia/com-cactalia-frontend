/*
 * EvaluationGuideService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a guías de evaluación
 * FECHA DE CREACIÓN: 21/05/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EvaluationGuide } from '../models/EvaluationGuide.model';
import Swal from 'sweetalert2';

const API_EVALUATION_GUIDE_URL = environment.apiHostname + 'api/evaluation-guide/v1';

@Injectable({
  providedIn: 'root'
})
export class EvaluationGuideService {

  /**
 * constructor
 * Método para inicializar el servicio
 * @param http cliente http
 */
  constructor(private http: HttpClient) { }

  /**
   * assign
   * Método que envía al backend la asignación a registrar
   * @param assign asignación a registrar
   */
  assign(assign: EvaluationGuide) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_EVALUATION_GUIDE_URL + "/assign", assign, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#2c5234',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * selectAll
   * Método que solicita al backend las guías de evaluación registradas
   * @param idCoordinator id del coordinador
   * @param page página a obtener
   */
  selectAll(idCoordinator: number, page: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_EVALUATION_GUIDE_URL + '/coordinator/' + idCoordinator + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectById
   * Método que solicita al backend la guía de evaluación correspondiente a un id´
   * @param idEvaluationGuide id de guía de evaluación a obtener
   */
  selectById(idEvaluationGuide: number): Observable<EvaluationGuide> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_EVALUATION_GUIDE_URL + "/" + idEvaluationGuide, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectByProfessor
   * Método que solicita al backend las guías de evaluación registradas
   * @param idProfessor id del profesor 
   * @param page página a obtener
   */
  selectByProfessor(idProfessor: number, page: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_EVALUATION_GUIDE_URL + '/professor/' + idProfessor + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * delete
   * Método que elimina el registro de una guía de evaluación
   * @param id id de la guía de evaluación a eliminar
   */
  delete(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.delete(API_EVALUATION_GUIDE_URL + "/" + id, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#2c5234',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * selectByLearningUnitAndStatus
   * Método que obtiene las guías de evaluación asignadas a una unidad de aprendizaje por su estado
   * @param id id de la unidad de aprendizaje
   * @param status status por filtrar
   * @param page página a obtener
   */
   selectByLearningUnitAndStatus(id: number, status: number, page:number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_EVALUATION_GUIDE_URL+'/learningunit/'+id+'/status/'+status+'/page/'+page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * update
   * Método que actualiza una guía de evaluación
   * @param assign asignación a actualizar
   */
  update(assign: EvaluationGuide) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.put(API_EVALUATION_GUIDE_URL + "/assign", assign, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#2c5234',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * completeAssign
   * Método que completa la asignación de una guía de evaluación
   * @param assign asignación a completar
   */
  completeAssign(assign: EvaluationGuide) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_EVALUATION_GUIDE_URL + "/assign/complete", assign, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#2c5234',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
 * rejectAssign
 * Método que rechaza la asignación de una guía de evaluación
 * @param id id de la guía de evaluación
 */
  rejectAssign(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_EVALUATION_GUIDE_URL + "/assign/reject/" + id, null, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#2c5234',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * approveAssign
   * Método que aprueba la asignación de una guía de evaluación
   * @param id id de una guía de evaluación
   */
  approveAssign(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_EVALUATION_GUIDE_URL + "/assign/approve/" + id, null, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#2c5234',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
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