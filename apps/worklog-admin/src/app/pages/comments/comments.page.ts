import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService, SharedService } from "@worklog-fe/core";
import { BehaviorSubject, Observable, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-comments",
  templateUrl: "./comments.page.html",
  styleUrls: ["./comments.page.scss"],
})
export class CommentsPage implements OnInit {
  toolbarOptions: any;
  name: string = "";
  date: string = "";
  rows = new BehaviorSubject<Object>([]);
  rows$: Observable<any> = new Observable;
  urlBack = "students"

  orderValueList = ["first", "second", "third", "fourth", "fifth"]
  orderNameList = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]

  constructor(private notification: NotificationService,private apiSvc: ApiService,private sharedSvc: SharedService,private menuCtrl: MenuController,private translate: TranslateService,@Inject("apiHeaders") private apiHeaders ?: any, @Inject("apiUrlBase") private apiUrlBase ?: any) {}

  async ngOnInit() {
    // toolbar options
    this.toolbarOptions = [
      {name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile'},
      {name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out'}
    ]

    // data
    let params: any = JSON.parse(this.sharedSvc.getData() as string);
    this.name = params.name;
    this.date = params.date

    this.chargeData(params.id)
  }

  chargeData(id: any) {
    let url = this.apiUrlBase + "comment/get/entry"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let params = new HttpParams().set("id_check", user.profile).set("id_entry",id)

    this.apiSvc.get(url,params,this.apiHeaders).subscribe(
      (resolve) => {
        this.rows.next(resolve);
        this.rows$ = this.rows.asObservable()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }

  closeMenu(param: any) {
    this.menuCtrl.close();
  }
}
