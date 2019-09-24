import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { ContactExternalCreateScreen2 } from '../screen2/screen2';

import { CreateOrganisation } from './create/create';

import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { config } from '../../../../../app.config';

@Component({
  selector: 'page-contact',
  templateUrl: 'screen1.html'
})

export class ContactExternalCreateScreen1 {

	organisations:any = []
	organisation:any;
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
		this.getContactOrgs();
		console.log(this.params)
	}

	getContactOrgs(){
		
		this.Notification.presentLoader();
		
		this.ContactService.getContactOrgs(1,this.search)
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				
				this.organisations = data;

				if(this.organisations.length == config.per_page){
				    this.have_more = true;
				}

			} else {

				this.Notification.presentToast('Please Request Again');
				this.reload = true;

			}

		});
	}

	doInfinite(infiniteScroll) {

		if(!this.is_request){

		  this.is_request = true;

		  this.ContactService.getContactOrgs(++this.current_page,this.search)
		  .then(res => {

		    this.is_request = false;
		    
		    if( res.error == undefined ){
		      if(res.length < config.per_page){
		          this.have_more = false;
		      }

		      res.forEach(d=> {
		        this.organisations.push(d)
		      });

		      infiniteScroll.complete();
		    
		    } else {

		      --this.current_page;
		      this.doInfinite(infiniteScroll);

		    }

		  });
		}
	}	


	getItems(ev: any) {

	    this.current_page = 1;
	    if(!this.is_searched){
	      this.is_searched = true;
	      setTimeout( ()=>{

	        this.ContactService.searchContactsOrgs(this.search.toLowerCase())
	        .then(data => {

	          this.is_searched = false;
	          if(data.length < config.per_page){
	              this.have_more = false;
	          } else {
	            this.have_more = true;
	          }

	          this.organisations = data;
	        });
	      },500)
	    }
  	}

	next(){
		this.navCtrl.push( ContactExternalCreateScreen2 , {
            id: this.organisation,
            page: this.params.get('page'),
            request_id: this.params.get('request_id')
        });
	}

	create(){
		this.navCtrl.push(CreateOrganisation);
	}

}
