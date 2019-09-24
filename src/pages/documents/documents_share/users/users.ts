import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Nav, ActionSheetController, AlertController } from 'ionic-angular';

import {GlobalVarsProvider} from "../../../../providers/global-vars/global-vars";

import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { AuthServiceProvider } from '../../../../providers/auth-service/auth-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { SessionHelper } from '../../../../helpers/session.helper';

import { config } from '../../../../app.config';

import { DocumentsList} from '../../documents_list/documents_list';


@Component({
  selector: 'page-users-documents',
  templateUrl: 'users.html',
  providers: [DocumentServiceProvider,NotificationsHelper,GlobalVarsProvider]
})

export class Users {
  public users:any;
  private config:any;
  private selected_users:boolean[];

  constructor(public navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              public authService: AuthServiceProvider,
              private alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public DocumentService: DocumentServiceProvider,
              public navParams: NavParams,
              public session: SessionHelper,
              public globalVars: GlobalVarsProvider) {
    this.users = [];

    this.config = config;
    this.Notifications.presentLoader();
    
     this.authService.getUserByOrg( this.navParams.get('org_id') )
     .then(data => {
        this.Notifications.dismissLoader();
        this.users = data.users;
        this.selected_users = new Array(this.users.length);
      });
  }


  getUrl(user){
    console.log(user.profile_pic);
    return this.config.api_url + 'documents/download?fileName=' + user.profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic' + '&org_id=' + this.navParams.get('org_id')
  }

  share(){
    console.log(this.selected_users);
    var users = []
    this.selected_users.forEach( (bool,ind) => {
      users.push(this.users[ind])
    })

    this.DocumentService.shareDocument({ "doc_id" : this.navParams.get('doc_id') , "users" :  users } ).then(data => {
      this.navCtrl.push(DocumentsList)
      this.Notifications.presentToast('Shared Successfull');
    });
  }

}
