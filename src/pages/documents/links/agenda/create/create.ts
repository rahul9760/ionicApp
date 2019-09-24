import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, Events } from 'ionic-angular';
import { DocumentServiceProvider } from '../../../../../providers/document-service/document-service';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { config } from '../../../../../app.config';
import { LinkedAgendaWithDocuments } from '../agenda';
import { AgendaCreate } from '../../../../agenda/create/create';



@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: []
})

export class CreateLinkedAgendaForDocuments {

  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public agendas: any = [];
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public events: Events, 
              public TasksService: TasksServiceProvider,
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              
              this.link.task_id = this.params.get('task_id');
              // this.events.subscribe('document:linked_task', (task_id) => {
              //   this.link.task_id = task_id;
              // });
  }

 
  getItems(ev: any) {

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.TasksService.searchTasks(this.search.toLowerCase())
        .then(data => {

          this.is_searched = false;
          if(data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.agendas = data;
        });
      },500)
    }
  }  

  doInfinite(infiniteScroll) {
    console.log('1');
    if(!this.is_request){
      this.is_request = true;

      this.TasksService.getTasks(++this.current_page,this.search )
      .then(res => {
        console.log(res);
        this.is_request = false;
        if( res.error == undefined ){
          if(res.agendas.length < config.per_page){
              this.have_more = false;
          }

          res.agendas.forEach(d=> {
            this.agendas.push(d)
          });

          infiniteScroll.complete();
        } else {
          --this.current_page;
          this.doInfinite(infiniteScroll);
        }
      });
    }
  }

  save(){
    this.Notification.presentLoader();
    this.DocumentService.saveLinkedAgenda(this.link)
    .then(data => {
      this.Notification.dismissLoader();
      
      if( data.status ){
        this.navCtrl.push(LinkedAgendaWithDocuments , { document_id : this.params.get('document_id')} )
      }
      
      this.Notification.presentToast(data.message);

    });
  }

  initTask(task){
   this.link.name = task.name;
   this.link.task_id = task.id;
   this.link.document_id = this.params.get('document_id');
  }

  addTask(){
    this.navCtrl.push(AgendaCreate, { page: 'document' })
  }
 
}
