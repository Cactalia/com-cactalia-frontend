import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdministratorComponent } from './components/sections/administrator/administrator.component';
import { HomeComponent } from './components/sections/home/home.component';
import { ClientComponent } from './components/sections/client/client.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: HomeComponent },

      {
        path: 'inicio', component: HomeComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ROLE_ADMIN'],
            redirectTo: '/iniciar-sesion'
          }
        }
      },

      {
        path: 'admin/administradores', component: AdministratorComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ROLE_ADMIN'],
            redirectTo: '/perfil'
          }
        }
      },

      {
        path: 'admin/clientes', component: ClientComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ROLE_ADMIN'],
            redirectTo: '/perfil'
          }
        }
      },

    ]
  },
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
