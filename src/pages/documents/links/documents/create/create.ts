import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { DocumentServiceProvider } from '../../../../../providers/document-service/document-service';
import { CreateDocument } from '../../../../common/document/document';

import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { config } from '../../../../../app.config';

import { LinkedDocumentWithDocuments } from '../documents';

@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: []
})

export class CreateLinkedDocumentForDocument {
  
  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public documents: any = [];
  public current_page: number = 1;
  public have_more: boolean = false;
  public search: String = '';
  public is_request: boolean = false;
  public is_searched: boolean = false;
  public is_hold: boolean = false;
  public reload: boolean = false;

  constructor(public navCtrl: NavController,
		          public params: NavParams, 
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.document_parent_id = this.params.get('document_id');
  }

 
  getItems(ev: any) {

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.DocumentService.searchDocuments(this.search.toLowerCase())
        .then(data => {

          this.is_searched = false;
          if(data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.documents = data;
        });
      },500);
    }
  }  

  addDocument(){
    this.navCtrl.push( CreateDocument );
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){
      this.is_request = true;
      let doc_ids = [];
      this.documents.forEach(d=> {
          doc_ids.push(d.id);
      });

      this.DocumentService.getDocuments(++this.current_page,this.search,doc_ids.join(','))
      .then(res => {
        this.is_request = false;
        if( res.error == undefined ){
          if(res.documents.length < config.per_page){
              this.have_more = false;
          }

          res.documents.forEach(d=> {
            this.documents.push(d);
          });

          infiniteScroll.complete();
        } else {
          --this.current_page;
          this.doInfinite(infiniteScroll);
        }
      });
    }
  }

  save(){
    
    this.DocumentService.saveDocumentDocument(this.link)
      .then(data => {
        this.Notification.dismissLoader();

        if( data.status ){
          this.navCtrl.push( LinkedDocumentWithDocuments , { document_id : this.params.get('document_id') } );
        }
        this.Notification.presentToast(data.message);
    });
  }

  initDocument(document){
    this.link.name = document.designation;
    this.link.document_child_id = document.id;
  }

}
