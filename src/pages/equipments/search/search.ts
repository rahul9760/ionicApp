import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../providers/equipment-service/equipment-service'
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { EquipmentsModels } from '../models/models';
import { EquipmentsResult } from './result/result';

@Component({
  selector: 'page-structure',
  templateUrl: 'search.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsSearch {
  
  search: any = { attribute: '', value: '', from: '', to: ''};
  is_searched: Boolean = false;
  levels:any = [];
  attribute:any;
  attributes:any = [];
  item_header_class: String = 'item item-ios list-header list-header-ios';
  color: String = '#488aff';

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public EquipmentService: EquipmentServiceProvider,
              public actionSheetCtrl: ActionSheetController) {
      this.getAttrs();

  }

  getAttrs(){

    this.Notifications.presentLoader();
    this.EquipmentService.searchAttrs()
      .then(data => {
        this.Notifications.dismissLoader();
        this.attributes = data.attributes;
    });
  }

  getItems(ev: any) {
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( () => {

        this.EquipmentService.searchLevels(this.search.toLowerCase())
        .then(data => {
          this.is_searched = false;
          this.levels = data.levels;
        });

      },500)
    }
  }

  next(t){
    this.navCtrl.push(EquipmentsModels,{ levels_data_id : t.id, parent_id : t.parent_id })
  }

  searchObjects(){
    this.search.attribute = this.attributes[this.attribute].id;
    this.search.attr_type = this.attributes[this.attribute].attr_type;
    this.Notifications.presentLoader();
    this.EquipmentService.searchObjects(this.search)
    .then(data => {
      this.is_searched = false;
      this.Notifications.dismissLoader();
      this.navCtrl.push(EquipmentsResult, { objects : data.objects } )
    });
  }
  
}
