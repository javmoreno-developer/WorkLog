import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService, SharedService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { LocaleService } from "libs/core/src/lib/services/locale.service";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-labors",
  templateUrl: "./labors.page.html",
  styleUrls: ["./labors.page.scss"],
})
export class LaborsPage implements OnInit {

  // Variables
  rows = new BehaviorSubject<Object>([]);
  columns = new BehaviorSubject<Object>([]);

  tableStyle = "general"

  tableButtons = [
    { icon: "person", text: "", fun: "onProfile", cssClass: "profile_icon", popover: false},
    { icon: "create", text: "", fun: "onEdit", cssClass: "edit_icon", popover: false },
    { icon: "close", text: "", fun: "onDelete", cssClass: "delete_icon", popover: false },
  ]

  mappedList: any = []
  units = {}

  defaultLang: any = "";
  languages: any;
  toolbarOptions: any;

  constructor(private locale: LocaleService,private route:Router,private sharedSvc: SharedService,private modalCtrl: ModalController,private translate: TranslateService,private notification:NotificationService,private alert: AlertController,private apiSvc: ApiService, private menuCtrl: MenuController, @Inject("apiUrlBase") public apiUrlBase?: any, @Inject("apiHeaders") public apiHeaders?: any) {
    this.chargeData();
  }

  async ngOnInit() {
    this.defaultLang = this.locale.locale

    // Set all toolbar options
    this.toolbarOptions = [
      { name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile' },
      { name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out' }
    ]
    // Set all idioms
    this.languages = [
      { name: await lastValueFrom(this.translate.get("languages.english")), value: "en-en" },
      { name: await lastValueFrom(this.translate.get("languages.spanish")), value: "es-es" }
    ]
  }

  // Close sidebar menu
  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  // Charge initial data
  chargeData() {
    let url = this.apiUrlBase + "user/get/laborals"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let param = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,param,this.apiHeaders).subscribe(
      (resolve: any) => {
        let result = resolve.map((element: any) => ({active: element.isActive, email: element.email,idUser: element.idUser,name: element.name,surname: element.surname,github: element.github,profile: element.profile,linkedin: element.linkedin,picture: element.picture,twitter: element.twitter}))

        // get the rows of table
        this.rows.next(result)

        // get the columns of table
        let groupColumns = [
          {prop: 'active', name: 'active',toggle:true, checked: false},
          {prop: 'name', name: 'name',toggle:false, checked: false},
          {prop: 'email', name: 'email',toggle:false, checked: false},
        ]
        this.columns.next(groupColumns)
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.readErr')), "error", "medium")
      }
    )
  }

  addModal() {
    this.getAllUnits(null)
  }

  // Get all the units from db
  async getAllUnits(cellUpd: Object | null) {
    let url = this.apiUrlBase + "unit/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    return await this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve) => {
        this.units = resolve
        // map units
        return this.mapAllUnits(this.units, cellUpd);

      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }

  mapAllUnits(param: any, cellUpd: Object | null) {
    this.mappedList = param.map((obj: any) => ({
      name: obj.level + " " +obj.initials,
      value: obj.idUnit,
    }));

    if(cellUpd) {
      this.presentModal(cellUpd,null,'edit')
    } else {
      this.presentModal(null,null,'add')
    }

   

  }

  // Show general modal
  async presentModal(cellUpd: Object | null, event: any, type: string) {
    let buttonSection: any = []
    let textSection: any = []
    let inputSection: any = []
    let selectSection: any = []
  
    
    let unitPlaceholder = await lastValueFrom(this.translate.get("modules.unitForm"))


     textSection = [await lastValueFrom(this.translate.get("labors.addModalTitle"))]
     buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
     inputSection = [{ formName: "name", type: "text", mandatory: true },{ formName: "surname", type: "text", mandatory: true },{ formName: "email", type: "email", mandatory: true }];
     selectSection = [];
    

    if(type == "edit") {
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.update")), type: "info", fun: "onEditLabor" }]
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
            this.addLabor(result.data)
            break;
          case "edit":
            this.updateLabor(result.data)
            break;
          
        }
      }
    });
  }

  // Add labor operation
  addLabor(param: any) {
    let url = this.apiUrlBase + "user/add-labor"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const {idUnit, ...body} = param

    body["picture"] = ""
    body["linkedin"] = ""
    body["github"] = ""
    body["twitter"] = ""
    body["profile"] = "4"
    body["password"] = this.getNewPassword()
    
    const params = new HttpParams().set("id_check", user.profile).set("id_unit",idUnit)


   

    this.apiSvc.post(url,params,body,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.addMsg')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.addErr')), "error", "medium")
      }
    )
  }

  // Update labor operation
  updateLabor(param: any) {
    let url = this.apiUrlBase + "user/update"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    let params = new HttpParams().set("id_check", user.profile).set("id_user",param.idAct)

    this.apiSvc.put(url,params,param.data,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.updMsg')), "success", "medium")
        this.chargeData()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.updErr')), "error", "medium")
      }
    )
  }

  // Update status operation
  updateStatus(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    param.checked = !param.checked
    let checked = 0
    if(param.checked) {
      checked = 1
    }
    // Update status
    let url = this.apiUrlBase + "user/change-status"
    const params = new HttpParams().set("id_check", user.profile).set("id_user",param.row.idUser).set("new_status",checked)
    this.apiSvc.put(url,params,null,this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.updMsg')), "success", "medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('labors.updErr')), "error", "medium")
      }
    )
  }

  // Delete alert
  async promptDelete(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("labors.deleteTitle", { name: param.data.name })),
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
            // Se borra el labor
            let url = this.apiUrlBase + "user/delete"
            let user = JSON.parse(localStorage.getItem("sessionData") as string)
            const params = new HttpParams().set("id_check", user.profile).set("id_user", param.data.idUser)
            this.apiSvc.delete(url, params, this.apiHeaders).subscribe(
              async (resolve) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('labors.delMsg')), "success", "medium")
                this.chargeData();
              },
              async (error) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('labors.delErr')), "error", "medium")
              }
            )

          }
        }

      ]
    });
    await alert.present();
  }

  // Show edit modal
  promptEdit(event: any) {
    this.getAllUnits(event.data)
  }

  // Create a new password
  getNewPassword() {
    const randomBytes = new Uint8Array(2); // Create a array of 2 bytes
    window.crypto.getRandomValues(randomBytes); // Fill the array with random values
  
    // Turn the array
    let password = '';
    for (let i = 0; i < randomBytes.length; i++) {
      password += randomBytes[i].toString(16).padStart(2, '0');
    }
  
    return password;
  }

  profileNavigate(param: any) {
    this.route.navigate(["profile"])
  }

   // Change the idiom of the entire app (event from child component)
   changeIdiom(param: any) {
    this.translate.setDefaultLang(param)
    this.locale.registerCulture(param)
  }
}
