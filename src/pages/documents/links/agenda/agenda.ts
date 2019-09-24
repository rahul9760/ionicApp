import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { TasksServiceProvider } from '../../../../providers/tasks-service/tasks-service';
import { config } from '../../../../app.config';
import { CreateLinkedAgendaForDocuments } from '../agenda/create/create';
import { AgendaDescription } from '../../../agenda/show/show';
import { FunctionsHelper } from '../../../../helpers/functions.helper';

@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
  providers: [FunctionsHelper]
})

export class LinkedAgendaWithDocuments {
 
  public agendas: any;
  public backup: any;

  current_page: number = 1;
  search: String = '';

  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;
  have_more: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams, 
              public DocumentService: DocumentServiceProvider, 
              public fns: FunctionsHelper, 
              public TasksService: TasksServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
  }  

  ionViewWillEnter(){
    this.getAgendas();
  }
 
  getAgendas(){
    this.Notification.presentLoader();
    this.DocumentService.getLinkedAgendas(this.params.get('document_id'), 1,this.search)
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

      this.DocumentService.getLinkedAgendas(this.params.get('document_id'), ++this.current_page, this.search)
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
   this.navCtrl.push(CreateLinkedAgendaForDocuments, { document_id : this.params.get('document_id') })
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
              this.DocumentService.deleteAgendaLink(agenda.id)
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
                       this.fns.match(agenda.relation_type, val)

       return ( condition );

      })

    } else {
      this.agendas = this.backup;
    }
  }


}
