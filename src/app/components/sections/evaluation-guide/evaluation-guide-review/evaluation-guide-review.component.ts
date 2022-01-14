import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EvaluationGuide } from 'src/app/models/EvaluationGuide.model';
import { EvaluationGuideService } from 'src/app/services/evaluation-guide.service';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportService } from 'src/app/services/report.service';

registerLocaleData(localeEsMX, 'es-MX');

@Component({
  selector: 'evaluation-guide-review',
  templateUrl: './evaluation-guide-review.component.html',
  styleUrls: ['./evaluation-guide-review.component.scss']
})
export class EvaluationGuideReviewComponent implements OnInit {

  public evaluationGuide: EvaluationGuide;
  private datePipe = new DatePipe("es-MX");
  public loadingRejectAssign:boolean=false;
  public loadingApproveAssign:boolean=false;

  @Input()
  idEvaluationGuide: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  constructor(
    private evaluationGuideService: EvaluationGuideService,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    if (this.idEvaluationGuide!= null) {
      this.getEvaluationGuideDetails(this.idEvaluationGuide);
    }
  }

  /**
   * getEvaluationGuideDetails
   * Método que obtiene una guía de evaluación por su id
   * @param idEvaluationGuide id de la guía de evaluación a obtener
   */
   getEvaluationGuideDetails(idEvaluationGuide: number) {
     
    this.evaluationGuideService.selectById(idEvaluationGuide).subscribe(response => {
      this.evaluationGuide = response;
    });
  }

  /**
   * showDetailsCancel
   * Método que regresa a la lista de guías de evaluación
   */
  showDetailsCancel(){
    this.newItemEvent.emit(null);
  }

  /**
   * rejectAssign
   * Método que rechaza la asignación de una guía de evaluación
   */
   rejectAssign() {
    Swal.fire({
      title: '¿Rechazar guía de evaluación?',
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
        this.evaluationGuideService.rejectAssign(this.evaluationGuide.id).subscribe(response => {
          this.showDetailsCancel();
          this.loadingRejectAssign=false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Guía de evaluación rechazada correctamente.',
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
   * Método que aprueba la asignación de una guía de evaluación
   */
   approveAssign() {
    Swal.fire({
      title: '¿Aprobar guía de evaluación?',
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
        this.evaluationGuideService.approveAssign(this.evaluationGuide.id).subscribe(response => {
          this.showDetailsCancel();
          this.loadingApproveAssign=false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Guía de evaluación aprobada correctamente.',
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
   * downloadReport()
   * Método que descarga el reporte de una guía de evaluación
   * @param idEvaluationGuide id de la guía de evaluación a descargar
   * @param name nombre de la unidad de aprendizaje, utilizado para el nombre del archivo
   * @param version versión de la guía de evaluación, utilizado para el nombre del archivo
   * @param status estado de la guía de evaluación, utilizado para el nombre del archivo
   */
   downloadReport(idEvaluationGuide:number, name:string, version:number, status:string){
    this.reportService.evaluationGuide(idEvaluationGuide).subscribe(response => {
       this.reportService.viewEvaluationGuideReport(response, name, version,status);
    });    
  }  

}