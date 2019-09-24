import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { InfrastructureLocationModal } from './infrastructurelocationmodal';

@Component({
    templateUrl: 'locationlistmodal.html',
    providers: [InfrastructureServiceProvider, NotificationsHelper]
})

export class LocationListModal {
  
    public levels = [];
  	public level = {};
  	public levelDetails = {};

    constructor(public platform: Platform, public params: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public InfrastructureService:InfrastructureServiceProvider, public Notifications: NotificationsHelper) {
    	
        this.levels = this.params.get('levels');
        
    	this.level = this.params.get('level');
		this.levelDetails["parentId"] = this.params.get('parentId');
		this.levelDetails["locationId"] = this.params.get('locationId');
    }

    getInfrastructureList(){
        this.Notifications.presentLoader();

        this.InfrastructureService.getInfrastructureList(1,'').then(data => {
            this.Notifications.dismissLoader();
            this.levels = data.locations;
        });
    }

    getSubInfrastructureList(){
        this.Notifications.presentLoader();
        let where = 'parent_id=' + this.levelDetails["parentId"] + '&location_id=' + this.levelDetails["locationId"];
        this.InfrastructureService.getInfrastructureList(1,'',where).then(data => {
            this.Notifications.dismissLoader();
            this.levels = data.locations;
        });
    }
  	
  	showModal(){

        this.Notifications.presentLoader();
    	
        let modal = this.modalCtrl.create(InfrastructureLocationModal, {
    		location_id: ( this.level ? this.level['location']['id'] : '' ),
    		parent_id: (this.level && this.level['parent_location'] ? this.level['parent_location']['id'] : 0 )
    	});

        modal.onDidDismiss(data=>{
            if(typeof this.levelDetails["parentId"]=="undefined" && Object.keys(data).length > 0){
    		    this.getInfrastructureList();
            } else if(Object.keys(data).length > 0) {
                this.getSubInfrastructureList();
            }
        });
    	modal.present();
        this.Notifications.dismissLoader();
    }

    setLocation(level){
    	this.dismiss(level);
    }

    dismiss(level) {
        this.viewCtrl.dismiss(level);
    }
    
}