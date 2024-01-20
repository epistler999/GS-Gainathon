import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs";
import { ktInfoModel } from "../models/ktInfo.model";
import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.services";

@Component({
  selector: "app-card-view",
  templateUrl: "./allRecordings-view.component.html",
  styleUrls: ["./allRecordings-view.component.scss"],
})
export class CardViewComponent implements OnInit, OnDestroy {
  isVisible = false;
  isCancelText = null;
  subscriptionsArray: Subscription[] = [];
  generalKTList: ktInfoModel[]; 
  page: number = 1;
  editEmployeeId: number;

  constructor(
    private fb: FormBuilder,
    private eService: ApiService,
    private notification: NzNotificationService,
    private aService: AuthService
  ) {}

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  ngOnInit() {
    this.displayAllRecordings();
  }

  displayAllRecordings() {
    this.subscriptionsArray.push(
      this.eService.getKTList(this.aService.getLoginUserName()).subscribe((res) => {
        const temp = JSON.parse(res);
        this.generalKTList = temp;
      })
    );
  }


  showModal(editUserId: number): void {
    this.editEmployeeId = editUserId;
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  onClick(link:any){
    window.open(link);
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
