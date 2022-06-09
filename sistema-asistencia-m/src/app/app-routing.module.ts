import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AllComponent } from './admin/users/all/all.component';
import { NewUserComponent } from './admin/users/new-user/new-user.component';
import { UsersComponent } from './admin/users/users.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoginComponent } from './login/login.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'login',component:LoginComponent, },
  {path:'admin',component:AdminComponent, canActivate: [AuthGuard],
    children:[
      {path:'users',component:UsersComponent,
        children:[
          {path:'',component:AllComponent},
          {path:'new', component:NewUserComponent}
        ]
      }
    ]
      
},
  { path: 'verify-email-address', component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
