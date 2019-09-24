import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';

import { CreatePerson } from './create/create';
import { UploadProfilePictureCE } from './upload/upload';

import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';

import { CreateLinkedContactExternalForDocuments } from '../../../../documents/links/contact_external/create/create';
import { CreateLinkedContactExternalForAgenda } from '../../../../agenda/links/contact_external/create/create';
import { CreateLinkedContactExternalForInfrastructure } from '../../../../infrastructure/links/contact_external/create/create'
import { CreateLinkedContactExternalForEquipments } from '../../../../equipments/links/contact_external/create/create'

@Component({
  selector: 'page-screen3',
  templateUrl: 'screen3.html',
  providers: []
})

export class ContactExternalCreateScreen3 {
	
	contact_data:any;
	reload:Boolean = false;
	new_contact:any = { email : '', person : '', attributes : {} };
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public params: NavParams, 
				 public Notification: NotificationsHelper, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
		this.new_contact.contact_division_id = this.params.get('division_id');
		this.new_contact.org_id = this.params.get('org_id');
		this.new_contact.person = this.params.get('person_id');
		this.createContactsFields();
		console.log(this.params, this.navCtrl)
	}

	createContactsFields(){

		this.Notification.presentLoader();
		this.ContactService.getContactFields()
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				this.contact_data = data;
			} else {
				this.Notification.presentToast('Please Request Again');
				this.reload = true;
			}

		});

	}

	save(){
		
		if(this.validate()){
			this.Notification.presentLoader();
			this.ContactService.saveContact(this.new_contact)
			.then(data => {
				this.Notification.dismissLoader();
				
				if(data.status){
					this.new_contact.id = data.contact.id;
					this.goBack();
				}

				this.Notification.presentToast(data.message)

			});
		} else {
			this.Notification.presentToast('Please fill the required fields', 3000, 'error-toaster')
		}
		
	}

	addPerson(){
		this.navCtrl.push( CreatePerson , {
            org_id: this.params.get('org_id'),
            division_id: this.params.get('division_id'),
            page : this.params.get('page')
        });
	}

	validate(){
	   
	   let conditions = []
	   
	   this.contact_data.attributes.contact.forEach( (attribute) => {
	   	if( attribute.is_required == true ){
	   		conditions.push( this.new_contact.attributes[attribute.id] !== '' )
	   	}
	   });

	   conditions.push(this.new_contact.email !== '')
	   conditions.push(this.new_contact.person !== '')

	   return (conditions.length > 0 && conditions.indexOf(false) == -1);
	}

	skip(){
		this.navCtrl.push(UploadProfilePictureCE, { contact : this.new_contact, contact_data : this.contact_data, page : this.params.get('page') });
	}

	goBack(){
		
		switch( this.params.get('page') ){
			
			case 'linked_documents':
				this.navCtrl.push( CreateLinkedContactExternalForDocuments , { document_id : this.params.get('request_id'), contact_id : this.new_contact.id } );
			break;
			
			case 'linked_agenda':
				this.navCtrl.push( CreateLinkedContactExternalForAgenda , { task_id : this.params.get('request_id'), contact_id : this.new_contact.id } );
			break;
			
			case 'linked_infrastructure':
				this.navCtrl.push( CreateLinkedContactExternalForInfrastructure , { location_id : this.params.get('request_id'), contact_id : this.new_contact.id } );
			break;
			
			case 'linked_equipment':
				this.navCtrl.push( CreateLinkedContactExternalForEquipments , { equipment_id : this.params.get('request_id'), contact_id : this.new_contact.id } );
			break;

			default:
				this.navCtrl.push(UploadProfilePictureCE, { contact : this.new_contact, contact_data : this.contact_data, page : this.params.get('page') });
			break;
			
		}

	}

	
}
