import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { DocumentServiceProvider } from '../../../../../providers/document-service/document-service';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { EquipmentServiceProvider } from '../../../../../providers/equipment-service/equipment-service'
import { ContactInternalCreateScreen1 } from '../../../../contact/internal/create/screen1/screen1';

import { LinkedContactInternalWithEquipments } from '../contact_internal';


@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: [TasksServiceProvider, EquipmentServiceProvider]
})

export class CreateLinkedContactInternalForEquipments {
  
  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public contacts: any;
  public divisions: any;
  public organisations: any;
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
              public EquipmentService: EquipmentServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public ContactService: ContactServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.equipment_id = this.params.get('equipment_id');
  }


  getItems(ev: any) {
      this.current_page = 1;
      if(!this.is_searched){
        this.is_searched = true;
        setTimeout( ()=>{

          this.TasksService.searchContactsInternal(this.search.toLowerCase())
          .then(data => {
            this.is_searched = false;
            this.contacts = data.contacts;
            this.divisions = data.divisions;
            this.organisations = data.organisations;
          });
        },500)
      }
  }

  save(){
    this.EquipmentService.saveLinkedContactInternal(this.link)
    .then(data => {

      if(data.status){
        this.navCtrl.push(LinkedContactInternalWithEquipments , { equipment_id : this.params.get('equipment_id')} )
      }

      this.Notification.presentToast(data.message)
      
    });
  }

  initContact(contact){
   this.link.name = contact.first_name + ' ' + contact.last_name;
   this.link.contact_id = contact.p_contact_id;
   this.link.email = contact.email;
   this.link.row_id = contact.row_id;
  }

  addContact(){
    this.navCtrl.push(ContactInternalCreateScreen1, { request_id: this.params.get('equipment_id'), page: 'linked_equipment' } )
  }
 


}
