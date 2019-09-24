import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { GlobalVarsProvider } from '../../../providers/global-vars/global-vars';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import { Step2Page } from '../step2/step2';


@Component({
  selector: 'page-step1',
  templateUrl: 'step1.html',
  providers : [ AuthServiceProvider,
                GlobalVarsProvider,
                NotificationsHelper,
                SessionHelper
              ]
})

export class Step1Page {
  public response: any;
  step2 = Step2Page;
  credentials = { username: '', password: '' };

   constructor(
      public authService: AuthServiceProvider,
      public globalVars: GlobalVarsProvider,
      public navCtrl: NavController,
      public Notifications: NotificationsHelper,
      public Session: SessionHelper ) {
     
  }

  next(){
    this.Notifications.presentLoader();
    this.authService.login(this.credentials)
   .then(data => {
      this.response = data;
      this.Notifications.dismissLoader();
      if(this.response.status){
        this.Session.setToken(this.response.token);
        this.Session.setUser(this.response.current_user);
        this.Session.setLastUser(this.response.current_user);
        this.navCtrl.push(this.step2,{go_to : 'login'});

      } else {
        this.Notifications.presentToast(this.response.message);
      }

    });
  }


}
