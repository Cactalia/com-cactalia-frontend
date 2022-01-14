/*
 * StudyProgramService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a programas de estudio
 * FECHA DE CREACIÓN: 21/05/2021
 * CREADO POR: Oscar Emmanuel Lechuga Velazquez
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StudyProgram } from '../models/StudyProgram.model';
import Swal from 'sweetalert2';

const API_STUDY_PROGRAM_URL = environment.apiHostname + 'api/study-program/v1';

@Injectable({
  providedIn: 'root'
})
export class StudyProgramService {

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
  assign(assign: StudyProgram) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_STUDY_PROGRAM_URL + "/assign", assign, { headers }).pipe(
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
   * Método que solicita al backend los programas de estudio registrados
   * @param idCoordinator id del coordinador
   * @param page página a obtener
   */
  selectAll(idCoordinator: number, page: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_STUDY_PROGRAM_URL + '/coordinator/' + idCoordinator + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectById
   * Método que solicita al backend el programas de estudio correspondiente a un id
   * @param idStudyProgram id del programa de estudio
   */
  selectById(idStudyProgram: number): Observable<StudyProgram> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_STUDY_PROGRAM_URL + "/" + idStudyProgram, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectByProfessor
   * Método que solicita al backend los programas de estudio registrados por profesor
   * @param idProfessor id del profesor
   * @param page página a obtener
   */
  selectByProfessor(idProfessor: number, page: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_STUDY_PROGRAM_URL + '/professor/' + idProfessor + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * delete
   * Método que elimina el registro de un programa de estudio
   * @param id id del programa de estudio a eliminar
   */
  delete(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.delete(API_STUDY_PROGRAM_URL + "/" + id, { headers }).pipe(
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
   * selectByLearningUnit
   * Método que tare los programas de estudio asignados a una unidad de aprendizaje
   * @param id id de la unidad de aprendizaje
   */
  selectByLearningUnit(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_STUDY_PROGRAM_URL + '/learningunit/' + id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectByLearningUnitAndStatus
   * Método que obtiene los programas de estudio asignados a una unidad de aprendizaje por su estado
   * @param id id de la unidad de aprendizaje
   * @param status status por filtrar
   * @param page página a obtener
   */
   selectByLearningUnitAndStatus(id: number, status: number, page:number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_STUDY_PROGRAM_URL+'/learningunit/'+id+'/status/'+status+'/page/'+page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * update
   * Método que actualiza un programa de estudio
   * @param assign asignación a registrar
   */
  update(assign: StudyProgram) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.put(API_STUDY_PROGRAM_URL + "/assign", assign, { headers }).pipe(
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
   * Método que completa la asignación de un programa de estudio
   * @param assign asignación a registrar
   */
  completeAssign(assign: StudyProgram) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_STUDY_PROGRAM_URL + "/assign/complete", assign, { headers }).pipe(
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
   * Método que rechaza la asignación de un programa de estudio
   * @param id id del programa de estudio
   */
  rejectAssign(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_STUDY_PROGRAM_URL + "/assign/reject/" + id, null, { headers }).pipe(
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
   * Método que aprueba la asignación de un programa de estudio
   * @param id id del programa de estudio
   */
  approveAssign(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_STUDY_PROGRAM_URL + "/assign/approve/" + id, null, { headers }).pipe(
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