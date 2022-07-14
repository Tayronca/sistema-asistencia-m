import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

// Auth service
import { AuthService } from "./shared/services/auth.service";
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { AllComponent } from './admin/users/all/all.component';
import { AllComponent as AllDocentes } from './admin/docentes/all/all.component';
import { EditComponent as EditDocentes } from './admin/docentes/edit/edit.component';
import { NewUserComponent } from './admin/users/new-user/new-user.component';
import { EditComponent } from './admin/users/edit/edit.component';
import { DocentesComponent } from './admin/docentes/docentes.component';
import { NewComponent } from './admin/docentes/new/new.component';
import { ZoomComponent } from './admin/zoom/zoom.component';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { MatrizComponent } from './admin/matriz/all-matriz/matriz.component';
import { NewMatrizComponent } from './admin/matriz/new-matriz/new-matriz.component';
import { MatrizrComponent } from './admin/matriz/matrizr.component';
import { ReportComponent } from './admin/matriz/report/report.component';
import { ReportesComponent } from './admin/reportes/reportes.component';
import { ReportAprobadoComponent } from './admin/reportes/report-aprobado/report-aprobado.component';
import { PdfComponent } from './admin/reportes/pdf/pdf.component';
import { HomeComponent } from './admin/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    UsersComponent,
    NewUserComponent,
    AllComponent,
    EditComponent,
    DocentesComponent,
    NewComponent,
    AllDocentes,
    EditDocentes,
    ZoomComponent,
    AlertComponent,
    ConfirmComponent,
    MatrizComponent,
    NewMatrizComponent,
    MatrizrComponent,
    ReportComponent,
    ReportesComponent,
    ReportAprobadoComponent,
    PdfComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,    
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
