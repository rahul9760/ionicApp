import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../providers/tasks-service/tasks-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import { config } from '../../../app.config';
import { LinkedContactExternalWithAgenda } from '../links/contact_external/contact_external';
import { LinkedContactInternalWithAgenda } from '../links/contact_internal/contact_internal';
import { LinkedDocuments } from '../links/documents/documents';
import { LinkedInfrastructureWithAgenda } from '../links/infrastructure/infrastructure';
import { LinkedEquipmentWithAgenda } from '../links/equipments/equipments';

@Component({
  selector: 'page-agenda',
  templateUrl: 'show.html',
  providers: [TasksServiceProvider]
})

export class AgendaDescription {
 
  current_user:any;
  task:any;
  backup:any;
  attendees:any = []
  public color: String = '#488aff';
  public item_header_class: String = 'item item-ios list-header list-header-ios';
  public input_class: String = "text-input text-input-ios"
  public is_edit : boolean = false;
  public is_requested : boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams, 
              public TasksService: TasksServiceProvider, 
              public session: SessionHelper, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
      this.current_user = this.session.getUser()
  }

  ionViewWillEnter(){
    this.getAgenda();
  }

  getAgenda(){
   this.Notification.presentLoader();
   this.TasksService.getTask(this.params.get('id'))
    .then(data => {
      this.Notification.dismissLoader();

      if( data.error == undefined ){
        this.task = data;
        this.initDurations();
      } else {
       this.Notification.presentToast('Please Request Again');
       this.reload = true;
      }

    });
  }

  initDurations(){
    if(this.task){
      var duration = this.task.duration_value;
      var dA = duration.split(',');
       
       if ( this.task.unit == 'days') {
          this.task.days = dA[0];
          this.task.hours = dA[1];
          this.task.minutes = dA[2];
       } else if ( this.task.unit == 'hours') {
          this.task.days = 0;
          this.task.hours = dA[1];
          this.task.minutes = dA[2];
       } else if ( this.task.unit == 'minutes') {
          this.task.days = 0;
          this.task.hours = 0;
          this.task.minutes = dA[2];
       } 
    } else {
       this.Notification.presentToast('Sorry, task not found');
       this.navCtrl.pop();
    }
  }

  priorityChipColor(){
    
    var color = '';

    switch(this.task.priority){

          case 'none':
            color = 'light'
          break;
          
          case 'low':
            color = 'light'
          break;

          case 'medium':
            color = 'secondary'
          break;

          case 'high':
            color = 'danger'
          break;
           
    }

    return color
  }

  statusChipColor(){
    var color = '';

    switch(this.task.status){

          case 'too late':
            color = 'danger'
          break;
          
          case 'to be done':
            color = 'secondary'
          break;
          
          case 'done':
            color = 'secondary'
          break;

          case 'high':
            color = 'danger'
          break;
           
    }

    return color
  }

  getUrl(user){
    return user ?  config.api_url + 
                  'documents/download?fileName=' + 
                   user.profile_pic.name + '&token=' + 
                   this.session.getToken() + 
                   '&type=profile_pic&thumb=true&' + 
                   '&org_id=' + user.org_id
                : 'assets/img/dummy_user.png'
  } 

  getAttendees(){
    this.TasksService.getAttendees()
    .then(data => {
      this.attendees = data;
    });
  }
  
  edit(){
    this.color = '#1ea209'; 
    this.is_edit = true;  
    this.backup = Object.assign({}, this.task);
  }
  
  update(){
    this.TasksService.update(this.task)
    .then(data => {
      this.resetVaribles();
      this.getAgenda();
    });
  }

  range(start, count) {
    return Array.apply(0, Array(count))
      .map(function (element, index) { 
        return index + start;  
    });
  }
  
  cancelEdition(){
    this.is_edit = false;
    this.color = '#488aff';
    this.task = this.backup;
  }
  
  resetVaribles(){
    this.is_edit = false;
    this.color = '#488aff';
  }

  link(type){
    console.log(type);
    
    switch(type){

          case 'contact_external':
            this.navCtrl.push(LinkedContactExternalWithAgenda, { task_id : this.params.get('id') })
          break;

          case 'contact_internal':
            this.navCtrl.push(LinkedContactInternalWithAgenda, { task_id : this.params.get('id') })
          break;
          
          case 'document':
            this.navCtrl.push(LinkedDocuments, { task_id : this.params.get('id') })
          break;
          
          case 'infrastructure':
            this.navCtrl.push(LinkedInfrastructureWithAgenda, { task_id : this.params.get('id') })
          break;
          
          case 'equipment':
            this.navCtrl.push(LinkedEquipmentWithAgenda, { task_id : this.params.get('id') })
          break;
           
    }
    
  }


  generateDurations(){

     var result = '';

     if ( this.task.unit == 'days') {
       
       result = this.task.days + (this.task.days > 1 ? ' days ' : ' day ') + this.task.hours + (this.task.hours > 1 ? ' hours ' : ' hour ') +  this.task.minutes + (this.task.minutes > 1 ? ' minutes ' : ' minute ')

     } else if ( this.task.unit == 'hours') {
       
       result = this.task.hours + (this.task.hours > 1 ? ' hours ' : ' hour ') +  this.task.minutes + (this.task.minutes > 1 ? ' minutes ' : ' minute ')

     } else if ( this.task.unit == 'minutes') {

       result = this.task.minutes + (this.task.minutes > 1 ? ' minutes' : ' minute')
     } 

     return result;
  }

  getName(user){
     return user.name.slice(0,8);
  }

  getOrg(task){
     return task.org.name.slice(0,8);
  }

  count(c){
    return c > 99 ? '99+' : c;
  }

}
