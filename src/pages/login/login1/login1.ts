import { Component, ViewChild } from '@angular/core';
import { AlertController, NavParams, NavController, MenuController, Events, Platform, Navbar, App, PopoverController } from 'ionic-angular';
import {Dashboard} from '../../dashboard/dashboard';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { GlobalVarsProvider } from '../../../providers/global-vars/global-vars';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import { RegisterPage } from '../../../pages/register/register';
import { Step1Page } from '../../../pages/pin/step1/step1';

import {Login2Page} from "../login2/login2";

import { config } from '../../../app.config';
import { PopoverPage } from './more';

@Component({
  selector: 'page-login1',
  templateUrl: 'login1.html',
  providers : [ AuthServiceProvider,
                GlobalVarsProvider,
                NotificationsHelper,
                SessionHelper,
                FingerprintAIO
              ]
})

export class Login1Page {
  @ViewChild(Navbar) navBar: Navbar;

  dashboard = Dashboard;
  registerPage = RegisterPage;
  setPin = Step1Page;
  credentials = { username: '', password: '' };
  fingerprint: Boolean = false;
  touch_id: Boolean = false;

  public response: any;
  public user_pin: any;
  public user_login: any;
  public user: any;
  public is_pincode:Boolean = true;
  public spin:String;
  public pin:String;
  public logout:Boolean = false;
  public reload:Boolean = false;
  public backButtonPressedOnceToExit:Boolean = false;

  public upin:String = '';

  constructor(
    public app: App,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public globalVars: GlobalVarsProvider,
    public navCtrl: NavController,
    public params: NavParams,
    private menu: MenuController,
    private popoverCtrl: PopoverController,
    public events: Events,
    public Notifications: NotificationsHelper,
    public platform: Platform,
    private faio: FingerprintAIO,
    public Session: SessionHelper ) {
     this.menu = menu;
     this.user_pin = RegisterPage;
     this.user_login = RegisterPage;
     this.logout = (this.params.get('logout') || false);
     this.menu.swipeEnable(false);
     this.user = this.Session.getLastUser();
     console.log("getLastUser :"+JSON.stringify(this.user));
     this.touch_id = this.Session.getTouchID();
     this.fingerprint = false;
     this.initFaio();
  }

  register() {
    this.app.getRootNav().push(this.registerPage);
  }

  ionViewDidEnter() {

      // this.platform.registerBackButtonAction(() => {
      //   if (this.backButtonPressedOnceToExit) {
      //     this.platform.exitApp();
      //   }
      //   else {
      //     this.backButtonPressedOnceToExit = true;
      //     this.Notifications.presentToast("Press back button again to exit", 2000);
      //     setTimeout(()=>{
      //       this.backButtonPressedOnceToExit = false;
      //     },2000);
      //   }
      //   return false;
      // },101);

      // this.platform.registerBackButtonAction(() => {
      //  this.exit(this.platform)
      // });
  }
  
  exit(platform) {  
    let exit = this.alertCtrl.create({
      title: 'Confirm exit',
      message: 'Do you want Exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Exit',
          handler: () => {
            platform.exitApp();  
          }
        }
      ]
    });
    exit.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  set_pin() {
    this.app.getRootNav().push(this.setPin);
  }

  change(){
    this.app.getRootNav().push(Login2Page);
  }

  changeTab(r) {
    this.is_pincode = r; 
  }

  updatePin(e) {
  
    if(this.pin.length > 4){
      this.pin = this.spin; 
    } else {
     this.spin = this.pin; 
    }

  }

  loginViaPin(){

    if( this.upin.length == 4 ){
      this.Notifications.presentLoader();
      this.authService.loginViaPin(this.upin)
     .then(data => {
        this.Notifications.dismissLoader();
        this.loginResponse(data);
      });
    } else {
      this.Notifications.presentToast('The length of PIN must be 4');
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

  addPin(val){


    if(this.upin.length < 4){
     
      if(val == 'x'){
        this.upin = this.upin.slice(0, -1); 
      } else {
       this.upin += val;
      }

    } else {
      if(val == 'x'){
        this.upin = this.upin.slice(0, -1); 
      }
    }

    if(this.upin.length == 4 ){
      this.loginViaPin()
    }

  }

  strlength(v){
    var r;
    switch(v) { 

       case '1': { 
          r = this.upin.length == 1 || this.upin.length == 2 || this.upin.length == 3 || this.upin.length == 4
          break; 
       } 
      
       case '2': { 
          r = this.upin.length == 2 || this.upin.length == 3 || this.upin.length == 4
          break; 
       } 
       
       case '3': { 
          r = this.upin.length == 3 || this.upin.length == 4
          break; 
       } 
       
       case '4': { 
          r = this.upin.length == 4
          break; 
       } 

       default: { 
          break; 
       } 

    } 
    return r;
  }

  getFirstname(n){
    return n.split(' ')[0];
  }

  loadFingerPrint(){
    this.initFaio(true);
  }

  initFaio( is_clicked = false ){
      if ( !this.platform.is('cordova') || !this.touch_id ) {
        return false;
      }
    
    this.faio.isAvailable()
    .then((result: any) =>  {
      this.fingerprint = true;
      
      if ( !is_clicked && this.logout ) {
        return false;
      }

      this.faio.show({
          clientId: 'Fingerprint-Demo',
          clientSecret: 'password',
          disableBackup:true,
          localizedFallbackTitle: 'Use Pin',
          localizedReason: 'Please authenticate'
      }).then((result: any) => {
        this.Notifications.presentLoader();
        this.authService.loginViaFingerprint()
       .then(data => {
          this.Notifications.dismissLoader();
          this.loginResponse(data);
        });
      });

      }
    )
  
  }

  loginResponse(data){         
      this.upin = '';
      if(data.error == undefined){
        this.reload = false;
        this.response = data;
        if(this.response.status){
          this.setVars()
        } else {
          this.Notifications.presentToast(this.response.message);
        }
      } else {
        this.reload = true;
        this.Notifications.presentToast('Timeout error');
      }
  }

  setVars(){
    this.globalVars.setCurrentUser(this.response.current_user);
    this.Session.setToken(this.response.token);

    this.response.current_user.private_image_path = config.api_url + 'documents/download?fileName='+this.response.current_user.image_name+'&token='+this.response.token+'&type=profile_pic&thumb=true&quality=medium';
    this.Session.setUser(this.response.current_user);
    this.Session.setLastUser(this.response.current_user);

    this.events.publish('user:loggedin', this.response.current_user);
    this.app.getRootNav().setRoot(this.dashboard);
  }


}
