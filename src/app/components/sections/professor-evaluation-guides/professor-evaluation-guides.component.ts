import { Component, OnInit } from '@angular/core';
import { EvaluationGuide } from 'src/app/models/EvaluationGuide.model';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { EvaluationGuideService } from 'src/app/services/evaluation-guide.service';
import { ReportService } from 'src/app/services/report.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-professor-evaluation-guides',
  templateUrl: './professor-evaluation-guides.component.html',
  styleUrls: ['./professor-evaluation-guides.component.scss']
})
export class ProfessorEvaluationGuidesComponent implements OnInit {
  tokenUser: Token;
  evaluationGuides: EvaluationGuide[] = [];
  actualPage:number;
  maxPages:number;
  totalEvaluationGuides:number;
  idEvaluationGuideDetail:number;

  constructor(
    private loginService: LoginService,
    private evaluationGuideService: EvaluationGuideService,
    private reportService: ReportService,
  ) {
    this.actualPage=0;
    this.maxPages=1; 
   }

  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getEvaluationGuides(this.actualPage);
    }
  }

  /**
  * getEvaluationGuides
  * Método que obtiene las guías de evaluación registradas.
  */
   getEvaluationGuides(page:number) {
    this.evaluationGuideService.selectByProfessor(this.tokenUser.id, page).subscribe(response => {
      this.evaluationGuides = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalEvaluationGuides= response.totalElements;
    });
  }

  showDetail(idEvaluationGuide:number){
    this.idEvaluationGuideDetail = idEvaluationGuide;
    
    if (idEvaluationGuide==null) {
      this.getEvaluationGuides(this.actualPage);
    }
  }

  /**
   * downloadReport
   * Método que descarga el reporte de una guía de evaluación
   */
   downloadReport(idEvaluationGuide:number, name:string, version:number, status:string){
    this.reportService.evaluationGuide(idEvaluationGuide).subscribe(response => {
       this.reportService.viewEvaluationGuideReport(response, name, version,status);
    });    
  }

}
