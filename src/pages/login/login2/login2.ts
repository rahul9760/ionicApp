import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Events, Platform, Navbar, App } from 'ionic-angular';
import {Dashboard} from '../../dashboard/dashboard';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { GlobalVarsProvider } from '../../../providers/global-vars/global-vars';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';

import { RegisterPage } from '../../../pages/register/register';
import { Step1Page } from '../../../pages/pin/step1/step1';

import { config } from '../../../app.config';

@Component({
  selector: 'page-login2',
  templateUrl: 'login2.html',
  providers : [ AuthServiceProvider,
                GlobalVarsProvider,
                NotificationsHelper,
                SessionHelper
              ]
})
export class Login2Page {
  @ViewChild(Navbar) navBar: Navbar;

  public type = 'password'; 
  public showPass = false; 
  dashboard = Dashboard;
  registerPage = RegisterPage;
  setPin = Step1Page;
  credentials = { username: '', password: '', fcm_token : '' };
  
  public response: any;
  public user_pin: any;
  public user_login: any;
  public is_pincode:Boolean = true;
  public pin:Number;
  public pin1:Number;
  public pin2:Number;
  public pin3:Number;
  public pin4:Number;
  public reload:Boolean = false;

  constructor(
    public app: App,
    public authService: AuthServiceProvider,
    public globalVars: GlobalVarsProvider,
    public navCtrl: NavController,
    private menu: MenuController,
    public events: Events,
    public Notifications: NotificationsHelper,
    public platform: Platform,
    public Session: SessionHelper ) {
     this.menu = menu;
     this.user_pin = RegisterPage;
     this.user_login = RegisterPage;
     this.menu.swipeEnable(false);
  }

  login() {
    this.Notifications.presentLoader();

    this.authService.login(this.credentials)
   .then(data => {
      this.Notifications.dismissLoader();
      if(data.error == undefined) {
        this.response = data;
        if(this.response.status){
        
          this.globalVars.setCurrentUser(this.response.current_user);
          this.Session.setToken(this.response.token);
          this.response.current_user.private_image_path = config.api_url + 'documents/download?fileName='+this.response.current_user.image_name+'&token='+this.response.token+'&type=profile_pic&thumb=true&quality=medium';
          this.Session.setUser(this.response.current_user);
          this.Session.setLastUser(this.response.current_user);
          
          this.events.publish('user:loggedin', this.response.current_user);
          this.app.getRootNav().setRoot(this.dashboard);

        } else {
          this.Notifications.presentToast(this.response.message);
        }
      } else {
        this.reload = true;
        this.Notifications.presentToast('Timeout error');
      }
    });
  }

  register() {
    this.app.getRootNav().push(this.registerPage);
  }


  set_pin() {
    this.app.getRootNav().push(this.setPin);
  }

  changeTab(r) {
    this.is_pincode = r; 
  }

  showPassword() {
    this.showPass = !this.showPass;
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  numberRange (start, end) {
    var r = [];
    while(start <= end){
      r.push(start);
      start++;
    }
    return r;
  }

}
