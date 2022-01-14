import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { CoordinatorComponent } from './components/sections/coordinator/coordinator.component';
import { EvaluationGuideComponent } from './components/sections/evaluation-guide/evaluation-guide.component';
import { LearningUnitComponent } from './components/sections/learning-unit/learning-unit.component';
import { ProfessorAdministratorComponent } from './components/sections/professor-administrator/professor-administrator.component';
import { ProfessorCoordinatorComponent } from './components/sections/professor-coordinator/professor-coordinator.component';
import { ProfessorEvaluationGuidesComponent } from './components/sections/professor-evaluation-guides/professor-evaluation-guides.component';
import { ProfessorStudyProgramsComponent } from './components/sections/professor-study-programs/professor-study-programs.component';
import { ProfileComponent } from './components/sections/profile/profile.component';
import { StudyProgramComponent } from './components/sections/study-program/study-program.component';
import {NgxPermissionsGuard} from 'ngx-permissions';
import { PedagogicGuidesComponent } from './components/sections/pedagogic-guides/pedagogic-guides.component';
import { ProfessorPedagogicGuidesComponent } from './components/sections/professor-pedagogic-guides/professor-pedagogic-guides.component';

const routes: Routes = [
  {path: '',                              component: MainComponent,
    children:[
      {path: '',                          component: ProfileComponent},

      {path: 'perfil',                    component: ProfileComponent,                      canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_ADMIN','ROLE_COORDINATOR','ROLE_PROFESSOR'],   
        redirectTo: '/iniciar-sesion'}}
      },

      {path: 'administrador/profesores',  component: ProfessorAdministratorComponent,       canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_ADMIN'],   
        redirectTo: '/perfil'}}
      },

      {path: 'administrador/coordinadores',             component: CoordinatorComponent,                  canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_ADMIN'],   
        redirectTo: '/perfil'}}
      },

      {path: 'coordinador/unidades-aprendizaje',      component: LearningUnitComponent,                 canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_COORDINATOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'coordinador/profesores',    component: ProfessorCoordinatorComponent,         canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_COORDINATOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'coordinador/programas-estudio',         component: StudyProgramComponent,                 canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_COORDINATOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'coordinador/guias-evaluacion',          component: EvaluationGuideComponent,              canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_COORDINATOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'coordinador/guias-pedagogicas',          component: PedagogicGuidesComponent,              canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_COORDINATOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'profesor/programas-estudio',component: ProfessorStudyProgramsComponent,       canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_PROFESSOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'profesor/guias-evaluacion', component: ProfessorEvaluationGuidesComponent,    canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_PROFESSOR'],
        redirectTo: '/perfil'}}
      },

      {path: 'profesor/guias-pedagogicas', component: ProfessorPedagogicGuidesComponent,    canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ROLE_PROFESSOR'],
        redirectTo: '/perfil'}}
      },
    ]
  },
  {path: 'iniciar-sesion',  component: LoginComponent},
  {path: '**',              component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
