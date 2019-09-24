import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Nav, ActionSheetController, AlertController } from 'ionic-angular';

import {GlobalVarsProvider} from "../../../providers/global-vars/global-vars";

import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';

import {DocumentsList} from "../documents_list/documents_list";


import { config } from '../../../app.config';
import { Users } from './users/users';


@Component({
  selector: 'page-share-documents',
  templateUrl: 'documents_share.html',
  providers: [DocumentServiceProvider,NotificationsHelper,GlobalVarsProvider]
})

export class DocumentsShare {
  
  private organisations:any;
  private config:any;
  private users:any;
  private permissions:any = {};
  private selected_users:boolean[];
  private reload:  boolean = false;
  private send_notification:  boolean = false;

  constructor(public navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              public authService: AuthServiceProvider,
              private alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public DocumentService: DocumentServiceProvider,
              public navParams: NavParams,
              public session: SessionHelper,
              public globalVars: GlobalVarsProvider) {
    this.organisations = {};
    this.users = [];
    this.config = config;
    this.getUsers();

  }

  getUsers(){
    this.Notifications.presentLoader();
   
    this.DocumentService.searchUsers(this.navParams.get('search'))
     .then(data => {

        this.Notifications.dismissLoader();

        if(data.error == undefined){
          this.organisations = data.orgs;
          this.users = data.users;
          this.selected_users = new Array(this.users.length);
          this.reload = false;
        }  else {
         this.Notifications.presentToast('Please Request Again');
         this.reload = true;
        }
        

    });
  }

