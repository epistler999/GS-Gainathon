import { Component, OnInit } from "@angular/core";
import { FormBuilder} from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { LeaderboardDescription } from "../models/leaderboardDescription.model";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.services";

@Component({
  selector: "app-leaderboard-view",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"],
})
export class LeaderboardComponent implements OnInit {
  pageIndex = 1;
  pageSize = 8;
  isVisible = false;
  isCancelText = null;
  subscriptionsArray: Subscription[] = [];
  leaderboardList: LeaderboardDescription[]; 
  page: number = 1;
  defaultOption: string = "count";

  constructor(
    private fb: FormBuilder,
    private eService:ApiService,
    private notification: NzNotificationService,
    private aService: AuthService,
    private router: Router,
  ) {}

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  ngOnInit() {
    this.displayLeaderboard(this.defaultOption);
  }

  displayLeaderboard(defaultOption:string) {
    this.subscriptionsArray.push(
      this.eService.getLeaderboardDetails(defaultOption).subscribe((res) => {
        const tp = JSON.parse(res);
        this.leaderboardList = tp;
      })
    );
  }

  displayUserProfileWithEmail(email:string){
        this.aService.displayLeaderboardUser(email);
        this.router.navigate(["home/profile"]);
  }
  deleteEmployeeWithId(id: number) {
    this.subscriptionsArray.push(
      this.eService.deleteEmployeeWithId(id).subscribe((res) => {
        this.displayLeaderboard(this.defaultOption);
      })
    );
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
