import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { NotificationServiceProvider } from '../../providers/notifications-service/notifications-service';

import { NotificationsHelper } from '../../helpers/notifications.helper';

import { EditPage } from '../profile/edit/edit';
import { Dashboard } from '../dashboard/dashboard';

import { NotificationSetting } from '../notifications/notification_setting/notification_setting';

import { SessionHelper } from '../../helpers/session.helper';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class Settings {
    
    public touch_id:boolean = false;

    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController,
                public Notification: NotificationsHelper,
                public session: SessionHelper,
                public NotificationService: NotificationServiceProvider
                ) {
                this.touch_id = (this.session.getTouchID() || false);
    }
    

  edit( t ){
    this.navCtrl.push(EditPage,{ type: t , column : t});
  }

  back(){
    this.navCtrl.push(Dashboard);
  }

  notification( t ){
    this.Notification.presentLoader();
    this.NotificationService.getNotificationsDays().then(days => {
      this.Notification.dismissLoader();
      this.navCtrl.push(NotificationSetting, { days : days});
    });
  }

  handleTouchToggle(){
    this.session.setTouchID(this.touch_id)
  }
  
  deactivate() {  
    let deactivate = this.alertCtrl.create({
      title: 'Deactivate account',
      message: 'Do you want to deactivate your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Deactivate',
          handler: () => {
            alert('Here')
          }
        }
      ]
    });
    deactivate.present();
  }

}