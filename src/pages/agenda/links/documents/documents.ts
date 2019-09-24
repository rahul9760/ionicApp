import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../providers/tasks-service/tasks-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { AgendaDescription } from '../../show/show';
import { AgendaCreate } from '../../create/create';
import { Agenda } from '../../list/list';
import { config } from '../../../../app.config';
import { ContactExternalDescription } from '../../../contact/external/show/show';
import {DocumentsListView} from "../../../documents/documents_list_view/documents_list_view";
import {DocumentsListInfo} from "../../../documents/documents_list_info/documents_list_info";
import { CreateLinkedDocument } from '../documents/create/create';
import { FunctionsHelper } from '../../../../helpers/functions.helper';


@Component({
  selector: 'page-agenda',
  templateUrl: 'documents.html',
  providers: [TasksServiceProvider,FunctionsHelper]
})
export class LinkedDocuments {
  
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
              public fns: FunctionsHelper, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {

  }  

  backButtonClick(){
   this.navCtrl.pop()
  }

  ionViewWillEnter(){
    this.getDocuments();
  }
 
  getDocuments(){
  	this.Notification.presentLoader();
  	this.TasksService.getLinkedDocuments(this.params.get('task_id'), 1,this.search)
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
   this.navCtrl.push(CreateLinkedDocument, { task_id : this.params.get('task_id') })
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
              this.TasksService.deleteDocumentLink(contact.id)
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
