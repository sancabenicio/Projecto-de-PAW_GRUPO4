import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PageComponent } from './components/page/page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guard/auth.guard';
import { SucessComponent } from './components/sucess/sucess.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { InfoEventsComponent } from './components/info-events/info-events.component';
import { InfoPropertiesComponent } from './components/info-properties/info-properties.component';
import { ListPropertiesComponent } from './components/list-properties/list-properties.component';
import { ListEventsComponent } from './components/list-events/list-events.component';


const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'homepage', component: PageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'sucess', component: SucessComponent },
  { path: 'recoverPassword', component: RecoverPasswordComponent },
  { path: 'events/:id', component: InfoEventsComponent, canActivate: [AuthGuard] },
  { path: 'properties/:id', component: InfoPropertiesComponent, canActivate: [AuthGuard] },
  { path: 'properties', component: ListPropertiesComponent, canActivate: [AuthGuard] },
  { path: 'events', component: ListEventsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/homepage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
