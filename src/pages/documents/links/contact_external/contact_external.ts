import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../providers/tasks-service/tasks-service';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../../helpers/functions.helper';

import { config } from '../../../../app.config';
import { DocumentsList } from '../../documents_list/documents_list';
import { ContactExternalDescription } from '../../../contact/external/show/show';
import { CreateLinkedContactExternalForDocuments } from '../contact_external/create/create';


@Component({
  selector: 'page-agenda',
  templateUrl: 'contact_external.html',
  providers: [TasksServiceProvider,DocumentServiceProvider,FunctionsHelper]
})
export class LinkedContactExternalWithDocuments {
  
  public contacts: any= [];
  alphabets:any = [];
  backup:any;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
			        public params: NavParams, 
              public fns: FunctionsHelper,
              public TasksService: TasksServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
         this.getContacts();
  }

  backButtonClick(){
   this.navCtrl.push(DocumentsList)
  }
 
  getContacts(){
	  this.Notification.presentLoader();
  	this.DocumentService.getLinkedContactExternal(this.params.get('document_id'), 1,this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.contacts = data;
        this.backup = this.contacts.slice();
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
    this.navCtrl.push(ContactExternalDescription, { id : contact.row_id })
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

      this.DocumentService.getLinkedContactExternal(this.params.get('task_id'), ++this.current_page, this.search)
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
   this.navCtrl.push(CreateLinkedContactExternalForDocuments, { document_id : this.params.get('document_id')})
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
                 this.DocumentService.deleteLinkedContactExternal( { id : contact.link_id } )
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

  getItems(ev: any) {

    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.contacts = this.backup.filter((contact) => {
        var condition = this.fns.match(contact.first_name, val);
        return condition;
      });
    } else {
      this.contacts = this.backup;
    }
  }
  
}
