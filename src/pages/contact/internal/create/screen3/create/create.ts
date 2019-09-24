import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { ContactInternalCreateScreen3 } from '../screen3';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})

export class CreatePersonCI {

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
				 this.person.contact_site_id = this.params.get('site_id');
				 this.person.contact_department_id = this.params.get('department_id');
				 this.createPersonFields()
	}

	save(){
		this.Notification.presentLoader();
		
		this.ContactService.savePersonCI(this.person)
		.then(data => {
			this.Notification.dismissLoader();
			if(data.permission){
				this.Notification.presentToast(data.message);
			}
			this.navCtrl.push(ContactInternalCreateScreen3, { site_id :  this.person.contact_site_id, department_id : this.person.contact_department_id, person_id : data.person_id });
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
