import { Component } from "@angular/core";
import { ApiService } from "../../../../../libs/core/src/lib/services/api.service";
import { HttpParams } from "@angular/common/http";
import { environment } from "worklog-admin/src/environments/environment";


@Component({
  selector: "worklog-fe-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(private apiSvc: ApiService) {
    
    let url_headers = environment.headers
    
    /*const url = "http://localhost:8000/api/day/";
    const params = new HttpParams().set("idDay", "1").set("profileUser", "3");
    this.apiSvc.get(url,params,url_headers)*/
    

    /*let url = "http://localhost:8000/api/user/send-email/1"
    let body = {
      "email": "starfinn99@gmail.com"
    }
    this.apiSvc.post(url,body,url_headers)*/

    /*let url = "http://localhost:8000/api/unit/delete/"
    const params = new HttpParams().set("idUnit", "12").set("profileUser", "1");
    this.apiSvc.delete(url,params,url_headers)*/

    /*let url = "http://localhost:8000/api/day/update/"
    const params = new HttpParams().set("idDay","1").set("profileUser","3")
    let body = {
      "text": "texto actualizado",
      "hours": "11:00:00",
      "observations": "actu",
      "idEntry": 1
    }
    this.apiSvc.put(url,params,body,url_headers)*/

  }
}
