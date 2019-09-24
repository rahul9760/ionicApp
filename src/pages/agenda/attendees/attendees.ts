import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Nav, ActionSheetController, AlertController } from 'ionic-angular';

import {GlobalVarsProvider} from "../../../providers/global-vars/global-vars";

import { DocumentServiceProvider } from '../../../providers/document-service/document-service';

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';

import { config } from '../../../app.config';


@Component({
  selector: 'page-select-attendees',
  templateUrl: 'attendees.html',
  providers: [DocumentServiceProvider,NotificationsHelper,GlobalVarsProvider]
})

export class Attendees {
  
  private users:any;
  private selected_users:any = {};
  private reload: boolean = false;

  constructor(public navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public DocumentService: DocumentServiceProvider,
              public navParams: NavParams,
              public session: SessionHelper,
              public globalVars: GlobalVarsProvider) {
    this.users = [];
    this.getUsers();

  }

  getUsers(){
    this.Notifications.presentLoader();
   
    this.DocumentService.searchUsers(this.navParams.get('search'))
     .then(data => {

        this.Notifications.dismissLoader();

        if(data.error == undefined){
          this.users = data.users;
          this.reload = false;
        }  else {
          this.Notifications.presentToast('Please Request Again');
          this.reload = true;
        }

    });
  }

  
  getUrl(user){
    return config.api_url + 'documents/download?fileName=' + user.profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + user.org_id
  }

  setSelected(i){
    console.log(i)
  }


}
