import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs";
import { InventoryModel } from "../models/inventory.model";
import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.services";

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})

export class StoreComponent implements OnInit, OnDestroy {
  isVisible = false;
  isCancelText = null;
  subscriptionsArray: Subscription[] = [];
  inventoryList: InventoryModel[]; 
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
    this.displayAllInventory();
  }

  displayAllInventory() {
    this.subscriptionsArray.push(
      this.eService.getAllInventory().subscribe((res) => {
        const temp = JSON.parse(res);
        // console.log(temp);
        this.inventoryList = temp;
      })
    );
  }

  onRedeem(item_id:string){
    var email = this.aService.getLoginUserName();
    var info = {email, item_id};
     this.subscriptionsArray.push(this.eService.onRedeem(info).subscribe((res) => {
      const temp = JSON.parse(res);
      console.log(temp);
      if(temp.msg === 'Successful'){
      this.createNotification("success", "Success", "Redeemed Item");
      }else{
        this.createNotification("error", "Failed", "Insufficient Balance");
      }
    }))
  }
  showModal(editUserId: number): void {
    this.editEmployeeId = editUserId;
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
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
