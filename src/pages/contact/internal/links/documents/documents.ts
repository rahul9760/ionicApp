import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';

import { config } from '../../../../../app.config';

import { ContactInternalDescription } from '../../show/show';
import { DocumentsListView } from "../../../../documents/documents_list_view/documents_list_view";
import { DocumentsListInfo } from "../../../../documents/documents_list_info/documents_list_info";
import { CreateLinkedDocumentForCI } from '../documents/create/create';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';

import { FunctionsHelper } from '../../../../../helpers/functions.helper';


@Component({
  selector: 'page-agenda',
  templateUrl: 'documents.html',
  providers: [TasksServiceProvider,FunctionsHelper]
})
export class LinkedDocumentsWithCI {
  
  public documents: any;
  public backup: any;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
			        public params: NavParams, 
              public TasksService: TasksServiceProvider, 
              public ContactService: ContactServiceProvider, 
              public fns: FunctionsHelper, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.getDocuments();
  }
  
  backButtonClick(){
    this.navCtrl.push(ContactInternalDescription, { id: this.params.get('row_id')} )
  }

  getDocuments(){
  	this.Notification.presentLoader();
  	this.ContactService.getLinkedDocumentsCI(this.params.get('row_id'), this.params.get('contact_id'), 1,this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.documents = data;
        if(this.documents.length == config.per_page){
            this.have_more = true;
        }
        this.backup = this.documents.slice()
      } else {
        this.Notification.presentToast('Please Request Again');
        this.reload = true;
      }
      
    });
  }

  view(t){
    this.navCtrl.push(DocumentsListView, { id : t.document_id })
  }

  info(t){
    this.navCtrl.push(DocumentsListInfo, { id : t.document_id })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getDocuments();
      refresher.complete();
    }, 2000);
  }

  presentActionSheet(t) {
      let options = [];


      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.info(t);
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
   this.navCtrl.push(CreateLinkedDocumentForCI, { row_id : this.params.get('row_id'), contact_id : this.params.get('contact_id') })
  }
  
  reloadMe(){
     this.getDocuments();
  }


  delete(contact) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to unlink this document?',
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
              this.ContactService.deleteDocumentLinkCI(contact.id)
              .then(data => {
                this.Notification.presentToast('Unlinked Successfully');
                this.getDocuments();
              });
            }
          }
        ]
      });
      alert.present();
  } 

  getItems(ev: any) {

    let val = ev.target.value;
    console.log(val);
    if (val && val.trim() != '') {

      this.documents = this.backup.filter((document) => {

       var condition = this.fns.match(document.designation, val) ||
                       this.fns.match(document.relation_type, val) ||
                       this.fns.match(document.cat_name, val) ||
                       this.fns.match(document.sub_cat_name, val)

       return ( condition );

      })

    } else {
      this.documents = this.backup
    }
  }

}
