import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './view/home-page/home-page.component';
import { ContactDetailsComponent } from './view/contact-details/contact-details.component';
import { ContactEditComponent } from './view/contact-edit/contact-edit.component';
import { ContactPageComponent } from './view/contact-page/contact-page.component';
import { UserConnectingComponent } from './view/user-connecting/user-connecting.component';
import { LoginComponent } from './view/login/login.component';
import { SignUpComponent } from './view/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'contact/edit/:id', component: ContactEditComponent
  },
  {
    path: 'contact/edit', component: ContactEditComponent
  },
  {
    path: 'contact/:id',
    component: ContactDetailsComponent,
  },
  {
    path: 'contacts',
    component: ContactPageComponent,
  },
  {
    path: 'userConnecting', component: UserConnectingComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'signUp', component: SignUpComponent
  },
  {
    path: '', component: HomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
