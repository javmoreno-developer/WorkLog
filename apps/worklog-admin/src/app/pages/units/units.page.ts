import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-units",
  templateUrl: "./units.page.html",
  styleUrls: ["./units.page.scss"],
})
export class UnitsPage implements OnInit {
  rows = new BehaviorSubject<Object>([])
  columns = new BehaviorSubject<Object>([])
  tableStyle = "general"

  tableButtons = [
    { icon: "information-circle", text: "", fun: "onInfo", cssClass: "download_icon", popover: false },
    { icon: "create", text: "", fun: "onEdit", cssClass: "edit_icon", popover: false },
    { icon: "close", text: "", fun: "onDelete", cssClass: "delete_icon", popover: false },
  ]

  constructor(private notification: NotificationService,private alert: AlertController,private translate: TranslateService,private modalCtrl: ModalController,private menuCtrl: MenuController,private apiSvc: ApiService,@Inject("apiUrlBase") private apiUrlBase: any, @Inject("apiHeaders") private apiUrlHeaders: any) {}

  ngOnInit() {
    this.chargeData()
  }

  chargeData() {
    let url = this.apiUrlBase + "unit/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,params,this.apiUrlHeaders).subscribe(
      (resolve) => {
        // filas
        this.rows.next(resolve)
        // columnas
        this.columns.next([
          { prop: 'name', name: 'name', toggle: false, checked: false },
          { prop: 'initials', name: 'initials', toggle: false, checked: false },
          { prop: 'level', name: 'level', toggle: false, checked: false },
          
        ])
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('units.readCompanyErr')), "error", "medium")
      }
    )
  }


  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  async presentModal(cellUpd: Object | null, event: any, type: string) {
    let buttonSection: any = []
    let textSection: any = []
    let inputSection: any = []
    let selectSection: any = []
    // texto
    if(type == "info") {
      let titleText =  await lastValueFrom(this.translate.get("units.infoModalTitle")) 
      let nameText = await lastValueFrom(this.translate.get("units.nameText", {name: event.name}))
      let initialsText = await lastValueFrom(this.translate.get("units.initialsText", {initials: event.initials}))
      let charUnitText = ""
      if(event.charUnit) {
        charUnitText = await lastValueFrom(this.translate.get("units.charUnitText", {charUnit: event.charUnit}))
      } else {
        charUnitText = await lastValueFrom(this.translate.get("units.charUnitText", {charUnit: ""}))
      }
      
      let unitTypeText = await lastValueFrom(this.translate.get("units.unitTypeText", {unitType: event.unitType}))
      let levelText = await lastValueFrom(this.translate.get("units.levelText", {level: event.level}))
      textSection = [titleText,nameText,initialsText,charUnitText,unitTypeText,levelText]
  
    }
    
    let unitPlaceholder = await lastValueFrom(this.translate.get("units.unitPlaceholder"))

    if(type == "add" || type == "edit") {
     textSection = [await lastValueFrom(this.translate.get("units.addModalTitle"))]
     buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
     inputSection = [{ formName: "name", type: "text", mandatory: true },{ formName: "initials", type: "text", mandatory: true },{ formName: "level", type: "number", mandatory: true },{ formName: "charUnit", type: "text", mandatory: true }]
     selectSection = [{ formName: "unitType", options: [{name: "morning", value:"morning"},{name:"evening",value:"evening"}], placeholder: unitPlaceholder }];
    }

    if(type == "edit") {
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.update")), type: "info", fun: "onEditUnit" }]
    }
   



    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: textSection,
        buttonSection: buttonSection,
        inputSection: inputSection,
        selectSection: selectSection,
        cellUpd: cellUpd,
      },
      cssClass: 'general-modal'
    });

    modal.present();

    modal.onDidDismiss().then(result => {
      if (result.data) {
        switch (result.role) {
          case "cancel":
            break;
          case "submit":
            this.addUnit(result.data)
            break;
          case "edit":
            this.updateUnit(result.data)
            break;
          
        }
      }
    });
  }

  addUnit(param: any) {
    let url = this.apiUrlBase + "unit/add"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.post(url,params,param,this.apiUrlHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('units.addCompanyMsg')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('units.addCompanyErr')), "error", "medium")
      }
    )
  }

  updateUnit(param: any) {
    console.log(param)
    let url = this.apiUrlBase + "unit/update"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile).set("id_unit",param.idAct)

    this.apiSvc.put(url,params,param.data,this.apiUrlHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('units.updCompanyMsg')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        console.log(error)
        this.notification.showToast(await lastValueFrom(this.translate.get('units.updCompanyErr')), "error", "medium")
      }
    )
  }

  async promptDelete(param: any) {
    console.log(param.data)
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("units.deleteTitle", { name: param.data.name })),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get("general.cancel")),
          cssClass: "danger-option",
          handler: () => {
          }

        },
        {
          text: await lastValueFrom(this.translate.get("general.accept")),
          handler: async () => {
            // Se borra el modulo
            let url = this.apiUrlBase + "unit/delete"
            let user = JSON.parse(localStorage.getItem("sessionData") as string)
            const params = new HttpParams().set("id_check", user.profile).set("id_unit", param.data.idUnit)
            this.apiSvc.delete(url, params, this.apiUrlHeaders).subscribe(
              async (resolve) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('units.delCompanyMsg')), "success", "medium")
                this.chargeData();
              },
              async (error) => {
                console.log(error)
                this.notification.showToast(await lastValueFrom(this.translate.get('units.delCompanyErr')), "error", "medium")
              }
            )

          }
        }

      ]
    });
    await alert.present();
  }

  promptUpdate(param: any) {
    console.log(param)
    this.presentModal(param.data,null,"edit")
  }
}

