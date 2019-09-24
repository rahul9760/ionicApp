import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';
import {ContactInternalCreateScreen2} from '../screen2/screen2';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { config } from '../../../../../app.config';
import { SessionHelper } from '../../../../../helpers/session.helper';
import { CreateSite } from './create/create';

@Component({
  selector: 'page-contact',
  templateUrl: 'screen1.html'
})

export class ContactInternalCreateScreen1 {

	sites:any = []
	site:any;
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
		
		this.ContactService.getContactSites(1,this.search)
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				
				this.sites = data;

				if(this.sites.length == config.per_page){
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

		  this.ContactService.getContactSites(++this.current_page,this.search)
		  .then(res => {

		    this.is_request = false;
		    
		    if( res.error == undefined ){
		      if(res.length < config.per_page){
		          this.have_more = false;
		      }

		      res.forEach(d=> {
		        this.sites.push(d)
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

	        this.ContactService.searchContactsSites(this.search.toLowerCase())
	        .then(data => {

	          this.is_searched = false;
	          if(data.length < config.per_page){
	              this.have_more = false;
	          } else {
	            this.have_more = true;
	          }

	          this.sites = data;
	        });
	      },500)
	    }
  	}

	next(){
		this.navCtrl.push( ContactInternalCreateScreen2 , {
            id: this.site,
            page: this.params.get('page'),
            request_id: this.params.get('request_id')
        });
	}

	create(){
		this.navCtrl.push(CreateSite);
	}

}
