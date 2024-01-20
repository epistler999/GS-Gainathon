import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from "../services/auth.service";
import {ApiService} from "../services/api.services";

import { Subscription} from "rxjs";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup; // JSON
  subscriptionsArray: Subscription[] =[];
  ktData = [];
  itemHistoryData=[];


  constructor( private fb: FormBuilder, private aService: AuthService, private eService: ApiService) { }


  ngOnInit() {
    const email = this.aService.getDisplayLeaderboardUser() || this.aService.getLoginUserName();
    this.profileForm = this.fb.group({
      name : [null],
      points : [null],
      email : [null]
    });
    this.subscriptionsArray.push(
      this.eService
        .getEmployeeWithEmail(email)
        .subscribe((res) => {
          const tp = JSON.parse(res);
          this.profileForm.patchValue(tp);
          console.log(tp);
          this.ktData = tp.kt_list;
          this.itemHistoryData = tp.item_list;
          console.log(this.itemHistoryData);
        })
    );
  }
  ngOnDestroy(): void {
    this.aService.deleteDisplayLeaderboardUser();
    if (this.subscriptionsArray && this.subscriptionsArray.length) {
      this.subscriptionsArray.forEach((subs: Subscription) => {
        if (subs) {
          subs.unsubscribe();
        }
      });
    }
  }

}