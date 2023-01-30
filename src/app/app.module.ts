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
import { AdministratorComponent } from './components/sections/administrator/administrator.component';
import { HomeComponent } from './components/sections/home/home.component';
import { ClientComponent } from './components/sections/client/client.component';
import { ClientProfileComponent } from './components/sections/client/client-profile/client-profile.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CatalogsComponent } from './components/sections/public/catalogs/catalogs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    SidebarComponent,
    AdministratorComponent,
    HomeComponent,
    ClientComponent,
    ClientProfileComponent,
    ComingSoonComponent,
    CatalogsComponent,
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
