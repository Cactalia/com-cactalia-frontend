import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/main/navbar/navbar.component';
import { SidebarComponent } from './components/main/sidebar/sidebar.component';
import { ProfileComponent } from './components/sections/profile/profile.component';
import { ProfessorAdministratorComponent } from './components/sections/professor-administrator/professor-administrator.component';
import { CoordinatorComponent } from './components/sections/coordinator/coordinator.component';
import { LearningUnitComponent } from './components/sections/learning-unit/learning-unit.component';
import { ProfessorCoordinatorComponent } from './components/sections/professor-coordinator/professor-coordinator.component';
import { StudyProgramComponent } from './components/sections/study-program/study-program.component';
import { EvaluationGuideComponent } from './components/sections/evaluation-guide/evaluation-guide.component';
import { StudyProgramDetailComponent } from './components/sections/study-program/study-program-detail/study-program-detail.component';
import { EvaluationGuideDetailComponent } from './components/sections/evaluation-guide/evaluation-guide-detail/evaluation-guide-detail.component';
import { ProfessorStudyProgramsComponent } from './components/sections/professor-study-programs/professor-study-programs.component';
import { ProfessorEvaluationGuidesComponent } from './components/sections/professor-evaluation-guides/professor-evaluation-guides.component';
import { StudyProgramProfessorDetailComponent } from './components/sections/professor-study-programs/study-program-professor-detail/study-program-professor-detail.component';
import { StudyProgramReviewComponent } from './components/sections/study-program/study-program-review/study-program-review.component';
import { EvaluationGuideProfessorDetailComponent } from './components/sections/professor-evaluation-guides/evaluation-guide-professor-detail/evaluation-guide-professor-detail.component';
import { EvaluationGuideReviewComponent } from './components/sections/evaluation-guide/evaluation-guide-review/evaluation-guide-review.component';
import { PedagogicGuidesComponent } from './components/sections/pedagogic-guides/pedagogic-guides.component';
import { ProfessorPedagogicGuidesComponent } from './components/sections/professor-pedagogic-guides/professor-pedagogic-guides.component';
import { StudyProgramListComponent } from './components/sections/learning-unit/study-program-list/study-program-list.component';
import { EvaluationGuideListComponent } from './components/sections/learning-unit/evaluation-guide-list/evaluation-guide-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    ProfileComponent,
    ProfessorAdministratorComponent,
    CoordinatorComponent,
    LearningUnitComponent,
    ProfessorCoordinatorComponent,
    StudyProgramComponent,
    EvaluationGuideComponent,
    StudyProgramDetailComponent,
    EvaluationGuideDetailComponent,
    ProfessorStudyProgramsComponent,
    ProfessorEvaluationGuidesComponent,
    StudyProgramProfessorDetailComponent,
    StudyProgramReviewComponent,
    EvaluationGuideProfessorDetailComponent,
    EvaluationGuideReviewComponent,
    PedagogicGuidesComponent,
    ProfessorPedagogicGuidesComponent,
    StudyProgramListComponent,
    EvaluationGuideListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
