import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdministratorComponent } from './components/sections/administrator/administrator.component';
import { HomeComponent } from './components/sections/home/home.component';
import { ClientComponent } from './components/sections/client/client.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CatalogsComponent } from './components/sections/public/catalogs/catalogs.component';

const routes: Routes = [
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: 'catalogos', component: CatalogsComponent },
  { path: '**', component: ComingSoonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
