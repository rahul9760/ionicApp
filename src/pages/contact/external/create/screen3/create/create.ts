import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { ContactExternalCreateScreen3 } from '../screen3';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})

export class CreatePerson {

	person:any = { name : '' , attributes : {} };
	data:any;
	reload:Boolean = false;
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public params: NavParams, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
				 this.person.contact_org_id = this.params.get('org_id');
				 this.person.contact_division_id = this.params.get('division_id');
				 this.createPersonFields()
	}

	save(){
		this.Notification.presentLoader();
		
		this.ContactService.savePerson(this.person)
		.then(data => {
			this.Notification.dismissLoader();
			this.Notification.presentToast(data.message);
			this.navCtrl.push(ContactExternalCreateScreen3, { id : this.params.get('org_id'), division_id : this.params.get('division_id') , person_id : data.person_id, page : this.params.get('page') });
		});
	}

	createPersonFields(){

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
