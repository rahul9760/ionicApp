import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';

import { CreatePersonCI } from './create/create';
import { UploadProfilePictureCI } from './upload/upload';

import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';

import { CreateLinkedContactInternalForDocuments } from '../../../../documents/links/contact_internal/create/create';
import { CreateLinkedContactInternalForAgenda } from '../../../../agenda/links/contact_internal/create/create';
import { CreateLinkedContactInternalForInfrastructure } from '../../../../infrastructure/links/contact_internal/create/create';
import { CreateLinkedContactInternalForEquipments } from '../../../../equipments/links/contact_internal/create/create';

@Component({
  selector: 'page-screen3',
  templateUrl: 'screen3.html'
})

export class ContactInternalCreateScreen3 {
	
	employee_data:any;
	reload:Boolean = false;
	employee:any = { email : '', person : '', attributes : {} };
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public params: NavParams, 
				 public Notification: NotificationsHelper, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
		this.employee.contact_department_id = this.params.get('department_id');
		this.employee.site_id = this.params.get('site_id');
		this.employee.person = this.params.get('person_id') || '' ;
		this.createContactsFields();
	}

	createContactsFields(){

		this.Notification.presentLoader();
		this.ContactService.getContactInternalFields()
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				this.employee_data = data;
			} else {
				this.Notification.presentToast('Please Request Again');
				this.reload = true;
			}

		});

	}

	save(){
		
		if(this.validate()){
			this.Notification.presentLoader();

			this.ContactService.saveEmployee(this.employee)
			.then(data => {
				this.Notification.dismissLoader();
				
				if(data.status){
					this.employee.id = data.employee.id;
					this.goBack();
				}

				this.Notification.presentToast(data.message)
			});
		} else {
			this.Notification.presentToast('Please fill the required fields',3000, 'error-toaster')
		}
		
	}

	addPerson(){
		this.navCtrl.push( CreatePersonCI , {
            site_id: this.params.get('site_id'),
            department_id: this.params.get('department_id'),
            page: this.params.get('page'),
            document_id: this.params.get('document_id')
        });
	}

	validate(){
	   
	   let conditions = []

	   this.employee_data.attributes.employee.forEach( (attribute) => {
	   	if(attribute.is_required == true ){
	   		conditions.push( this.employee.attributes[attribute.id] !== '' )
	   	}
	   });

	   conditions.push(this.employee.email !== '')
	   conditions.push(this.employee.person !== '')
	  
	   return (conditions.indexOf(false) == -1);
	}

	skip(){
		this.navCtrl.push(UploadProfilePictureCI, { employee : this.employee, employee_data : this.employee_data });
	}

	goBack(){
		
		switch( this.params.get('page') ){
			
			case 'linked_documents':
				this.navCtrl.push( CreateLinkedContactInternalForDocuments , { document_id : this.params.get('request_id'), employee_id : this.employee.id } );
			break;

			case 'linked_agenda':
				this.navCtrl.push( CreateLinkedContactInternalForAgenda , { task_id : this.params.get('request_id'), employee_id : this.employee.id } );
			break;

			case 'linked_infrastructure':
				this.navCtrl.push( CreateLinkedContactInternalForInfrastructure , { location_id : this.params.get('request_id'), employee_id : this.employee.id } );
			break;

			case 'linked_equipment':
				this.navCtrl.push( CreateLinkedContactInternalForEquipments , { equipment_id : this.params.get('request_id'), employee_id : this.employee.id } );
			break;

			default:
				this.navCtrl.push(UploadProfilePictureCI, { employee : this.employee , employee_data : this.employee_data } );
			break;

		}

	}
}
