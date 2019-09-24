import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { config } from '../../../../../../app.config';
import { SessionHelper } from '../../../../../../helpers/session.helper';
import { ContactInternalCreateScreen1 } from '../screen1';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})

export class CreateSite {

	site:any = { name : '' , attributes : {} };
	data:any;
	reload:Boolean = false;
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public params: NavParams, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
				 this.createOrgFields()
				 
	}

	save(){
		this.Notification.presentLoader();
		
		this.ContactService.saveSite(this.site)
		.then(data => {
			this.Notification.dismissLoader();
			this.Notification.presentToast(data.message);
			this.navCtrl.push(ContactInternalCreateScreen1)
		});
	}

	createOrgFields(){

		this.Notification.presentLoader();
		
		this.ContactService.getContactInternalFields()
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
