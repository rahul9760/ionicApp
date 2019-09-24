import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';

@Component({
    templateUrl: 'infrastructurelocationmodal.html',
    providers: [InfrastructureServiceProvider, NotificationsHelper]
})

export class InfrastructureLocationModal {
  
    character;
    infrastructure:any = { attributes : {} };
    attributes:any;
    barcodes:any;
    header_class = "item item-ios list-header list-header-ios screen-header";
    input_class = "text-input text-input-ios";

    constructor( public platform: Platform, public params: NavParams, public viewCtrl: ViewController, public InfrastructureService:InfrastructureServiceProvider, public Notifications: NotificationsHelper ) {

        this.getInfrastructureFields();
        
    }

    getInfrastructureFields(){
        this.Notifications.presentLoader();
        this.infrastructure.location_id = this.params.get('location_id') || 0;
        this.infrastructure.parent_id = this.params.get('parent_id') || 0;
        
        this.InfrastructureService.getInfrastructureFields(this.infrastructure.location_id,this.infrastructure.parent_id).then(data => {
            this.Notifications.dismissLoader();
            this.attributes = data.attributes;
            this.barcodes = data.barcodes;
        }); 
    }

    create(){ 
        this.Notifications.presentLoader();

        if(typeof this.infrastructure["name"] == "undefined" ||  this.infrastructure["name"] == ""){
            this.Notifications.presentToast("Please give name to infrastructure");
            this.Notifications.dismissLoader();
            return false;
        }
    
        this.InfrastructureService.create(this.infrastructure).then(data => {
            
            if(data.status){
                this.dismiss(this.infrastructure);
            } else {
                this.Notifications.presentToast(data.message);
            }
            this.Notifications.dismissLoader();
        });
    }

    dismiss(infrastructure = {}) {
        this.viewCtrl.dismiss(infrastructure);
    }
}