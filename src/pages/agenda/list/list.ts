import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../providers/tasks-service/tasks-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { AgendaDescription } from '../show/show';
import { AgendaCreate } from '../create/create';
import { Dashboard } from '../../dashboard/dashboard';
import { config } from '../../../app.config';


@Component({
  selector: 'page-agenda',
  templateUrl: 'list.html',
  providers: [TasksServiceProvider]
})
export class Agenda {
 
  public tasks: any;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
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
  	this.TasksService.getTasks(1,this.search)
  	.then(data => {
      this.Notification.dismissLoader();
     
      if( data.error == undefined ){
        this.tasks = data;
        if(this.tasks.length == config.per_page){
            this.have_more = true;
        }
      } else {
        this.Notification.presentToast('Please Request Again');
        this.reload = true;
      }
      
    });
  }

  view(id){
    this.navCtrl.push(AgendaDescription, { id : id })
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

      this.TasksService.getTasks(++this.current_page,this.search)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.length < config.per_page){
              this.have_more = false;
          }

          res.forEach(d=> {
            this.tasks.push(d)
          });

          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
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

            this.tasks = data;
          });
        },500)
      }
  }

  presentActionSheet(t) {
      let options = [];


      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(t.id);
                      }
                  }, {
                     text: 'Delete',
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
    this.navCtrl.push(AgendaCreate)
  }
  
  reloadMe(){
     this.getAgendas();
  }

  back(){
    this.navCtrl.push(Dashboard);
  }

  delete(task) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this agenda?',
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
               this.TasksService.delete(task.id)
              .then(data => {
                 this.getAgendas();
              });
            }
          }
        ]
      });
      alert.present();
    
  } 

}
