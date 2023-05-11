import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './cmps/index/index.component';
import { HeaderComponent } from './cmps/header/header.component';
import { FooterComponent } from './cmps/footer/footer.component';
import { ContactFilterComponent } from './cmps/contact-filter/contact-filter.component';
import { ContactPreviewComponent } from './cmps/contact-preview/contact-preview.component';
import { MovePreviewComponent } from './cmps/move-preview/move-preview.component';
import { ContactDetailsComponent } from './view/contact-details/contact-details.component';
import { ContactEditComponent } from './view/contact-edit/contact-edit.component';
import { ContactPageComponent } from './view/contact-page/contact-page.component';
import { HomePageComponent } from './view/home-page/home-page.component';
import { LoginComponent } from './view/login/login.component';
import { SignUpComponent } from './view/sign-up/sign-up.component';
import { TransferFundComponent } from './view/transfer-fund/transfer-fund.component';
import { UserConnectingComponent } from './view/user-connecting/user-connecting.component';
import { MovesPreviewComponent } from './cmps/moves-preview/moves-preview.component';
import { MoveListComponent } from './cmps/move-list/move-list.component';
import { ContactListComponent } from './cmps/contact-list/contact-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    HeaderComponent,
    FooterComponent,
    ContactFilterComponent,
    ContactPreviewComponent,
    MovePreviewComponent,
    ContactDetailsComponent,
    ContactEditComponent,
    ContactPageComponent,
    HomePageComponent,
    LoginComponent,
    SignUpComponent,
    TransferFundComponent,
    UserConnectingComponent,
    MovesPreviewComponent,
    MoveListComponent,
    ContactListComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }