import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationEnum } from '@core/enums/configration';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFrm: FormGroup;
  loginData: any;
  submitted: boolean = false;
  returnUrl: any;
  fromdate: any;
  todate: any;
  todatetoYear: any;
  isLappEmployee: boolean = true;
  optLappEmployee: boolean = true;
  optDealer: boolean = false;
  title: string;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  get f() { return this.loginFrm.controls; }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.loginFrm = this.formBuilder.group({
      loginoption: [this.optLappEmployee],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: ['']
    });
    this.onLoad()
  }

  private onLoad() {
    this.fromdate = moment().format('DD/MM/YYYY');
    this.todate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.todatetoYear = moment().add(365, 'd').format('DD/MM/YYYY');
  }

  private onBuildForm() {

  }

  public onLogin() {
    this.submitted = true;

    if (this.loginFrm.invalid)
      return;

    if (this.f.password.value.trim() == "") {
      this.notificationService.showError('Please Enter Password');
      return;
    }

    this.loginData = {
      userid: this.f.username.value,
      password: this.f.password.value,
      isLappEmployee: this.isLappEmployee,
      isweb: true,
      fcmtoken: null
    }

    this.login(this.loginData);
  }

  private login(data: any) {
    this.authservice.CheckUserCreditial(data).subscribe(
      response => {
        if (response.responsedata.statusCode == 200) {
          this.storageService.setValue(StorageKey.authToken, response.responsedata.data.token);
          this.storageService.setValue(StorageKey.currentUser, JSON.stringify(response.responsedata.data.currentUser));
          this.storageService.setValue(StorageKey.dateformat, 'dd/MM/yyyy');

          let defaultscreenvalues = {
            User: {
              searchtext: ""
            },
            Customer: {
              searchtext: ""
            },
            Opportunity: {
              searchtext: ""
            },
            Offers: {
              searchtext: "",
              offerstatus: 1,
              offerdetailstatus: 0,
              from: this.fromdate,
              to: this.todate,
              pendingon: "",
              assignto: "",
            },
            StockOrders: {
              searchtext: "",
              offerstatus: 1,
              offerdetailstatus: 0,
              pendingon: "",
            },
            OfferSimulator: {
              searchtext: "",
              offerstatus: 1,
              offerdetailstatus: 0,
              from: this.fromdate,
              to: this.todate,
              assignto: "",
            },
            PE_Action: {
              searchtext: "",
              itemtatus: 1,
              itemSPRStatus: 10,
              assignto: "",
              vertical: "All",
              pagenumber: 1
            },
            ASM_Action: {
              searchtext: ""
            },
            FM_Action: {
              searchtext: "",
              itemSPRStatus: 0
            },
            RateContracts: {
              searchtext: "",
              rctype: -1,
              rcstatus: -1,
              status: 1,
              from: this.fromdate,
              to: this.todatetoYear,
              pendingon: "",
            },
            ArticleCreation: {
              searchtext: "",
              pagenumber: 1
            },
            PolicyOrders: {
              searchtext: "",
              status: 1,
              detailStatus: 0,
              from: this.fromdate,
              to: this.todatetoYear,
              pendingon: "",
            }
          }

          this.storageService.setValue(StorageKey.defaultscreenvalues, JSON.stringify(defaultscreenvalues));

          this.authservice.getScreenDetails().subscribe(
            responseinner => {
              if (responseinner.responsedata && responseinner.responsedata.statusCode == 200) {
                this.storageService.setValue(StorageKey.menuData, JSON.stringify(responseinner.responsedata.data));

                this.authservice.ConfigurationbyCode(ConfigurationEnum.OfferValidfromCreation).subscribe(
                  res => {
                    if (res.responsedata && res.responsedata.statusCode == 200 && res.responsedata.data.length > 0) {
                      this.storageService.setValue(StorageKey.offervalidfromcreation, res.responsedata.data[0].value);
                    }
                  }, err => {
                    this.notificationService.showError(err.error.error.message);
                  }
                );
                this.router.navigate([this.returnUrl]);
              }
            }, errorinner => {
              this.authservice.logout();
              this.notificationService.showError(errorinner.error.error.message);
            });
        } else {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}
