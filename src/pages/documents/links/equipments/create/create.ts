import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { DocumentServiceProvider } from '../../../../../providers/document-service/document-service';
import { EquipmentServiceProvider } from '../../../../../providers/equipment-service/equipment-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../../../helpers/functions.helper';

import { config } from '../../../../../app.config';
import { LinkedEquipmentWithDocuments } from '../equipments';
import { Equipments } from '../../../../equipments/list/list';
import { CreateEquipmentLevel } from '../../../../equipments/list/create/create';
import { CreateLinkedEquipmentForDocumentsModal } from './modal';


@Component({
  selector: 'page-equipment-create',
  templateUrl: 'create.html',
  providers: [TasksServiceProvider,EquipmentServiceProvider,FunctionsHelper, CreateLinkedEquipmentForDocumentsModal]
})

export class CreateLinkedEquipmentForDocuments {
  
  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public articles: any = [];
  public attributes: any;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;
  model_data_id: any;
  levels_data_id:  any;

  constructor(public navCtrl: NavController,
              public params: NavParams, 
              public modelCtrl: ModalController, 
              public TasksService: TasksServiceProvider,  
              public fns: FunctionsHelper, 
              public ContactService: ContactServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public EquipmentService: EquipmentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.document_id = this.params.get('document_id');
              this.levels_data_id = this.params.get('levels_data_id');
              this.model_data_id = this.params.get('model_data_id');
  }

 
  getItems(ev: any) {

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.EquipmentService.getArticles(1, this.search.toLowerCase(), 0, 0)
        .then(data => {
         
          this.is_searched = false;
          this.articles = data.articles_data;
          this.attributes = data.article_attrs;    
         
          if(data.articles_data.length == config.per_page){
            this.have_more = true;
          }

        });

      }, 500)
    }
  }  
  
  getFirst(article){
     let $first = '--';
     
     if( this.fns.ObjLength(article.attrs_data) > 0 ) {
        let $key = Object.keys(article.attrs_data)[0];
        $first = article.attrs_data[$key];
     }
     
     return $first
  }

  save(){
    this.Notification.presentLoader();
    this.DocumentService.saveLinkedEquipment(this.link)
    .then(data => {
      this.Notification.dismissLoader();

      if( data.status ){
        this.navCtrl.push(LinkedEquipmentWithDocuments , { document_id : this.params.get('document_id')} )
      }
      
      this.Notification.presentToast(data.message);
    });
  }

  initLocation(article){
   this.link.name = this.getFirst(article);
   this.link.equipment_id = article.id;
  }
  
   presentPopover(myEvent) {
    let modal = this.modelCtrl.create(CreateLinkedEquipmentForDocumentsModal);
    modal.present({
      ev: myEvent
    });
   }



  addEquipment(myEvent) {
      let options = [];
      console.log(myEvent)

      options = options.concat([{
                      text: 'Create Equipment (Level 1)',
                      handler: () => {
                        this.navCtrl.push(CreateEquipmentLevel,{ parent_id : 0 })  
                      }
                  },{
                      text: 'Select Level',
                      handler: () => {
                        
                        this.presentPopover(myEvent)

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

}
