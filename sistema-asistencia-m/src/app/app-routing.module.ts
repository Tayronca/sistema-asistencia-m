import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DocentesComponent } from './admin/docentes/docentes.component';
import { NewComponent } from './admin/docentes/new/new.component';
import { AllComponent } from './admin/users/all/all.component';
import { AllComponent as AllDocentes } from './admin/docentes/all/all.component';
import { EditComponent as EditDocentes } from './admin/docentes/edit/edit.component';
import { EditComponent } from './admin/users/edit/edit.component';
import { NewUserComponent } from './admin/users/new-user/new-user.component';
import { UsersComponent } from './admin/users/users.component';
import { LoginComponent } from './login/login.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import { ZoomComponent } from './admin/zoom/zoom.component';
import { MatrizComponent } from './admin/matriz/all-matriz/matriz.component';
import { NewMatrizComponent } from './admin/matriz/new-matriz/new-matriz.component';
import { MatrizrComponent } from './admin/matriz/matrizr.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'login',component:LoginComponent, },
  {path:'admin',component:AdminComponent, canActivate: [AuthGuard],
    children:[
      {path:'users',component:UsersComponent,
        children:[
          {path:'',component:AllComponent},
          {path:'new', component:NewUserComponent},
          {path:'edit/:uid',component:EditComponent}
        ]
      },
      {path:'docentes',component:DocentesComponent,
      children:[
        {path:'',component:AllDocentes},
        {path:'new',component:NewComponent},
        {path:'edit/:id',component:EditDocentes}
      ]

      },
      {path:'fichas',component:ZoomComponent},
      {path:'asistencia',component:MatrizrComponent,
      children:[
        {path:'new',component:NewMatrizComponent},
        {path:'',component:MatrizComponent}
      ]}
      
    ]
      
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
