import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../../providers/tasks-service/tasks-service';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { config } from '../../../../../../app.config';
import { LinkedAgendaWithCI } from '../agenda';
import { AgendaCreate } from '../../../../../agenda/create/create';



@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: []
})

export class CreateLinkedAgendaForCI {

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
              public TasksService: TasksServiceProvider,
              public ContactService: ContactServiceProvider,
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.row_id = this.params.get('row_id');
              this.link.contact_id = this.params.get('contact_id');
   
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
          console.log('asdasd');
          --this.current_page;
          this.doInfinite(infiniteScroll);
        }
      });
    }
  }

  save(){
    this.ContactService.saveLinkedAgendaCI(this.link)
    .then(data => {
      if( data.status ){
        this.navCtrl.push(LinkedAgendaWithCI , { row_id : this.params.get('row_id'), contact_id : this.params.get('contact_id') } )
      }
      
      this.Notification.presentToast(data.message);
      
    });
  }

  initTask(task){
   this.link.name = task.name;
   this.link.task_id = task.id;
  }
 
  addTask(){
    this.navCtrl.push(AgendaCreate, { page: 'linked_contact_internal', row_id : this.params.get('row_id'), request_id : this.params.get('contact_id') })
  }
  
}
