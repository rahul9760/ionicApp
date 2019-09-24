import { Component } from '@angular/core';
import { NavParams, NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service'
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { EquipmentsArticleDescription } from '../../articles/description/description';

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsResult {
  
  models:any = [];

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public EquipmentService: EquipmentServiceProvider,
              public actionSheetCtrl: ActionSheetController) {
      this.models = this.params.get('objects');

  }

  getTitle(attrs){
    return attrs[ Object.keys(attrs)[0] ];
  }

  view(t){
    this.navCtrl.push(EquipmentsArticleDescription, { id : t.id })
  }
  
}
