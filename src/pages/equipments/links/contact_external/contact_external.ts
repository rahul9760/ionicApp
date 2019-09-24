import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';

import { config } from '../../../../app.config';
import { ContactExternalDescription } from '../../../contact/external/show/show';
import { CreateLinkedContactExternalForEquipments } from '../contact_external/create/create';
import { FunctionsHelper } from '../../../../helpers/functions.helper';

@Component({
  selector: 'page-agenda',
  templateUrl: 'contact_external.html',
  providers: [FunctionsHelper, EquipmentServiceProvider]
})
export class LinkedContactExternalWithEquipments  {
  
  public contacts: any= [];
  public backup: any = [];
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
			        public params: NavParams,
              public EquipmentService: EquipmentServiceProvider, 
              public fns: FunctionsHelper, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
         this.getContacts();
  }
 
  getContacts(){
	  this.Notification.presentLoader();
  	this.EquipmentService.getLinkedContactExternal(this.params.get('equipment_id'), 1,this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.contacts = data;
        if(this.contacts.length == config.per_page){
            this.have_more = true;
        }
        this.backup = this.contacts.slice();
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

      this.EquipmentService.getLinkedContactExternal(this.params.get('equipment_id'), ++this.current_page, this.search)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.length < config.per_page){
              this.have_more = false;
          }

          res.forEach(d=> {
            this.contacts.push(d)
          });

          this.backup = this.contacts.slice();
          
          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
  }

  getItems(ev: any) {

    let val = ev.target.value;
    
    if (val && val.trim() != '') {

      this.contacts = this.backup.filter((contact) => {

       var condition = this.fns.match(contact.first_name, val) || 
                       this.fns.match(contact.last_name, val) || 
                       this.fns.match(contact.relation_type, val) || 
                       this.fns.match(contact.email, val)

       return ( condition );

      })

    } else {
      this.contacts = this.backup
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
   this.navCtrl.push(CreateLinkedContactExternalForEquipments, { equipment_id : this.params.get('equipment_id')})
  }
  
  reloadMe(){
     this.getContacts();
  }

  delete(contact) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to unlink this agenda?',
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
              this.EquipmentService.deleteLinkedContactExternal(contact.link_id)
              .then(data => {
                this.Notification.presentToast('Unlinked Successfully');
                this.getContacts();
              });
            }
          }
        ]
      });
      alert.present();
  }

}
