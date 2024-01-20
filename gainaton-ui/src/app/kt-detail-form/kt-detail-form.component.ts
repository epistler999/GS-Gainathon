import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs/internal/Subscription";
import { ktInfoModel } from "../models/ktInfo.model";
import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.services";

@Component({
  selector: "app-kt-detail-form",
  templateUrl: "./kt-detail-form.component.html",
  styleUrls: ["./kt-detail-form.component.scss"],
})
export class EmployeeFormComponent implements OnInit {
  @Input() editEmployeeId: string;
  @Input() isAddEmployee: boolean;
  subscriptionsArray: Subscription[] = [];
  employeeList: ktInfoModel[]; 
  employeeForm!: FormGroup;
  page: number = 1;

  constructor(
    private fb: FormBuilder,
    private aService: AuthService,
    private eService: ApiService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      topic: [null],
      link: [null, [Validators.required]],
      description: [null,[Validators.required]],
      email: this.aService.getLoginUserName(),
    });
    if (!this.isAddEmployee) {
      this.subscriptionsArray.push(
        this.eService
          .getEmployeeWithEmail(this.editEmployeeId)
          .subscribe((res) => {
            this.employeeForm.patchValue(res);
          })
      );
    }
  }

  displayAllEmployee() {
    this.subscriptionsArray.push(
      this.eService.getKTList(this.aService.getLoginUserName).subscribe((res) => {
        this.employeeList = res;
      })
    );
  }

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }
  onSubmit(): void {
    const editUserId = this.employeeForm.value.id;
    if (this.employeeForm.valid) {
      let employeeObj: ktInfoModel;
      employeeObj = this.employeeForm.value;
      if (this.isAddEmployee) {
        this.subscriptionsArray.push(
          this.eService.postEmployee(employeeObj).subscribe(
            (res) => {
              const temp = JSON.parse(res);
              this.createNotification(
                "success",
                "Successful",
                temp.msg
              );
            },
            (error) => {
              this.createNotification("error", "Error", error);
            }
          )
        );
      } else {
        this.subscriptionsArray.push(
          this.eService.updateEmployeeWithId(employeeObj, editUserId).subscribe(
            
            (res) => {
              const temp = JSON.parse(res);
              this.displayAllEmployee();
              this.createNotification(
                "success",
                "Updated",
                temp.msg
              );
            },
            (error) => {
              this.createNotification("error", "Error", error);
            }
          )
        );
      }
    } else {
      Object.values(this.employeeForm.controls).forEach((control) => {
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
