import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-companies",
  templateUrl: "./companies.page.html",
  styleUrls: ["./companies.page.scss"],
})
export class CompaniesPage implements OnInit {
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
    let url = this.apiUrlBase + "company/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,params,this.apiUrlHeaders).subscribe(
      (resolve) => {
        // filas
        this.rows.next(resolve)
        // columnas
        this.columns.next([
          { prop: 'name', name: 'name', toggle: false, checked: false },
          { prop: 'address', name: 'address', toggle: false, checked: false },
          { prop: 'phone', name: 'phone', toggle: false, checked: false },
        ])
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('companies.readCompanyErr')), "error", "medium")
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
      let titleText =  await lastValueFrom(this.translate.get("companies.infoModalTitle")) 
      let nameText = await lastValueFrom(this.translate.get("companies.nameText", {name: event.name}))
      let addressText = await lastValueFrom(this.translate.get("companies.addressText", {address: event.address}))
      let latitudeText = await lastValueFrom(this.translate.get("companies.latitudeText", {latitude: event.latitude}))
      let longitudeText = await lastValueFrom(this.translate.get("companies.longitudeText", {longitude: event.longitude}))
      let phoneText = await lastValueFrom(this.translate.get("companies.phoneText", {phone: event.phone}))
      textSection = [titleText,nameText,addressText,latitudeText,longitudeText,phoneText]
  
    }
    

    if(type == "add" || type == "edit") {
     textSection = [await lastValueFrom(this.translate.get("companies.addModalTitle"))]
     buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
     inputSection = [{ formName: "name", type: "text", mandatory: true },{ formName: "address", type: "text", mandatory: true },{ formName: "longitude", type: "number", mandatory: true },{ formName: "latitude", type: "number", mandatory: true },{ formName: "phone", type: "text", mandatory: true }]

    }

    if(type == "edit") {
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.update")), type: "info", fun: "onEditCompany" }]
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
            this.addCompany(result.data)
            break;
          case "edit":
            this.updateCompany(result.data)
            break;
          
        }
      }
    });
  }

  addCompany(param: any) {
    let url = this.apiUrlBase + "company/add"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.post(url,params,param,this.apiUrlHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('companies.addCompanyMsg')), "success", "medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('companies.addCompanyErr')), "error", "medium")
      }
    )
  }

  updateCompany(param: any) {
    console.log(param)
    let url = this.apiUrlBase + "company/update"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile).set("id_company",param.idAct)

    this.apiSvc.put(url,params,param.data,this.apiUrlHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('companies.updCompanyMsg')), "success", "medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('companies.updCompanyErr')), "error", "medium")
      }
    )
  }

  async promptDelete(param: any) {
    console.log(param.data.idCompany)
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("companies.deleteTitle", { name: param.data.name })),
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
            let url = this.apiUrlBase + "company/delete"
            let user = JSON.parse(localStorage.getItem("sessionData") as string)
            const params = new HttpParams().set("id_check", user.profile).set("id_company", param.data.idCompany)
            this.apiSvc.delete(url, params, this.apiUrlHeaders).subscribe(
              async (resolve) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('companies.delCompanyMsg')), "success", "medium")
                this.chargeData();
              },
              async (error) => {
                console.log(error)
                this.notification.showToast(await lastValueFrom(this.translate.get('modules.delCompanyErr')), "error", "medium")
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
