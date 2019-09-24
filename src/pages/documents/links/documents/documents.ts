import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, AlertController } from 'ionic-angular';

import { NotificationsHelper } from '../../../../helpers/notifications.helper';

import { config } from '../../../../app.config';


import { FunctionsHelper } from '../../../../helpers/functions.helper';
import { SessionHelper } from '../../../../helpers/session.helper';
import { CreateLinkedDocumentForDocument } from './create/create';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';

import { DocumentsListInfo } from '../../documents_list_info/documents_list_info';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
  providers: [FunctionsHelper,DocumentServiceProvider]
})
export class LinkedDocumentWithDocuments {
  
  public documents: any;
  public current_user: any;
  public backup: any;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request: boolean = false;
  is_searched: boolean = false;
  is_hold: boolean = false;
  reload: boolean = false;

  constructor(public navCtrl: NavController,
			        public params: NavParams, 
              public fns: FunctionsHelper, 
              public alertCtrl: AlertController, 
              public DocumentService: DocumentServiceProvider, 
              public Notification: NotificationsHelper, 
              public session: SessionHelper,
              public events: Events, 
              public actionSheetCtrl: ActionSheetController) {
              this.current_user = this.session.getUser();

  }  

  backButtonClick(){
    console.log("back clicked");
    this.events.publish('back:clicked');
    // this.navCtrl.pop()
  }

  ionViewWillEnter(){
    this.getDocuments();
  }
 
  getDocuments(){
  	
    this.Notification.presentLoader();
   
    this.DocumentService.getLinkedDocumentDocuments(this.params.get('document_id'), 1,this.search)
    .then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.documents = data;
        if(this.documents.length == config.per_page){
            this.have_more = true;
        }
        this.backup = this.documents.slice()
      } else {
        this.Notification.presentToast('Please request again.');
        this.reload = true;
      }
    });
    
  }


  doRefresh(refresher) {
    
  }

  create(){
    this.navCtrl.push(CreateLinkedDocumentForDocument, { document_id : this.params.get('document_id') });
  }
  
  reloadMe(){
    this.getDocuments();
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

  view(document){
    let document_id = this.params.get('document_id')
    this.navCtrl.push(DocumentsListInfo, { id : (document_id == document.document_parent_id ? document.document_child_id : document.document_parent_id) })
  }


  delete(document) {
    
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
              this.DocumentService.deleteLinkedDocument(document.id)
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
    if (val && val.trim() != '') {
      this.documents = this.backup.filter((document) => {
        var condition = this.fns.match(document.designation, val);
          return condition;
        });
    } else {
      this.documents = this.backup;
    }
  }

  getOrignal(obj, key, other_key){
    let document_id = this.params.get('document_id');
    return (document_id == obj.document_parent_id ? obj[key] : obj[other_key])
  }

}
