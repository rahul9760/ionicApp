// AUTHOR : HS
// CREATED : 03-04-2018
// DESCRIPTION : Used to create the infrastructure.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { InfrastructureLevels } from '../levels/levels';
import { Infrastructure } from '../list/list';
import { NotificationsHelper } from '../../../helpers/notifications.helper';

@Component({
    selector: 'page-infrastructure-create',
    templateUrl: 'create.html',
    providers: [InfrastructureServiceProvider]
})

export class InfrastructureCreate {
  
    infrastructure:any = { attributes : {} };
    attributes:any;
    barcodes:any;
    header_class = "item item-ios list-header list-header-ios screen-header"
    input_class = "text-input text-input-ios"

    constructor(
        public navCtrl: NavController, 
        public params: NavParams, 
        public Notifications: NotificationsHelper, 
        public actionSheetCtrl: ActionSheetController, 
        public InfrastructureService:InfrastructureServiceProvider
  	){
      	this.getInfrastructureFields();
    }

    getInfrastructureFields(){
      	this.Notifications.presentLoader();
        this.infrastructure.location_id = this.params.get('location_id') || 0;
        this.infrastructure.parent_id = this.params.get('parent_id') || 0;
        this.InfrastructureService.getInfrastructureFields(this.infrastructure.location_id, this.infrastructure.parent_id)
        .then(data => {
      		this.Notifications.dismissLoader();
            this.attributes = data.attributes;
            this.barcodes = data.barcodes;
        });
    }

    save(){
        this.Notifications.presentLoader();
        if(typeof this.infrastructure["name"] == "undefined" ||  this.infrastructure["name"] == ""){
            this.Notifications.presentToast("Please give name to infrastructure");
            this.Notifications.dismissLoader();
            return false;
        }
    
        this.InfrastructureService.create(this.infrastructure)
            .then(data => {
            this.Notifications.dismissLoader();
          
            if(this.infrastructure.parent_id == 0){
                this.navCtrl.pop();
            } else {
                this.navCtrl.push( InfrastructureLevels , {parent_id : this.infrastructure.parent_id, parents : [], location_id : this.infrastructure.location_id , count : this.params.get('count')} );
            }

        });
    }

}
