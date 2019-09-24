import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { TasksServiceProvider } from '../../../../providers/tasks-service/tasks-service';
import { config } from '../../../../app.config';
import { CreateLinkedAgendaForEquipments } from '../agenda/create/create';
import { AgendaDescription } from '../../../agenda/show/show';
import { ContactServiceProvider } from '../../../../providers/contact-service/contact-service';
import { FunctionsHelper } from '../../../../helpers/functions.helper';
import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service';

@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
  providers: [FunctionsHelper, EquipmentServiceProvider]
})

export class LinkedAgendaWithEquipments {
 
  public agendas: any;
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
              public fns: FunctionsHelper, 
              public TasksService: TasksServiceProvider, 
              public EquipmentService: EquipmentServiceProvider, 
              public ContactService: ContactServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
         this.getAgendas();
  }

 
  getAgendas(){
    this.Notification.presentLoader();
    this.EquipmentService.getLinkedAgendas(this.params.get('equipment_id'), 1,this.search)
    .then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.agendas = data;
        if(this.agendas.length == config.per_page){
            this.have_more = true;
        }
        
        this.backup = this.agendas.slice()

      } else {
        this.Notification.presentToast('Please Request Again');
        this.reload = true;
      }
      
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getAgendas();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;

      this.EquipmentService.getLinkedAgendas(this.params.get('location_id'), ++this.current_page, this.search)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.length < config.per_page){
              this.have_more = false;
          }

          res.forEach(d=> {
            this.agendas.push(d)
          });

          this.backup = this.agendas.slice()

          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
  }

  presentActionSheet(t) {
      let options = [];


      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(t.task_id);
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

  view(id){
    this.navCtrl.push(AgendaDescription, { id : id })
  }

  create(){
   this.navCtrl.push(CreateLinkedAgendaForEquipments, { equipment_id : this.params.get('equipment_id') })
  }

  delete(agenda) {
    
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
              this.EquipmentService.deleteAgendaLink(agenda.id)
              .then(data => {
                this.Notification.presentToast('Unlinked Successfully');
                this.getAgendas();
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

      this.agendas = this.backup.filter((agenda) => {

       var condition = this.fns.match(agenda.name, val) ||
                       this.fns.match(agenda.description, val) ||
                       this.fns.match(agenda.relation_type, val) ||
                       this.fns.match(agenda.status, val)

       return ( condition );

      })

    } else {
      this.agendas = this.backup
    }
  }


}
