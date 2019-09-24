import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { ContactInternalCreateScreen2 } from '../screen2';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})

export class CreateDepartment {

	department:any = { name : '' , attributes : {} };
	data:any;
	reload:Boolean = false;
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public params: NavParams, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
				 this.department.site_id = this.params.get('site_id');
				 this.createDeptFields()
	}

	save(){
		this.Notification.presentLoader();
		this.ContactService.saveDepartment(this.department)
		.then(data => {
			this.Notification.dismissLoader();
			this.Notification.presentToast(data.message);
			this.navCtrl.push(ContactInternalCreateScreen2, { id : this.params.get('site_id') } );
		});
	}

	createDeptFields(){

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
