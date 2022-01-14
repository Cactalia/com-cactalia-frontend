import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StudyProgram } from 'src/app/models/StudyProgram.model';
import { StudyProgramService } from 'src/app/services/study-program.service';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportService } from 'src/app/services/report.service';

registerLocaleData(localeEsMX, 'es-MX');

@Component({
  selector: 'study-program-review',
  templateUrl: './study-program-review.component.html',
  styleUrls: ['./study-program-review.component.scss']
})
export class StudyProgramReviewComponent implements OnInit {

  public studyProgram: StudyProgram;
  private datePipe = new DatePipe("es-MX");
  public loadingRejectAssign:boolean=false;
  public loadingApproveAssign:boolean=false;

  @Input()
  idStudyProgram: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  constructor(
    private studyProgramService: StudyProgramService,
    private reportService: ReportService,
  ) {}
  
  ngOnInit(): void {
    if (this.idStudyProgram!= null) {
      this.getStudyProgramDetails(this.idStudyProgram);
    }
  }

  /**
   * getStudyProgramDetails
   * Método que obtiene un programa de estudio por su id
   * @param idStudyProgram id del programa de estudio a obtener
   */
   getStudyProgramDetails(idStudyProgram: number) {     
    this.studyProgramService.selectById(idStudyProgram).subscribe(response => {
      this.studyProgram = response;
    });
  }

  /**
   * showDetailsCancel
   * Método que regresa a la lista de programas de estudio
   */
  showDetailsCancel(){
    this.newItemEvent.emit(null);
  }

  /**
   * rejectAssign
   * Método que rechaza la asignación de un programa de estudio
   */
   rejectAssign() {
    Swal.fire({
      title: '¿Rechazar programa de estudio?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingRejectAssign=true;
        this.studyProgramService.rejectAssign(this.studyProgram.id).subscribe(response => {
          this.showDetailsCancel();
          this.loadingRejectAssign=false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Programa de estudio rechazado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        }, error => {
          this.loadingRejectAssign = false;
        });
      }
    })
  }

  /**
   * approveAssign
   * Método que aprueba la asignación de un programa de estudio
   */
   approveAssign() {
    Swal.fire({
      title: '¿Aprobar programa de estudio?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingApproveAssign=true;
        this.studyProgramService.approveAssign(this.studyProgram.id).subscribe(response => {
          this.showDetailsCancel();
          this.loadingApproveAssign=false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Programa de estudio aprobado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        }, error => {
          this.loadingApproveAssign = false;
        });
      }
    })
  }

  /**
   * downloadReport
   * Método que descarga el reporte de un programa de estudio
   * @param idStudyProgram id del programa de estudio a descargar
   * @param name nombre de la unidad de aprendizaje, utilizado para el nombre del archivo
   * @param version versión del programa de estudio, utilizado para el nombre del archivo
   * @param status estado del programa de estudio, utilizado para el nombre del archivo
   */
  downloadReport(idStudyProgram:number, name:string, version:number, status:string){
    this.reportService.studyProgram(idStudyProgram).subscribe(response => {
       this.reportService.viewStudyProgramReport(response, name, version,status);
    });    
  }  

}
