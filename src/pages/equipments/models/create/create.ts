// AUTHOR : HS
// CREATED : 17-04-2018
// DESCRIPTION : Used to create the model.

import { Component  } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service'

import { NotificationsHelper } from '../../../../helpers/notifications.helper';

import { EquipmentsModels } from '../../models/models';

@Component({
    selector: 'page-create',
    templateUrl: 'create.html',
    providers: [EquipmentServiceProvider]
})

export class EquipmentsModelCreate {

    public levels_data_id:Number;
    public model:any = { attrs_data: {} } ;
    public attributes:any;
    public color: String = '#488aff';
    public item_header_class: String = 'item item-ios list-header list-header-ios';
    public input_class = "text-input text-input-ios"

    constructor(public navCtrl: NavController, public params: NavParams, public Notifications: NotificationsHelper, public actionSheetCtrl: ActionSheetController, public EquipmentService:EquipmentServiceProvider) {
        this.levels_data_id = this.params.get('levels_data_id');
        this.model.levels_data_id = this.levels_data_id; 
        this.getModelAttrs();
    }


    getModelAttrs(){
        this.Notifications.presentLoader();
        this.EquipmentService.getModelAttrs(this.levels_data_id).then(data => {
            this.Notifications.dismissLoader();
            this.attributes = data.attributes;
        });
    }

    create(){
        if(Object.keys(this.model.attrs_data).length > 0){
            this.EquipmentService.createModel(this.model).then(data => { 
                if(data.status){
                    this.navCtrl.push(EquipmentsModels, { levels_data_id : this.levels_data_id } );
                }
            });
        } else {
            this.Notifications.presentToast('Please fill all fields to create model.');
        }
    }

}
