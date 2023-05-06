import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  header: string = ""
  css_class: string = ""
  icon: string = ""
  duration: number = 0

  constructor(private toastCtrl: ToastController) { }

  assignStyle(type: string,dur: string) {
    switch(type) {
      case "error":
        this.header = "Error"
        this.css_class = "error-toast"
        this.icon = "close-circle-outline"
        break;
      case "warning":
        this.header = "Warning"
        this.css_class = "warning-toast"
        this.icon = "warning-outline"
        break;
      case "success":
        this.header = "Success"
        this.css_class = "success-toast"
        this.icon = "checkmark-circle-outline"
        break;
      case "info":
        this.header = "Info"
        this.css_class = "info-toast"
        this.icon = "information-circle-outline"
        break;
        default:
    }

    switch(dur) {
      case "short":
        this.duration = 1000
        break;
      case "medium":
        this.duration = 3000
        break;
      case "long":
        this.duration = 5000
        break;
      default:
    }
  }

  async showToast(message: string, type: string, dur: string) {
    this.assignStyle(type,dur)
    const toast = await this.toastCtrl.create({
      message: message,
      duration: this.duration,
      icon: this.icon,
      header:this.header,
      cssClass: this.css_class,
      buttons: [
        {
          cssClass: "cancel-button",
          text: "Cerrar",
          role: 'cancel'
        }
      ],
    });
    toast.present();
  }
}
