import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';

import {ContactInternalCreateScreen3} from '../screen3/screen3'
import {CreateDepartment} from './create/create'

import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { config } from '../../../../../app.config';

@Component({
  selector: 'page-contact',
  templateUrl: 'screen2.html'
})

export class ContactInternalCreateScreen2 {

	departments:any = []
	department:any
	current_page: number = 1;
	have_more: boolean = false;
	search: String = '';
	is_request:  boolean = false;
	is_searched:  boolean = false;
	is_hold:  boolean = false;
	reload:  boolean = false;

	constructor( public navCtrl: NavController, 
				 public params: NavParams, 
				 public Notification: NotificationsHelper, 
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
		this.getContactDivisions();
		console.log(this.params)
	}

	getContactDivisions(){
		
		this.Notification.presentLoader();
		
		this.ContactService.getContactDepartments(this.params.get('id'))
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				
				this.departments = data;

				if(this.departments.length == config.per_page){
				    this.have_more = true;
				}

			} else {

				this.Notification.presentToast('Please Request Again');
				this.reload = true;

			}

		});
	}

	next(){
		this.navCtrl.push( ContactInternalCreateScreen3 , {
            site_id: this.params.get('id'),
            department_id: this.department,
            page: this.params.get('page'),
            request_id: this.params.get('request_id')
        });
	}

	create(){
		 this.navCtrl.push( CreateDepartment , {
             site_id: this.params.get('id')
         });
	}
	
}
