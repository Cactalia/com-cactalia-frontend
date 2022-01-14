import { Component, OnInit } from '@angular/core';
import { StudyProgram } from 'src/app/models/StudyProgram.model';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { StudyProgramService } from 'src/app/services/study-program.service';
import { ReportService } from 'src/app/services/report.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-professor-study-programs',
  templateUrl: './professor-study-programs.component.html',
  styleUrls: ['./professor-study-programs.component.scss']
})
export class ProfessorStudyProgramsComponent implements OnInit {
  tokenUser: Token;
  studyPrograms: StudyProgram[] = [];
  actualPage:number;
  maxPages:number;
  totalStudyPrograms:number;
  idStudyProgramDetail:number;

  constructor(
    private loginService: LoginService,
    private studyProgramService: StudyProgramService,
    private reportService: ReportService,
  ) {
    this.actualPage=0;
    this.maxPages=1; 
  }

  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getStudyPrograms(this.actualPage);
    }
  }

  /**
  * getStudyPrograms
  * Método que obtiene los programas de estudio registrados.
  * @param page número de página a obtener
  */
   getStudyPrograms(page:number) {
    this.studyProgramService.selectByProfessor(this.tokenUser.id, page).subscribe(response => {
      this.studyPrograms = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalStudyPrograms= response.totalElements;
    });
  }

  /**
   * showDetail
   * Método que habilita el formulario para la vista de detalles del programa de estudio
   * @param idStudyProgram id del programa de estudio
   */
  showDetail(idStudyProgram:number){
    this.idStudyProgramDetail = idStudyProgram;
    
    if (idStudyProgram==null) {
      this.getStudyPrograms(this.actualPage);
    }
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
