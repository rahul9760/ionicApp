import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, Events } from 'ionic-angular';
import { TasksServiceProvider } from '../../../providers/tasks-service/tasks-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import { config } from '../../../app.config';
import { Calendar } from '@ionic-native/calendar';
import { Attendees } from '../attendees/attendees';

@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: [TasksServiceProvider,Calendar]
})

export class AgendaCreate {
  new_task:any = { 
                   name: '',
                   description:'',
                   expecting_date : '',
                   priority : 'none', 
                   status : 'done' , 
                   origin : 'manual' , 
                   recurrence : false , 
                   repeat_type : 'day' , 
                   repeat_every : '1' , 
                   end : 'never' , 
                   end_on : new Date(), 
                   end_after : 0, 
                   repeat_on : 0, 
                   attendees : [], 
                   tags : [], 
                   durations : 0,
                   duration_type : 'minutes',
                   days : 0,
                   hours : 0,
                   minutes : 0
                  }
  current_user:any = []
  selected_users:any = {}
  show_form: boolean = false
  users:any = []
  tags:any = []
  public color: String = '#488aff'
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"

  constructor(public navCtrl: NavController,
              public params: NavParams, 
              public TasksService: TasksServiceProvider, 
              public session: SessionHelper, 
              public alertCtrl: AlertController, 
              private calendar: Calendar,
              private events: Events,
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.getData();
              this.current_user = this.session.getUser();
              this.new_task.repeat_on = (new Date()).getDay();
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

  getData(){
    this.Notification.presentLoader()
    this.TasksService.getAttendees()
    .then(data => {
      this.Notification.dismissLoader()
      
      if (Array.isArray(data.attendees) ){
        this.users = data.attendees;
      }

      if (Array.isArray(data.tags) ){
        this.tags = data.tags;
      }

    });
  }

  onCalender($event){
    this.new_task.expecting_date = $event._d;
  }
  
  save(){
    
    if( this.validations() ) {
      var end_date = this.manipulateDate();
      
      console.log("this.new_task.name :"+this.new_task.name+" && this.new_task.description :"+this.new_task.description+" && this.new_task.expecting_date :"+this.new_task.expecting_date+" && end_date :"+end_date);

      this.calendar.createEvent(this.new_task.name, 
                                'India', 
                                this.new_task.description, 
                                this.new_task.expecting_date, 
                                end_date).then(
        (msg) => {
          console.log("createEvent Response :"+JSON.stringify(msg));
          this.Notification.presentToast("Event is successfully created in your calendar"); 
        },
        (err) => { 
          console.log("createEvent Error :"+JSON.stringify(err));
          this.Notification.presentToast("Error in saving event to calendar");   
        }
      );

      this.TasksService.save(this.new_task)
      .then(data => {
        this.navCtrl.pop()
      });
    } else {
      this.Notification.presentToast("Please fill the required fields"); 
    }
  }

  updateDay(day) {
    this.new_task.repeat_on = day;
  } 

  range(start, count) {
    return Array.apply(0, Array(count))
      .map(function (element, index) { 
        return index + start;  
    });
  }

  manipulateDate(){
    var end_date = new Date( this.new_task.expecting_date );
    end_date.setHours( this.new_task.expecting_date.getHours() + parseInt(this.new_task.hours) );
    end_date.setMinutes( this.new_task.expecting_date.getMinutes() + parseInt(this.new_task.minutes) );
    this.new_task.durations = parseFloat(this.new_task.hours + '.' + this.new_task.minutes);
    return end_date;
  }

  validations(){
    return this.new_task.expecting_date !== '' && 
           this.new_task.name !== '' &&
           this.new_task.description !== '';
  }

  searchUsers() {
    let alert = this.alertCtrl.create({
      title: 'Search',
      message: 'Search the user by firstname or lastname to share your document.',
      inputs: [
        {
          name: 'username',
          placeholder: 'Fill in firstname or lastname'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Search',
          handler: data => {
            
            this.Notification.presentLoader()
            
            this.TasksService.searchAttendees(data.username)
             .then(data => {
              this.Notification.dismissLoader()

                if(data.error == undefined){
                  this.show_form = true
                  this.users = data.attendees;
                }  else {
                  this.Notification.presentToast('Please Request Again');
                }

            });

          }
        
        }
      ]
    });
    alert.present();
  }

  select(){
    this.show_form = false
    this.new_task.attendees = []
    
    Object.keys(this.selected_users).forEach(uid => {
      if(this.selected_users[uid]){
        this.new_task.attendees.push(uid)
      }
    });

  }
  
}
