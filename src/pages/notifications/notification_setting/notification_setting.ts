import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';

import { NotificationServiceProvider } from '../../../providers/notifications-service/notifications-service';

import { NotificationsHelper } from '../../../helpers/notifications.helper';

import { SessionHelper } from '../../../helpers/session.helper';

@Component({
  selector: 'page-notification-setting',
  templateUrl: 'notification_setting.html'
})

export class NotificationSetting {
    
    days:number;

    constructor(public navCtrl: NavController,
                public actionSheetCtrl: ActionSheetController,
                public navParams: NavParams,
                public Notification: NotificationsHelper,
                public session: SessionHelper,
                public NotificationService: NotificationServiceProvider
                ) {
                this.days = this.navParams.get('days');
    }
    

  save(){
     this.Notification.presentLoader();
     this.NotificationService.saveNotificationsDays(this.days)
      .then(data => {
        this.Notification.dismissLoader();
        this.Notification.presentToast('Saved Successfully');
      });
  }

}