import { Component } from '@angular/core';
import { NavParams, NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service'
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { EquipmentsLevels } from '../../levels/levels';
import { Equipments } from '../list';

@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: [EquipmentServiceProvider]
})

export class CreateEquipmentLevel {
 
  public level = { name: '', parent_id: '', current_level: '' , is_level: false}
  color: String = '#488aff'
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public EquipmentService: EquipmentServiceProvider,
              public actionSheetCtrl: ActionSheetController) {
            this.level.parent_id = this.params.get('parent_id');
            this.level.is_level = this.params.get('level') || false;
            this.level.current_level = this.params.get('current_level');
  }

  create(){
    this.EquipmentService.createLevel(this.level).then(data => { 
      if(data.status){
        if(this.level.is_level){
          this.navCtrl.push( EquipmentsLevels, {  
                                             parent_id : this.level.parent_id,
                                             level_id : this.params.get('level_id'),
                                             count : this.params.get('count')
                                          } )
        } else {
          this.navCtrl.pop();
        }
        
      } else {
        this.Notifications.presentToast(data.message);
      }
    });
  }

}
