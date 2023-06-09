import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import {Chart} from 'chart.js/auto';
import { lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit {
  
  // First chart
  dualData: number = 0
  fctData: number = 0
  fctDualData: number = 0

  // Second chart
  studentData: number = 0
  teacherData: number = 0
  laborData: number = 0

  toolbarOptions: any;

  constructor(private notification: NotificationService,private translate: TranslateService,private apiSvc: ApiService,private menuCtrl: MenuController, @Inject("apiUrlBase") private apiUrlBase ?:any,@Inject("apiHeaders") private apiHeaders ?: any) {}

  async ngOnInit() {
     // Toolbar options
     this.toolbarOptions = [
      {name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile'},
      {name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out'}
    ]
    this.getStudentData()
    this.getAgreementData()

  }

  getStudentData() {
    let url = this.apiUrlBase + "user/stadistic"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let param = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,param,this.apiHeaders).subscribe(
      (resolve: any) => {
        this.studentData = resolve.students
        this.teacherData = resolve.teachers
        this.laborData = resolve.labors
        this.createStudentChart()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('dashboard.readErr')), "error", "medium")
      }
    )
  }

  getAgreementData() {
    let url = this.apiUrlBase + "agreement/stadistic"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let param = new HttpParams().set("id_check", user.profile)

    this.apiSvc.get(url,param,this.apiHeaders).subscribe(
      (resolve: any) => {
        this.dualData = resolve.dual
        this.fctData = resolve.fct
        this.fctDualData = resolve.fctDual
        this.createAgreementChart()
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('dashboard.readErr')), "error", "medium")
      }
    )
  }
 
  // Create first chart
  createAgreementChart() {
    const ctx = document.getElementById('agreementChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['FCT', 'DUAL', 'FCT+DUAL'],
        datasets: [{
          label: 'People in every agreement type',
          data: [this.dualData,this.fctData,this.fctDualData],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false, // Disable aspect ratio constraints
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            position: 'nearest',
            mode: 'index',
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.label || 0;
                return 'People in agreement: ' + value;
              }
            }
          }
        }
      }
    });
  }
  
  // Create second chart
  createStudentChart() {
    const ctx = document.getElementById('studentChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Students', 'Teachers', 'Labors'],
        datasets: [{
          label: 'Type of users',
          data: [this.studentData,this.teacherData,this.laborData],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false, // Disable aspect ratio constraints
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            position: 'nearest',
            mode: 'index',
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.label || 0;
                return 'Type of user: ' + value;
              }
            }
          }
        }
      }
    });
  }

  // Close sidebar menu
  closeMenu(param: any) {
    this.menuCtrl.close();
  }
}