import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';

import { ContactExternalCreateScreen2 } from '../screen2';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})

export class CreateDivision {

	division:any = { name : '' , attributes : {} };
	data:any;
	reload:Boolean = false;
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public params: NavParams, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
				 this.division.contact_org_id = this.params.get('org_id');
				 this.createDivFields()
	}

	save(){
		this.Notification.presentLoader();
		
		this.ContactService.saveDiv(this.division)
		.then(data => {
			this.Notification.dismissLoader();
			this.Notification.presentToast(data.message);
			this.navCtrl.push(ContactExternalCreateScreen2, { id : this.params.get('org_id')});
		});
	}

	createDivFields(){

		this.Notification.presentLoader();
		
		this.ContactService.getContactFields()
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				this.data = data;
			} else {
				this.Notification.presentToast('Please Request Again');
				this.reload = true;
			}

		});

	}

}
