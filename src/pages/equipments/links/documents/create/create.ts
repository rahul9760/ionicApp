import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { DocumentServiceProvider } from '../../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { config } from '../../../../../app.config';
import { LinkedDocumentsWithEquipments } from '../documents';
import { InfrastructureServiceProvider } from '../../../../../providers/infrastructure-service/infrastructure-service';
import { EquipmentServiceProvider } from '../../../../../providers/equipment-service/equipment-service';
import { Screen1 } from '../../../../documents/documents_create/screen1/screen1';


@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: [TasksServiceProvider,InfrastructureServiceProvider,EquipmentServiceProvider]
})

export class CreateLinkedDocumentsForEquipments {
  
  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public documents: any = [];
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
              public InfrastructureService: InfrastructureServiceProvider, 
              public EquipmentService: EquipmentServiceProvider, 
              public ContactService: ContactServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.equipment_id = this.params.get('equipment_id');
              //this.getDocuments();
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
      },500)
    }
  }  

  doInfinite(infiniteScroll) {
    console.log('1');
    if(!this.is_request){
      this.is_request = true;
      let doc_ids = []
      this.documents.forEach(d=> {
          doc_ids.push(d.id);
      });

      this.DocumentService.getDocuments(++this.current_page,this.search,doc_ids.join(','))
      .then(res => {
        console.log(res);
        this.is_request = false;
        if( res.error == undefined ){
          if(res.documents.length < config.per_page){
              this.have_more = false;
          }

          res.documents.forEach(d=> {
            this.documents.push(d)
          });

          infiniteScroll.complete();
        } else {
          console.log('asdasd');
          --this.current_page;
          this.doInfinite(infiniteScroll);
        }
      });
    }
  }

  save(){
    this.Notification.presentLoader();
    console.log(this.link);
    this.EquipmentService.saveLinkedDocument(this.link)
    .then(data => {
      this.Notification.dismissLoader();
      if( data.status ){
        this.navCtrl.push(LinkedDocumentsWithEquipments , { equipment_id : this.params.get('equipment_id') } )
      }
      
      this.Notification.presentToast(data.message);
    });
  }

  initDocument(document){
   this.link.name = document.designation;
   this.link.document_id = document.id;
  }

  addDocument(){
    this.navCtrl.push(Screen1, { request_id: this.params.get('equipment_id'), page: 'linked_equipment' } )
  }
 


}
