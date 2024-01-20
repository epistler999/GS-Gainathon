import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs";
import { signup } from "../models/signup.model";
import { ApiService } from "../services/api.services";
@Component({
  selector: "app-registration-form",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  userInput!: FormGroup;
  subscriptionsArray: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private eService: ApiService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.userInput = this.fb.group({
      uname: [null, [Validators.required]],
      uemail: [null, [Validators.email, Validators.required]],
      upassword: [null, [Validators.required]],
    });
  }
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }
  onSignUp(): void {
    if (this.userInput.valid) {
      let signupCredential: signup;
      signupCredential = {
        name: this.userInput.value.uname,
        email: this.userInput.value.uemail,
        password: this.userInput.value.upassword,
        role: "user",
      };

      this.subscriptionsArray.push(
        this.eService.onSignUp(signupCredential).subscribe(
          (res: any) => {
            const temp = JSON.parse(res);
            this.createNotification("success", "Signup", temp.msg);
            this.userInput.reset();
            this.router.navigate(["login"]);
          },
          (error: any) => {
            this.createNotification("error", "Error", error);
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
