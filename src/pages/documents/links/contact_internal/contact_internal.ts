import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../providers/tasks-service/tasks-service';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../../helpers/functions.helper';

import { config } from '../../../../app.config';
import { ContactInternalDescription } from '../../../contact/internal/show/show';
import { CreateLinkedContactInternalForDocuments } from '../contact_internal/create/create';
import { InfrastructureServiceProvider } from '../../../../providers/infrastructure-service/infrastructure-service';
import { SessionHelper } from '../../../../helpers/session.helper';
import { DocumentsList } from '../../documents_list/documents_list';

@Component({
  selector: 'page-agenda',
  templateUrl: 'contact_internal.html',
  providers: [TasksServiceProvider,DocumentServiceProvider,InfrastructureServiceProvider,FunctionsHelper]
})
export class LinkedContactInternalWithDocuments {
  
  public contacts: any= [];
  public backup: any;
  alphabets:any = [];
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams, 
			        public session: SessionHelper, 
              public TasksService: TasksServiceProvider, 
              public InfrastructureService: InfrastructureServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public fns: FunctionsHelper, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.getContacts();
  }

  backButtonClick(){
   this.navCtrl.push(DocumentsList)
  }
 
  getContacts(){
	  this.Notification.presentLoader();
  	this.DocumentService.getLinkedContactInternal(this.params.get('document_id'), 1,this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.contacts = data;
        this.backup = this.contacts.slice();
        
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

  view(contact){
    this.navCtrl.push(ContactInternalDescription, { id : contact.row_id })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getContacts();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;

      this.DocumentService.getLinkedContactInternal(this.params.get('document_id'), ++this.current_page, this.search)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.length < config.per_page){
              this.have_more = false;
          }

          res.forEach(d=> {
            this.contacts.push(d)
          });
          
          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
  }

  presentActionSheet(t) {
      let options = [];


      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(t);
                      }
                  }, {
                     text: 'Unlink',
                     role: 'destructive',
                     handler: () => {
                        this.delete(t);
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

  create(){
   this.navCtrl.push(CreateLinkedContactInternalForDocuments, { document_id : this.params.get('document_id') })
  }
  
  reloadMe(){
     this.getContacts();
  }

  delete(contact) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this agenda?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Ok',
            handler: () => {
               this.Notification.presentLoader();
                 this.DocumentService.deleteLinkedContactInternal( { id : contact.link_id } )
                 .then(data => {
                   this.Notification.dismissLoader();
                   this.getContacts();
               });
            }
          }
        ]
      });
      alert.present();
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

  getItems(ev: any) {

      this.current_page = 1;
      if(!this.is_searched){
        this.is_searched = true;
        var val = this.search.toLowerCase();
        console.log(this.backup)
        setTimeout( ()=>{
          this.is_searched = false;
           
          this.contacts = this.backup.filter( (contact) => {
               var condition = this.fns.match(contact.first_name, val) ||
                           this.fns.match(contact.last_name, val) ||
                           this.fns.match(contact.email, val)
                   return ( condition );
            });

        },500)
      }
    }

}
