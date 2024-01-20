import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ApiService } from "../services/api.services";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
    private eService: ApiService
  ) {}

  currUser = ""; 
  isVisible = false;
  isAddEmployee = false;
  subscriptionsArray: Subscription[] = [];
  ngOnInit() {
    this.subscriptionsArray.push(this.eService.getEmployeeWithEmail(this.authService.getLoginUserName()).subscribe((res)=>{
      const tp = JSON.parse(res);
      console.log(tp);
      this.currUser = tp.name;
      console.log(this.currUser);
    }))
  }

  onAddEmployee(): void {
    this.isVisible = true;
    this.isAddEmployee = true;
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isAddEmployee = false;
  }
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }
  onLogout() {
    const currUser = this.authService.getLoginUserName();
    this.subscriptionsArray.push(this.eService.onLogout(currUser).subscribe(
      (res)=>{
        this.createNotification("success", "Logout", res.msg);
        this.authService.onLogout();
        this.router.navigate(["login"]);        
      }
    ))
     
  }

  ngOnDestroy(): void {
    if (this.subscriptionsArray && this.subscriptionsArray.length) {
      this.subscriptionsArray.forEach((subs: Subscription) => {
        if (subs) {
          subs.unsubscribe();
        }
      });
    }
  }
}
