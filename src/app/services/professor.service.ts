/*
 * ProfessorService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a los profesores
 * FECHA DE CREACIÓN: 25/11/2020
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Professor } from '../models/Professor.model';

const API_PROFESSOR_URL = environment.apiHostname + 'api/professor/v1';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  /**
   * constructor
   * Método para inicializar el servicio
   * @param http cliente http
   */
  constructor(private http: HttpClient) { }

  /**
   * selectAll
   * Método que solicita al backend los profesores registrados
   * @param page página a retornar
   */
  selectAll(page: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_PROFESSOR_URL + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * selectAllList
   * Método que solicita al backend los profesores registrados en lista
   * @param idCoordinator id del coordinador del cual se obtendrá la carrera
   */
  selectAllList(idCoordinator: number): Observable<Professor[]> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_PROFESSOR_URL + "/coordinator/" + idCoordinator, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * createProfessor
    * Método que envía al backend el profesor a registrar
    * @param professor profesor a registrar
    */
  createProfessor(professor: Professor) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_PROFESSOR_URL + "/", professor, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * deleteProfessor
   * Método que envía al backend el id del profesor a eliminar
   * @param id id del profesor a eliminar
   */
  deleteProfessor(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.delete(API_PROFESSOR_URL + "/" + id, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
 * selectProfessorByDegree
 * Método que solicita al backend los profesores registrados por carrera
 * @param page página a retornar
 * @param idCoordinator id del coordinador del cual se obtendrá la carrera
 */
  selectProfessorByDegree(page: number, idCoordinator: number): Observable<any> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get<any>(API_PROFESSOR_URL + '/page/' + page + '/coordinator/' + idCoordinator, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * deleteAssign
   * Método que enviá al backend el id del profesor y el id del coordinador para eliminar la asignación
   * @param idProfessor id del profesor
   * @param idCoordinator id del coordinador
   */
  deleteAssign(idProfessor: number, idCoordinator) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.delete(API_PROFESSOR_URL + "/" + idProfessor + "/assign/" + idCoordinator, { headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * addProfessor
   * Método que envía al backend el profesor a agregar a la carrera
   * @param email correo electrónico del profesor a registrar
   * @param idCoordinator id del coordinador del cual se obtendrá la carrera
   */
  addProfessor(email: string, idCoordinator: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    let body = new HttpParams();
    body = body.set('email', email);
    body = body.set('idcoordinator', idCoordinator + "");
    return this.http.post<any>(API_PROFESSOR_URL + "/assign-degree", body, { headers: headers }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: e.error.error.message.replaceAll(/~/g, ""),
          confirmButtonColor: '#55919e',
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