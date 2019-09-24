import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';

import { ContactExternalCreateScreen3 } from '../screen3/screen3';
import { CreateDivision } from './create/create';

import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';

import { config } from '../../../../../app.config';

@Component({
  selector: 'page-contact',
  templateUrl: 'screen2.html'
})

export class ContactExternalCreateScreen2 {

	divisions:any = []
	division:any
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
		
		this.ContactService.getContactDivisions(this.params.get('id'))
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				
				this.divisions = data;

				if(this.divisions.length == config.per_page){
				    this.have_more = true;
				}

			} else {

				this.Notification.presentToast('Please Request Again');
				this.reload = true;

			}

		});
	}

	next(){
		this.navCtrl.push( ContactExternalCreateScreen3 , {
            org_id: this.params.get('id'),
            division_id: this.division,
            request_id: this.params.get('request_id'),
            page: this.params.get('page')
        });
	}

	create(){
		this.navCtrl.push( CreateDivision , {
            org_id: this.params.get('id')
        });
	}
	
}
