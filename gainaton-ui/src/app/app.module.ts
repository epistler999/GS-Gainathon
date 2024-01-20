import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NzTableModule } from 'ng-zorro-antd/table';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgZorroAntdModule, NZ_I18N, en_US, NzFormModule } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { CardViewComponent } from "./allRecordings-view/allRecordings-view.component";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { HomeComponent } from "./home/home.component";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NgxPaginationModule } from "ngx-pagination";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { EmployeeFormComponent } from "./kt-detail-form/kt-detail-form.component";
import { StoreComponent } from './store/store.component';
import { ProfileComponent } from "./profile/profile.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { LikesComponent } from './allRecordings-view/likes/likes.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    CardViewComponent,
    LoginComponent,
    LeaderboardComponent,
    SignupComponent,
    HomeComponent,
    PageNotFoundComponent,
    EmployeeFormComponent,
    StoreComponent,
    ProfileComponent,
    LikesComponent,
  ],
  imports: [
    NzTableModule,
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NzFormModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule,
    NzLayoutModule,
    NzAnchorModule,
    NgxPaginationModule,
    NzPaginationModule,
    NzDatePickerModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
