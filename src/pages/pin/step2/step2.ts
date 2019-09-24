import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { GlobalVarsProvider } from '../../../providers/global-vars/global-vars';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { ProfilePage } from '../../profile/profile';
import { Login1Page } from '../../login/login1/login1';

import { SessionHelper } from '../../../helpers/session.helper';

@Component({
  selector: 'page-step2',
  templateUrl: 'step2.html',
  providers : [ AuthServiceProvider,
                GlobalVarsProvider,
                NotificationsHelper,
                SessionHelper
              ]
})


export class Step2Page {
  public response: any;
  public user_pin: any;
  public user_login: any;
  public is_pincode:Boolean = true;
  public spin:String ='';
  public pin:String ='';
  public cpin:String ='';
  public cspin:String ='';

  credentials = { username: '', password: '' };

   constructor(
      public authService: AuthServiceProvider,
      public globalVars: GlobalVarsProvider,
      public navCtrl: NavController,
      private params: NavParams,
      public Notifications: NotificationsHelper,
      public Session: SessionHelper ) {
     
  }
  
  set(){

    if( this.spin !== '' && this.cspin !== ''){
      if( this.spin !== '' && this.spin == this.cspin){
        this.Notifications.presentLoader();
        this.authService.setPin(this.spin)
       .then(data => {
          this.Notifications.dismissLoader();
          if(data.status){
            this.navCtrl.setRoot(this.params.data.go_to == 'login' ? Login1Page : ProfilePage );
          } else {
            this.Notifications.presentToast('Unsuccess');
          }

        });
      } else {
        this.Notifications.presentToast('Pin does not match!');  
      } 
    } else {
      this.Notifications.presentToast('Please fill the required fields');  
    }
  }

  updatePin(e, is_confirm = 1) {
    
    if(is_confirm){
      if(this.cspin.length > 4){
        this.cspin = this.cpin; 
      } else {
       this.cpin = this.cspin; 
      }
    } else {
      if(this.spin.length > 4){
        this.spin = this.pin; 
      } else {
       this.pin = this.spin; 
      }
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
