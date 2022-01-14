import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudyProgram } from 'src/app/models/StudyProgram.model';
import { ReportService } from 'src/app/services/report.service';
import { StudyProgramService } from 'src/app/services/study-program.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'study-program-list',
  templateUrl: './study-program-list.component.html',
  styleUrls: ['./study-program-list.component.scss']
})
export class StudyProgramListComponent implements OnInit {

  @Input()
  idLearningUnit: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  private datePipe = new DatePipe("es-MX");
  public studyPrograms: StudyProgram[];
  private actualPage:number;
  private maxPages:number;
  private totalStudyPrograms:number;

  constructor(
    private studyProgramService: StudyProgramService,
    private reportService: ReportService
  ) {
    this.actualPage=0;
    this.maxPages=1;
   }

  ngOnInit(): void {
    if (this.idLearningUnit!= null) {
      this.getStudyProgramList(this.actualPage);
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
   * getStudyProgramList
   * Método que obtiene la lista de programas de estudio por el id de una unidad de aprendizaje
   * @param page página a obtener
   */
   getStudyProgramList(page:number) {
    this.studyProgramService.selectByLearningUnitAndStatus(this.idLearningUnit, 3, page).subscribe(response => {
      if(response.content.length<=0){
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Unidad de aprendizaje sin programas de estudio completados',
          confirmButtonColor: '#55919e',
          cancelButtonColor: '#9b9b9b',
        })
        this.backToLearningUnitList();        
      }else{
        this.studyPrograms = response.content;
        this.maxPages= response.totalPages;
        this.actualPage= page;
        this.totalStudyPrograms= response.totalElements;
      }      
    });
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
