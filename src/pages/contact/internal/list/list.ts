import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController, Content } from 'ionic-angular';

import { ContactInternalDescription } from '../show/show';
import { ContactInternalCreateScreen1 } from '../create/screen1/screen1';
import { Dashboard } from '../../../dashboard/dashboard';

import { ContactServiceProvider } from '../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { config } from '../../../../app.config';
import { SessionHelper } from '../../../../helpers/session.helper';
import { FunctionsHelper } from '../../../../helpers/functions.helper';

declare var document;

@Component({
  selector: 'page-contact',
  templateUrl: 'list.html',
  providers:[FunctionsHelper]
})
  


export class ContactInternal {
	
	@ViewChild(Content) content: Content;

	contacts:any = []
	alphabets:any = []
	backup:any
	current_page: number = 1;
	have_more: boolean = false;
	search: String = '';
	is_request:  boolean = false;
	is_searched:  boolean = false;
	is_hold:  boolean = false;
	reload:  boolean = false;

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public fns: FunctionsHelper,  
				 public session: SessionHelper,  
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
		this.getContactInternal();
	}
	
	getContactInternal(){
		this.Notification.presentLoader();
		this.ContactService.getContactInternals(1,this.search)
		.then(data => {
			this.Notification.dismissLoader();

			if( data.error == undefined ){
				this.is_request = true;
				this.contacts = data;
				this.backup = Object.assign({}, data);
				this.alphabets = Object.keys(data);

				if(this.contacts.length == config.per_page){
				    this.have_more = true;
				}

			} else {

				this.Notification.presentToast('Please Request Again');
				this.reload = true;

			}

		});
	}

  	doRefresh(refresher) {
		setTimeout(() => {
		  this.getContactInternal();
		  refresher.complete();
		}, 2000);
	}


	getItems(ev: any) {

	    this.current_page = 1;
	    if(!this.is_searched){
	      this.is_searched = true;
	      var val = this.search.toLowerCase();
	      setTimeout( ()=>{
	      	this.is_searched = false;
      		
      		this.alphabets.forEach(alphabet=> {
	      	
	      	  this.contacts[alphabet] = this.backup[alphabet].filter( (contact) => {
	      	 		var condition = this.fns.match(contact.first_name, val) ||
               						this.fns.match(contact.last_name, val) ||
               						this.fns.match(contact.email, val)
               		return ( condition );
	      	  });
	     	
	     	});

	      },500)
	    }
    }

	view(contact){
		this.navCtrl.push(ContactInternalDescription, { id : contact.row_id })
	}

	delete(id){
		this.Notification.presentLoader();
		this.ContactService.delete(id)
		.then(data => {
			this.Notification.dismissLoader();
			this.getContactInternal();
		});
	}

	create(){
		this.navCtrl.push(ContactInternalCreateScreen1)
	}

	back(){
	    this.navCtrl.push(Dashboard);
	}

	presentActionSheet(contact) {
	  let options = [];


	  options = options.concat([{
	                  text: 'Description',
	                  handler: () => {
	                    this.view(contact);
	                  }
	              }, {
	                 text: 'Deactivate',
	                 role: 'destructive',
	                 handler: () => {
	                    this.delete(contact.row_id);
	                 }
	              },{
	              text: 'Cancel',
	              role: 'cancel'
	          }]);

	  let actionSheet = this.actionSheetCtrl.create({
	      title: 'Choose one option',
	      buttons: options
		});
		actionSheet.present();
	}

	

	getContactByAlphabet(alphabet){
		if(this.contacts[alphabet]){
	   		var el = document.getElementById(alphabet+"_id");
	   		var rect = el.getBoundingClientRect();
	   		this.content.scrollTo(0, rect.top, 800);
		}
	}

	getProfilePic(contact){
		
		var path =  "assets/img/dummy_user.png"
		
		if(contact.profile_pic){
			path =  config.api_url + 
	                'documents/download?fileName=' + 
	                contact.profile_pic + 
	                '&token='+this.session.getToken() + 
	                '&type=profile_pic_ci'
		}

		return path
	}
	 
}
