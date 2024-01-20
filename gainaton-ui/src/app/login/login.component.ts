import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { login } from "../models/login.model";
import { AuthService } from "../services/auth.service";
import { ApiService} from "../services/api.services";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  userInput!: FormGroup;
  subscriptionsArray: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private eService: ApiService,
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.userInput = this.fb.group({
      uemail: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }
  onLogin(): void {
    if (this.userInput.valid) {
      let loginCredential: login;
      loginCredential = {
        username: this.userInput.value.uemail,
        password: this.userInput.value.password,
      };
      // console.log("valid");
      this.subscriptionsArray.push(
        this.eService.onLogin(loginCredential).subscribe(
          (res) => {
            const temp = JSON.parse(res);
            // console.log(temp);
            if (temp.msg === "Valid user") {
              this.authService.onlogin(loginCredential);
              this.createNotification("success", "Login", "Login Successful");
              this.userInput.reset();
              this.router.navigate(["home"]);
            } else {
              this.createNotification(
                "warning",
                "Warning",
                temp
              );
            } 
          },
          (error: any) => {
            const temp = JSON.parse(error.error);
            this.createNotification("error", "Error",temp.msg);
          }
        )
      );
    } else {
      Object.values(this.userInput.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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
