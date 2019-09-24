// AUTHOR : HS
// CREATED : 13-04-2018
// DESCRIPTION : Used to show the model description.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service';

import { NotificationsHelper } from '../../../../helpers/notifications.helper';


@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsLevelDescription {

  public level_id;
  public level:any;
  public backup:any;
  public attributes:any;
  private color: String = '#488aff';
  private level_names: String = '';
  private is_edit: Boolean = false;

  constructor(
          public navCtrl: NavController, 
          public params: NavParams, 
          public Notifications: NotificationsHelper, 
          public actionSheetCtrl: ActionSheetController, 
          public EquipmentService:EquipmentServiceProvider
        ) {
    this.getModel();
  }


  getModel(){
    this.level_id = this.params.get('id');
    this.Notifications.presentLoader();

    this.EquipmentService.getModel(this.level_id)
    .then(data => {
      this.Notifications.dismissLoader();
      this.level = data.output.level;
      console.log("sdfsdfsdf",this.level,this.level_id)
      // this.level_names = data.output.level_names;
      // this.attributes = data.output.attributes;
    });
  }

}
