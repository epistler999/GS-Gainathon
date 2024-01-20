import { Component, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CardViewComponent } from "./allRecordings-view/allRecordings-view.component";
import { EmployeeFormComponent } from "./kt-detail-form/kt-detail-form.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";

import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthGuardService } from "./services/auth-gaurd.service";
import { LoginGaurdService } from "./services/login-gaurd.service";
import { SignupComponent } from "./signup/signup.component";
import { StoreComponent } from "./store/store.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    canActivate: [LoginGaurdService],
    component: LoginComponent,
  },
  {
    path: "signup",
    canActivate: [LoginGaurdService],
    component: SignupComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "card-view", component: CardViewComponent },
      { path: "store", component:StoreComponent},
      { path: "profile", component:ProfileComponent},
      { path: "leaderboard", component:LeaderboardComponent},
        // children:[{path:"",component:ProfileComponent}]},

      { path: "", redirectTo: "leaderboard", pathMatch: "full" },
    ],
  },
  { path: "employee-form", component: EmployeeFormComponent},
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
