import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { EquipmentsArticleDescription } from '../../../../equipments/articles/description/description';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';

import { config } from '../../../../../app.config';
import { CreateLinkedEquipmentForCE } from './create/create';
import { FunctionsHelper } from '../../../../../helpers/functions.helper';

@Component({
  selector: 'page-equipment',
  templateUrl: 'equipments.html',
  providers: [TasksServiceProvider,FunctionsHelper,ContactServiceProvider]
})
export class LinkedEquipmentWithCE {
  
  public equipments: any;
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
         this.getEquipments();
  }


  getEquipments(){
  	this.Notification.presentLoader();
  	this.ContactService.getLinkedEquipmentsCI(this.params.get('row_id'), 
                                              this.params.get('contact_id'), 
                                              1,
                                              this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.equipments = data;
        if(this.equipments.length == config.per_page){
            this.have_more = true;
        }
        this.backup = this.equipments.slice()
      } else {
        this.Notification.presentToast('Please Request Again');
        this.reload = true;
      }
      
    });
  }

  view(t){
    this.navCtrl.push(EquipmentsArticleDescription, { id:t.object_id })
  }

  info(t){
    
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getEquipments();
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
   this.navCtrl.push(CreateLinkedEquipmentForCE, { row_id : this.params.get('row_id'), contact_id : this.params.get('contact_id') })
  }
  
  reloadMe(){
     this.getEquipments();
  }
  
  getFirst(article){
     let $first = '--';
     
     if( this.fns.ObjLength(article.attrs_data) > 0 ) {
        let $key = Object.keys(article.attrs_data)[0];
        $first = article.attrs_data[$key];
     }
     
     return $first
  }

  delete(contact) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to unlink this article?',
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
              this.ContactService.deleteEquipmentLinkCI(contact.id)
              .then(data => {
                this.Notification.presentToast('Unlinked Successfully');
                this.getEquipments();
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

      this.equipments = this.backup.filter((article) => {

       var condition = this.fns.match(this.getFirst(article), val)

       return ( condition );

      })

    } else {
      this.equipments = this.backup
    }
  }

}
