import { Component } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {

  toolbarOptions: any;
  urlBack = "teachers"

  constructor(private menuCtrl: MenuController,private translate: TranslateService) {
   
  }

  async ngOnInit() {
      // toolbar options
      this.toolbarOptions = [
        {name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile'},
        {name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out'}
      ]
  }

  closeMenu(param: any) {
    this.menuCtrl.close();
  }
}