  reloadMe(){ 
    this.getUsers();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getUsers();
      refresher.complete();
    }, 2000);
  }
  
  getUrl(user){
    return this.config.api_url + 'documents/download?fileName=' + user.profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + user.org_id
  }


  setPermissions(i){
    if(this.selected_users[i]){
     
      this.Notifications.presentLoader();
     
      this.DocumentService.getSharedDocument( { user_id : this.users[i].user_id , org_id : this.users[i].org_id , doc_id : this.navParams.get('doc_id') }  )
      .then(data => {

          this.Notifications.dismissLoader();

          if(data.error == undefined){

            this.reload = false;

            let alert = this.alertCtrl.create();
       
            alert.setTitle('Select Permissions');

            var checked_values = {
              can_read : true,
              can_share : false,
              can_update : false,
              can_download : false,
              can_external_share : false,
              can_create_revison : false,
              can_valid_revision : false
            }

            if(data.result.status){

              checked_values.can_read = parseInt(data.result.shared_document.can_read) ? true : false;
              checked_values.can_share = parseInt(data.result.shared_document.can_share) ? true : false;
              checked_values.can_update = parseInt(data.result.shared_document.can_update) ? true : false;
              checked_values.can_external_share = parseInt(data.result.shared_document.can_download) ? true : false;
              checked_values.can_download = parseInt(data.result.shared_document.can_download) ? true : false;
            
              console.log(data.result);

              if (data.result.shared_document.shared_with_me) { 

                 if(this.navParams.data.permissions){

                    let permissions = this.navParams.data.permissions;

                    if(  parseInt(permissions.can_read) ) {
                      alert.addInput({
                        type: 'checkbox',
                        label: 'View description and files',
                        disabled : true,
                        value: 'can_read' ,
                        checked: checked_values.can_read
                      });
                    }

                    if( parseInt(permissions.can_share) ){
                      alert.addInput({
                        type: 'checkbox',
                        label: 'Share description and files',
                        value: 'can_share' ,
                        checked: checked_values.can_share

                      });
                    }

                    if( parseInt(permissions.can_update) ){
                      alert.addInput({
                        type: 'checkbox',
                        label: 'Update description and files',
                        value: 'can_update' ,
                        checked: checked_values.can_update
                      });
                    }

                    if( parseInt(permissions.can_download) ){
                      alert.addInput({
                        type: 'checkbox',
                        label: 'Download attached files',
                        value: 'can_download' ,
                        checked: checked_values.can_download,
                        handler: (data) =>  { 
                          alert.data.inputs.forEach( (input,ind) => {
                            if( input.value == "can_external_share" ){
                              alert.data.inputs[ind].disabled = !data.checked
                            }
                          })
                          
                        }
                      });
                    }

                    if( parseInt(permissions.can_external_share) ){
                      alert.addInput({
                        type: 'checkbox',
                        label: 'External share',
                        value: 'can_external_share' ,
                        checked: checked_values.can_external_share,
                        disabled : !checked_values.can_download
                      });
                    }

                     //Next Version 

                    alert.addInput({
                      type: 'checkbox',
                      label: 'Create a Revision',
                      value: 'can_create_revison' ,
                      checked: checked_values.can_create_revison,
                      disabled : true
                    });

                 
                    alert.addInput({
                      type: 'checkbox',
                      label: 'Valide a revision',
                      value: 'can_valid_revision' ,
                      checked: checked_values.can_create_revison,
                      disabled : true
                    });


                  } else {
                      alert.addInput({
                        type: 'checkbox',
                        label: 'View description and files',
                        disabled : true,
                        value: 'can_read' ,
                        checked: checked_values.can_read
                      });

                      alert.addInput({
                        type: 'checkbox',
                        label: 'Update description and files',
                        value: 'can_update' ,
                        checked: checked_values.can_update
                      });

                      alert.addInput({
                        type: 'checkbox',
                        label: 'Download attached files',
                        value: 'can_download' ,
                        checked: checked_values.can_download,
                        handler: (data) =>  { 
                          alert.data.inputs.forEach( (input,ind) => {
                            if( input.value == "can_external_share" ){
                              alert.data.inputs[ind].disabled = !data.checked
                            }
                          })
                        }
                      });
                   
                      alert.addInput({
                        type: 'checkbox',
                        label: 'Share description and files',
                        value: 'can_share' ,
                        checked: checked_values.can_share
                      });
                   
                      alert.addInput({
                        type: 'checkbox',
                        label: 'External share',
                        value: 'can_external_share' ,
                        checked: checked_values.can_external_share,
                        disabled : !checked_values.can_download
                      });
                      
                      //Next Version 

                      alert.addInput({
                        type: 'checkbox',
                        label: 'Create a Revision',
                        value: 'can_create_revison' ,
                        checked: checked_values.can_create_revison,
                        disabled : true
                      });

                   
                      alert.addInput({
                        type: 'checkbox',
                        label: 'Valide a revision',
                        value: 'can_valid_revision' ,
                        checked: checked_values.can_valid_revision,
                        disabled : true
                      });
                  }

                  alert.addButton({
                      text: 'Cancel',
                      role: 'cancel',
                      handler: data => {
                         this.selected_users[i] = false;
                      }
                    });

                    alert.addButton({
                      text: 'Ok',
                      handler: (data: any) => {
                        this.permissions[this.users[i].user_id] = data;
                      }
                    });

                    alert.present();

              } else {

                  var checkboxes = [
                                      { title : 'View description and files' , disabled : true, value: 'can_read', checked: checked_values.can_read },
                                      { title : 'Update description and files' , disabled : true, value: 'can_update', checked: checked_values.can_update },
                                      { title : 'Download attached files' , disabled : true, value: 'can_download', checked: checked_values.can_download },
                                      { title : 'Share description and files' , disabled : true, value: 'can_share', checked: checked_values.can_share },
                                      { title : 'External share' , disabled : true, value: 'can_external_share', checked: checked_values.can_external_share },
                                      { title : 'Create a Revision' , disabled : true, value: 'can_create_revison', checked: false },
                                      { title : 'Valide a revision' , disabled : true, value: 'can_valid_revision', checked: false },
                                  ]

                  let alertNew = this.alertCtrl.create();

                  alertNew.setTitle('Warning');
                  alertNew.setMessage('Document is already shared by ' + data.result.shared_document.shared_by.name + ' with following permissions ');

                  checkboxes.forEach( (check) => {
                      alertNew.addInput({
                        type: 'checkbox',
                        label: check.title,
                        disabled : check.disabled,
                        value: check.value ,
                        checked: check.checked
                      });
                   });
                                   
                  alertNew.addButton({
                    text: 'Ok',
                    role: 'ok',
                    handler: data => {
                       this.selected_users[i] = false;
                    }
                  });


                  alertNew.present();

              }



            } else {
              

               if(this.navParams.data.permissions){

                  let permissions = this.navParams.data.permissions;

                  if(  parseInt(permissions.can_read) ) {
                    alert.addInput({
                      type: 'checkbox',
                      label: 'View description and files',
                      disabled : true,
                      value: 'can_read' ,
                      checked: checked_values.can_read
                    });
                  }

                  if( parseInt(permissions.can_share) ){
                    alert.addInput({
                      type: 'checkbox',
                      label: 'Share description and files',
                      value: 'can_share' ,
                      checked: checked_values.can_share

                    });
                  }

                  if( parseInt(permissions.can_update) ){
                    alert.addInput({
                      type: 'checkbox',
                      label: 'Update description and files',
                      value: 'can_update' ,
                      checked: checked_values.can_update
                    });
                  }

                  if( parseInt(permissions.can_download) ){
                    alert.addInput({
                      type: 'checkbox',
                      label: 'Download attached files',
                      value: 'can_download' ,
                      checked: checked_values.can_download,
                      handler: (data) =>  { 
                        alert.data.inputs.forEach( (input,ind) => {
                          if( input.value == "can_external_share" ){
                            alert.data.inputs[ind].disabled = !data.checked
                          }
                        })
                        
                      }
                    });
                  }

                  if( parseInt(permissions.can_external_share) ){
                    alert.addInput({
                      type: 'checkbox',
                      label: 'External share',
                      value: 'can_external_share' ,
                      checked: checked_values.can_external_share,
                      disabled : !checked_values.can_download
                    });
                  }

                   //Next Version 

                  alert.addInput({
                    type: 'checkbox',
                    label: 'Create a Revision',
                    value: 'can_create_revison' ,
                    checked: checked_values.can_create_revison,
                    disabled : true
                  });

               
                  alert.addInput({
                    type: 'checkbox',
                    label: 'Valide a revision',
                    value: 'can_valid_revision' ,
                    checked: checked_values.can_create_revison,
                    disabled : true
                  });


                } else {
                    alert.addInput({
                      type: 'checkbox',
                      label: 'View description and files',
                      disabled : true,
                      value: 'can_read' ,
                      checked: checked_values.can_read
                    });

                    alert.addInput({
                      type: 'checkbox',
                      label: 'Update description and files',
                      value: 'can_update' ,
                      checked: checked_values.can_update
                    });

                    alert.addInput({
                      type: 'checkbox',
                      label: 'Download attached files',
                      value: 'can_download' ,
                      checked: checked_values.can_download,
                      handler: (data) =>  { 
                        alert.data.inputs.forEach( (input,ind) => {
                          if( input.value == "can_external_share" ){
                            alert.data.inputs[ind].disabled = !data.checked
                          }
                        })
                      }
                    });
                 
                    alert.addInput({
                      type: 'checkbox',
                      label: 'Share description and files',
                      value: 'can_share' ,
                      checked: checked_values.can_share
                    });
                 
                    alert.addInput({
                      type: 'checkbox',
                      label: 'External share',
                      value: 'can_external_share' ,
                      checked: checked_values.can_external_share,
                      disabled : !checked_values.can_download
                    });
                    
                    //Next Version 

                    alert.addInput({
                      type: 'checkbox',
                      label: 'Create a Revision',
                      value: 'can_create_revison' ,
                      checked: checked_values.can_create_revison,
                      disabled : true
                    });

                 
                    alert.addInput({
                      type: 'checkbox',
                      label: 'Valide a revision',
                      value: 'can_valid_revision' ,
                      checked: checked_values.can_valid_revision,
                      disabled : true
                    });
                }
                
              alert.addButton({
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                     this.selected_users[i] = false;
                  }
                });

                alert.addButton({
                  text: 'Ok',
                  handler: (data: any) => {
                    this.permissions[this.users[i].user_id] = data;
                  }
                });

                alert.present();
            }
          }
          else {
               this.Notifications.presentToast('Please Request Again');
               this.reload = true;
          }
          

      });

      
    }
  }

  share(){
 console.log("call method")
    var users = []
    this.selected_users.forEach( (bool,ind) => {
      users.push(this.users[ind])
    })

    var owner;

    if(this.navParams.data.permissions){
      owner = { id : this.navParams.data.permissions.id, 
                             owner_org_id : this.navParams.data.permissions.owner_org_id ,
                             owner_user_id :  this.navParams.data.permissions.owner_user_id
                          } ;
    } else {
      owner = {}
    }
    
    this.Notifications.presentLoader();
    
    this.DocumentService.shareDocument({ "doc_id" : this.navParams.get('doc_id') , "users" :  users , "permissions" : this.permissions , "owner" : owner, "send_notification" : this.send_notification } ).then(data => {

      this.Notifications.dismissLoader();
      let alert = this.alertCtrl.create({
        title: 'Shared Successfull',
        subTitle: 'Document is shared successfully with the selected users'
      });

      alert.addButton({
        text: 'Ok',
        handler: (data: any) => {
           this.navCtrl.push(DocumentsList)
        }
      });

      alert.present();

    });
  }

}
