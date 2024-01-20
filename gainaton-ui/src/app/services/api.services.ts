import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { ktInfoModel } from "../models/ktInfo.model";
import { login } from "../models/login.model";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postEmployee(data: any) {
    return this.http.post<any>("http://localhost:3001/api/event", data);
  }
  getKTList(data:any) {
    return this.http.get<any>("http://localhost:3001/api/ktList");
  }

  getLeaderboardDetails(defaultOption:string){
    // console.log(defaultOption);
    return this.http.get<any>("http://localhost:3001/api/user/"+ defaultOption);
  }

  getEmployeeWithEmail(data: string) {
    console.log(data);
    return this.http.get<any>("http://localhost:3001/api/user/profile/" + data);
  }

  updateEmployeeWithId(data: ktInfoModel, id: number) {
    return this.http.put<any>("http://localhost:3000/employees/" + id, data);
  }

  deleteEmployeeWithId(id: number) { 
    return this.http.delete<any>("http://localhost:3000/employees/" + id);
  }

  onSignUp(data: any) {
    return this.http.post<any>("http://localhost:3001/api/register", data);
  }

  onLogin(loginCredential: login) {
    const email = loginCredential.username;
    const password = loginCredential.password;
    const tp = {email,password};
    return this.http
      .post<any>(
        `http://localhost:3001/api/login` , tp);
  }

  onLogout(data:any){
    return this.http.post<any>(`http://localhost:3001/api/logout` , data);
  }

  getAllInventory(){
    return this.http.get<any>(`http://localhost:3001/api/store`);
  }

  onRedeem(info:any){
    console.log(info);
    return this.http.post<any>(`http://localhost:3001/api/store/item/redeem`, info);
  }
}
