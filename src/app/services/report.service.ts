/*
 * ReportService
 * DESCRIPCIÓN: Clase que consume los servicios del backend referentes a generación de reportes
 * FECHA DE CREACIÓN: 04/07/2021
 * CREADO POR: Oscar Emmanuel Lechuga Velazquez
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

const API_REPORT_URL = environment.apiHostname + 'api/report/v1';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  /**
  * constructor
  * Método para inicializar el servicio
  * @param http cliente http
  */
  constructor(private http: HttpClient) { }

  /**
   * studyProgram
   * Método que solicita al backend el reporte de un programas de estudio
   * @param idStudyProgram id del programa de estudio
   */
  studyProgram(idStudyProgram: number): Observable<Blob> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get(API_REPORT_URL + '/study-program/' + idStudyProgram, { headers, responseType: 'blob' }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Error al descargar archivo.",
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * viewStudyProgramReport
   * Método que permite la visualización del reporte en el navegador
   * @param response reporte
   * @param name nombre del programa de estudio
   * @param version versión del programa de estudio
   * @param status estado del programa de estudio
   */
  viewStudyProgramReport(response, name: string, version: number, status: string) {
    let fileName = name.split(' ').join('_') + "_v" + version + "_" + status;

    var newBlob = new Blob([response], { type: "application/pdf" });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, fileName);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(function () {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  /**
   * evaluationGuide
   * Método que solicita al backend el reporte de una guiá de evaluación
   * @param idEvaluationGuide id de la guiá de evaluación
   */
  evaluationGuide(idEvaluationGuide: number): Observable<Blob> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    const headers = {
      'Authorization': 'Bearer ' + userToken
    }
    return this.http.get(API_REPORT_URL + '/evaluation-guide/' + idEvaluationGuide, { headers, responseType: 'blob' }).pipe(
      catchError(e => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Error al descargar archivo.",
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        });
        return throwError("");
      })
    );
  }

  /**
   * viewEvaluationGuideReport
   * Método que permite la visualización del reporte en el navegador
   * @param response reporte
   * @param name nombre la guiá de evaluación
   * @param version versión la guiá de evaluación
   * @param status estado la guiá de evaluación
   */
  viewEvaluationGuideReport(response, name: string, version: number, status: string) {
    let fileName = name.split(' ').join('_') + "_v" + version + "_" + status;

    var newBlob = new Blob([response], { type: "application/pdf" });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, fileName);
      return;
    }

    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    setTimeout(function () {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
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
