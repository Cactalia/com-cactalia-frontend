import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EvaluationGuide } from 'src/app/models/EvaluationGuide.model';
import { ReportService } from 'src/app/services/report.service';
import { EvaluationGuideService } from 'src/app/services/evaluation-guide.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'evaluation-guide-list',
  templateUrl: './evaluation-guide-list.component.html',
  styleUrls: ['./evaluation-guide-list.component.scss']
})
export class EvaluationGuideListComponent implements OnInit {

  @Input()
  idLearningUnit: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  private datePipe = new DatePipe("es-MX");
  public evaluationGuides: EvaluationGuide[];
  private actualPage:number;
  private maxPages:number;
  private totalEvaluationGuides:number;

  constructor(
    private evaluationguideService: EvaluationGuideService,
    private reportService: ReportService
  ) {
    this.actualPage=0;
    this.maxPages=1;
   }

  ngOnInit(): void {
    if (this.idLearningUnit!= null) {
      this.getEvaluationGuideList(this.actualPage);
    }
  }

  /**
   * backToLearningUnitList
   * Método que regresa a la lista de unidades de aprendizaje
   */
   backToLearningUnitList(){
    this.newItemEvent.emit(null);
  }

  /**
   * getEvaluationGuideList
   * Método que obtiene la lista de guías de evaluación por el id de una unidad de aprendizaje
   * @param page página a obtener
   */
   getEvaluationGuideList(page:number) {
    this.evaluationguideService.selectByLearningUnitAndStatus(this.idLearningUnit, 3, page).subscribe(response => {
      if(response.content.length<=0){
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Unidad de aprendizaje sin guías de evaluación completadas',
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        })
        this.backToLearningUnitList();        
      }else{
        this.evaluationGuides = response.content;
        this.maxPages= response.totalPages;
        this.actualPage= page;
        this.totalEvaluationGuides= response.totalElements;
      }      
    });
  }

  /**
   * downloadReport
   * Método que descarga el reporte de una guía de evaluación
   * @param idEvaluationGuide id de la guía de evaluación a descargar
   * @param name nombre de la unidad de aprendizaje, utilizado para el nombre del archivo
   * @param version versión del programa de estudio, utilizado para el nombre del archivo
   * @param status estado del programa de estudio, utilizado para el nombre del archivo
   */
   downloadReport(idEvaluationGuide:number, name:string, version:number, status:string){
    this.reportService.evaluationGuide(idEvaluationGuide).subscribe(response => {
       this.reportService.viewEvaluationGuideReport(response, name, version,status);
    });    
  }  

}
