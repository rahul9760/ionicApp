import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { ContactExternalCreateScreen1 } from '../screen1';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})

export class CreateOrganisation {

	organisation:any = { name : '' , attributes : {} };
	data:any;
	reload:Boolean = false;
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
				 this.createOrgFields()
	}

	save(){
		this.Notification.presentLoader();
		
		this.ContactService.saveOrg(this.organisation)
		.then(data => {
			this.Notification.dismissLoader();
			this.Notification.presentToast(data.message);
			this.navCtrl.push(ContactExternalCreateScreen1)
		});
	}

	createOrgFields(){

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
