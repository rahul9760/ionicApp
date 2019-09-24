import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { config } from '../../../../app.config';
import { CreateLinkedInfrastructureForEquipments } from './create/create';
import { FunctionsHelper } from '../../../../helpers/functions.helper';


@Component({
  selector: 'page-infrastructure',
  templateUrl: 'infrastructure.html',
  providers: [EquipmentServiceProvider,FunctionsHelper]
})
export class LinkedInfrastructureWithEquipments {
  
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
              public EquipmentService: EquipmentServiceProvider, 
              public fns: FunctionsHelper, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
         this.getDocuments();
  }  
 
  getDocuments(){
  	this.Notification.presentLoader();
  	this.EquipmentService.getLinkedInfrastructure(this.params.get('equipment_id'), 1,this.search)
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
    
  }

  info(t){
    
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
   this.navCtrl.push(CreateLinkedInfrastructureForEquipments, { equipment_id : this.params.get('equipment_id') })
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
              this.EquipmentService.deleteInfrastructureLink(contact.id)
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
