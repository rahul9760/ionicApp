import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';

import { NotificationServiceProvider } from '../../providers/notifications-service/notifications-service';
import {DocumentsListView} from "../documents/documents_list_view/documents_list_view";
import {DocumentsListInfo} from "../documents/documents_list_info/documents_list_info";
import { AgendaDescription } from '../agenda/show/show';
import { SearchUsers } from '../search_users/list/list';

import { NotificationsHelper } from '../../helpers/notifications.helper';

import { config } from '../../app.config';
import { SessionHelper } from '../../helpers/session.helper';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})

export class Notifications {
    
    page = { view : DocumentsListView, info : DocumentsListInfo }

    notifications:any = []
    current_page: number = 1;
    have_more: boolean = false;
    search: String = '';
    is_request:  boolean = false;
    is_searched:  boolean = false;
    is_hold:  boolean = false;
    reload:  boolean = false;
    selected_count: number = 0;

    constructor(public navCtrl: NavController,
                public actionSheetCtrl: ActionSheetController,
                public Notification: NotificationsHelper,
                public session: SessionHelper,
                public NotificationService: NotificationServiceProvider
                ) {
        this.getNotifications()
    }
    

  getNotifications(){
    this.resetVaribles();
    this.Notification.presentLoader();
    this.NotificationService.getNotifications(1,this.search)
    .then(data => {
      this.Notification.dismissLoader();

      if( data.error == undefined ){
        this.notifications = data.notifications;
        
        if(this.notifications.length == config.per_page){
            this.have_more = true;
        }

      } else {
       
       this.Notification.presentToast('Please Request Again');
       this.reload = true;
      
      }

    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getNotifications();
      refresher.complete();
    }, 2000);
  }

  avatar(notification){
    return config.api_url + 'documents/download?fileName=' + notification.by_user_profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + notification.by_org_id
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;

      this.NotificationService.getNotifications(++this.current_page,this.search)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.notifications.length < config.per_page){
              this.have_more = false;
          }

          res.notifications.forEach(d=> {
            this.notifications.push(d)
          });

          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
  }

  open(notification, index){
    
    if( this.is_hold ){
     
      this.notifications[index].is_selected = this.notifications[index].is_selected ? !this.notifications[index].is_selected : true;
      this.notifications[index].is_selected ? ++this.selected_count : --this.selected_count
      
      if( this.selected_count <= 0 ) {
        this.is_hold = false;
      }

    } else {
    
      this.Notification.presentLoader();
      this.NotificationService.openNotification(notification.id)
      .then(res => {
        this.Notification.dismissLoader();
        this.notifications[index].is_read = "1";
        switch (notification.request_type) {
            case 'shared_documents':
                this.openDocument( DocumentsListInfo , res.request_data )
                break;
            case 'agenda':
                this.navCtrl.push( AgendaDescription , res.request_data);
                break;
            case 'requests':
                this.navCtrl.push( SearchUsers, { request: res.slug } );
                break;
            
            default:
        }

      });

    }

  }

  openDocument(state, shared ){

    this.navCtrl.push(state, {
      id: shared.document.id,
      org_id : shared.document.org_id,
      permission : {
                      can_read : shared.can_read,
                      can_download : shared.can_download,
                      can_external_share : shared.can_external_share,
                      can_share : shared.can_share,
                      can_update : shared.can_update
                  }
    });

  }

  pressEvent(event, notification, i){
    this.is_hold = true;
    this.notifications[i].is_selected = true;
  }

  select(){
     this.is_hold = true;
  }

  action(){
      let options = [];


      options = options.concat([{
                      text: 'Mark as read',
                      handler: () => {
                        this.mark_as(1); // Mark as read
                      }
                  },{
                      text: 'Mark as unread',
                      handler: () => {
                        this.mark_as(0); // Mark as unread
                      }
                  }, {
                     text: 'Delete',
                     role: 'destructive',
                     handler: () => {
                        this.delete();
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

  mark_as(value){

    var notification_ids = this.getSelectNotifications();
    if( notification_ids ){
      this.Notification.presentLoader();
      this.NotificationService.markAsValueNotification( notification_ids , value )
      .then(res => {
        this.Notification.dismissLoader();
        this.getNotifications()
      }); 
    } else {
      this.Notification.presentToast('Please select at least one notification');
    }
  }

  delete(){
    var notification_ids = this.getSelectNotifications();
    if( notification_ids ){
      this.Notification.presentLoader();
      this.NotificationService.deleteNotifications( notification_ids )
      .then(res => {
        this.Notification.dismissLoader();
        this.getNotifications()
      });
    } else {
      this.Notification.presentToast('Please select at least one notification');
    }
  }

  getSelectNotifications(){
    
    let notification_ids = [];
   
    this.notifications.forEach(notification=> {
      if(notification.is_selected)
        notification_ids.push(notification.id)
      
    });

    return notification_ids.length > 0 ? notification_ids.join(',') : false
  }

  resetVaribles(){
    this.notifications = [];
    this.current_page = 1;
    this.have_more = false;
    this.search = '';
    this.is_request = false;
    this.is_searched = false;
    this.is_hold = false;
    this.reload = false;
    this.selected_count = 0;
  }

}