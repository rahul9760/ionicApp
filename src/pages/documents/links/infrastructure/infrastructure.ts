import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../providers/tasks-service/tasks-service';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';

import { config } from '../../../../app.config';
import { DocumentsList } from '../../documents_list/documents_list';
import { CreateLinkedInfrastructureForDocuments } from './create/create';
import { FunctionsHelper } from '../../../../helpers/functions.helper';
import { InfrastructureDescription } from '../../../infrastructure/show/show'

@Component({
  selector: 'page-infrastructure',
  templateUrl: 'infrastructure.html',
  providers: [TasksServiceProvider,FunctionsHelper]
})
export class LinkedInfrastructureWithDocuments {
  
  public infrastructure: any;
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
              public DocumentService: DocumentServiceProvider, 
              public fns: FunctionsHelper, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
         this.getInfrastructure();
  }
 
  backButtonClick(){
   this.navCtrl.push(DocumentsList)
  }
  getInfrastructure(){
  	this.Notification.presentLoader();
  	this.DocumentService.getLinkedInfrastructure(this.params.get('document_id'), 1,this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.infrastructure = data;
        if(this.infrastructure.length == config.per_page){
            this.have_more = true;
        }
        this.backup = this.infrastructure.slice()
      } else {
        this.Notification.presentToast('Please Request Again');
        this.reload = true;
      }
      
    });
  }

  view(t){
    this.navCtrl.push(InfrastructureDescription, { id:t.location_id })
  }

  info(t){
    this.navCtrl.push(InfrastructureDescription, { id:t.location_id })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getInfrastructure();
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
   this.navCtrl.push(CreateLinkedInfrastructureForDocuments, { document_id : this.params.get('document_id') })
  }
  
  reloadMe(){
     this.getInfrastructure();
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
              this.DocumentService.deleteInfrastructureLink(contact.id)
              .then(data => {
                this.Notification.presentToast('Unlinked Successfully');
                this.getInfrastructure();
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

      this.infrastructure = this.backup.filter((location) => {

       var condition = this.fns.match(location.name, val) ||
                       this.fns.match(location.barcode, val)

       return ( condition );

      })

    } else {
      this.infrastructure = this.backup
    }
  }

}
