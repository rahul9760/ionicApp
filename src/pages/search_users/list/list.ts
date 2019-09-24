import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { RequestsServiceProvider } from '../../../providers/requests-service/requests-service';
import { DocumentServiceProvider } from '../../../providers/document-service/document-service';

import { config } from '../../../app.config';
import { SessionHelper } from '../../../helpers/session.helper';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';

@Component({
  selector: 'page-list-requests',
  templateUrl: 'list.html',
  providers: [RequestsServiceProvider, DocumentServiceProvider]
})

export class SearchUsers {

    users:any = []
    sent:any = []
    recieved:any = []
    accepted:any = []
    backup:any
    relations:any
    organisations:any
    sent_requests:any = {}
    current_page: number = 1;
    current_user: any;
    have_more: boolean = false;
    search: String = '';
    request: String;
    is_request:  boolean = false;
    is_searched:  boolean;
    reload:  boolean = false;

    constructor(public navCtrl: NavController,
                public params: NavParams,
                public Notification: NotificationsHelper,
                public alertCtrl: AlertController,
                public RequestService: RequestsServiceProvider,
                public DocumentService: DocumentServiceProvider,
                public session: SessionHelper,
                public http:Http
                ) {
        this.current_user = this.session.getUser()
        this.request = this.params.get('request') ? this.params.get('request') : 'recieved';
        this.getRequests()
    }
    

  getRequests(){
    this.Notification.presentLoader();
    this.RequestService.getRequests(this.current_page)
    .then(response => {
      this.Notification.dismissLoader();
      this.sent = response.data.sent;
      this.recieved = response.data.recieved;
      this.accepted = response.data.accepted;
      
    });
  }

  doRefresh(refresher: { complete: () => void; }) {
    setTimeout(() => {
      this.getRequests();
      refresher.complete();
    }, 2000);
  }

  avatar(user){
    
    if(user!=false){
      return config.api_url + 'documents/download?fileName=' + user.profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + user.org_id
    }
    
  }

  getItems(ev: any) {
    this.current_page = 1;
    this.users = []

    if(!this.is_searched && this.search !== ''){
      this.is_searched = true;
      setTimeout( ()=>{

        this.RequestService.searchNewUsers(this.search.toLowerCase())
        .then(response => {

          if( response.data.search_result.users.length < config.per_page){
            this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.users =  response.data.search_result.users;

          this.users.forEach((d: any,index: string | number)=> {
            this.sent_requests[index] = false
          }); 

          this.organisations = response.data.search_result.orgs;
          this.backup = response.data.search_result;
         
          this.relations = response.data.relations;

          this.is_searched = false;
        });

      },500)
    }
  }

  sendRequest(user: any, index: string | number){
      
      this.Notification.presentLoader();
      this.RequestService.sendRequest(user).then( (data) =>{
        this.Notification.dismissLoader();
        if(data.status){
           this.getRequests()
           this.sent_requests[index] = true;
        }

        this.Notification.presentToast(data.message);
      })

  }

  getStatus(status: any){
    let title = '';
   
    switch(status){
      case '1':
        title = 'Accepted'
      break;
      
      case '0':
        title = 'Pending'
      break;
      
      case '-1':
        title = 'Rejected'
      break;

    }

    return title
  }

  getStatusColor(status: any){
    let color = '';
   
    switch(status){
      case '1':
        color = 'primary'
      break;
      
      case '0':
        color = 'pending'
      break;
      
      case '-1':
        color = 'danger'
      break;

    }

    return color
  }
  
  acceptRequest(request: { id: any; }){
    this.RequestService.acceptRequest(request.id)
    .then(response => {
        this.Notification.presentToast(response.message);
        this.getRequests()
    });
  }

  rejectRequest(request: { id: any; }){
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to reject the request?',
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
                this.Notification.presentLoader();
                this.RequestService.rejectRequest(request.id)
                .then(response => {
                    this.Notification.dismissLoader();
                    this.Notification.presentToast(response.message);
                    this.getRequests()
                });
            }
          }
        ]
      });
      alert.present();

  }


  resetVaribles(){

  }

  getRequestUser(request: { from_org_id: any; from_user_id: any; from_user: any; with_user: any; with_user_id: any; }){
    return  this.current_user.user_org_id == request.from_org_id ? 
            this.current_user.user_id !== request.from_user_id ? request.from_user :  request.with_user  : 
            this.current_user.user_id !== request.with_user_id ? request.with_user_id :  request.from_user
  }

  buttonClick(){
    this.search = '';
    console.log("Request :"+this.request);
    console.log("Current Page :"+this.current_page);

    switch(this.request){
    
      case 'accepted':
        this.Notification.presentLoader();
        this.RequestService.getAcceptedRequests(this.current_page)
        .then(response => {
          this.Notification.dismissLoader();
          this.accepted = response.data.accepted;
        });
      break;
    
      case 'sent':
        this.Notification.presentLoader();
        this.RequestService.getSentRequests(this.current_page)
        .then(response => {
          console.log("Response to getSentRequests :"+JSON.stringify(response));
          this.Notification.dismissLoader();
          this.sent = response.data.sent;
          console.log("response:",response)
        });
      break;
    
      case 'recieved':
        this.Notification.presentLoader();
        this.RequestService.getRecievedRequests(this.current_page)
        .then(response => {
          this.Notification.dismissLoader();
          this.recieved = response.data.recieved;
        });
      break;
    
    }
  }

  presentActionSheet(){
  
  }

  user_resend_request(user: { user_id: string; org_id: string; }){
    let request = this.relations[user.user_id+'_'+ user.org_id];

    if( request ){
      this.resend(request)
    } 
  }

  resend(request: { id: any; }){
    this.Notification.presentLoader();
    this.RequestService.resendRequest(request.id)
    .then(response => {
        this.Notification.dismissLoader();
        this.Notification.presentToast(response.message);
    });
  }
  
  requestType(user: { user_id: string; org_id: string; }){
    let relation = this.relations[user.user_id+'_'+ user.org_id ];
    let status = 'new'

    if( relation ){
      
      if(relation.status == -1) {
        status = 'rejected'
      } else if(relation.status == 1) {
        status = 'accepted'
      } else {
        status = 'pending'
      }
      
    } 

    return status
  }

}