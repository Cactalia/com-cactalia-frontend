/*
 * CoordinatorService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a los coordinadores
 * FECHA DE CREACIÓN: 25/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velazquez
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Coordinator } from '../models/Coordinator.model';

const API_COORDINATOR_URL = environment.apiHostname + 'api/coordinator/v1';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {

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
    return this.http.get<any>(API_COORDINATOR_URL + '/page/' + page, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
    * createCoordinator
    * Método que envía al backend el coordinador a registrar
    * @param coordinador coordinador a registrar
    */
  createCoordinator(coordinator: Coordinator) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.post(API_COORDINATOR_URL + "/", coordinator, { headers }).pipe(
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
   * deleteCoordinator
   * Método que envía al backend el id del coordinador a eliminar
   * @param id id del coordinador a eliminar
   */
  deleteCoordinator(id: number) {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.delete(API_COORDINATOR_URL + "/" + id, { headers }).pipe(
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