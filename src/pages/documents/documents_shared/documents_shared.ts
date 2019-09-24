import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import {GlobalVarsProvider} from "../../../providers/global-vars/global-vars";

import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';

import { DocumentsListView } from "../documents_list_view/documents_list_view";
import { DocumentsListInfo } from "../documents_list_info/documents_list_info";
import { DocumentsList } from "../documents_list/documents_list";
import { DocumentsConditions } from '../documents_conditions/documents_conditions';
import { DocumentsShare } from "../documents_share/documents_share";

import { config } from '../../../app.config';

@Component({
  selector: 'page-shared-documents',
  templateUrl: 'documents_shared.html',
  providers: [DocumentServiceProvider,NotificationsHelper,GlobalVarsProvider]
})

export class DocumentsShared {
  
  page = { view : DocumentsListView, info : DocumentsListInfo }

  public others_documents:any;
  public my_documents:any;
  public others_users:any;
  public my_users:any;
  public data:any;
  public params:any;
  public conditions:any;
  private org_name:any = '';

  public my_permissions:any = [];
  public othersUserKeys:any = [];
  public myUserKeys:any = [];
  public othersOrgKeys:any = [];
  private documents:any = [];
  private organisations:any = [];
  private shared_with_me_documents:any = [];
  private shared_with_others_documents:any = [];
  private selected_org:any;


  private reload:  boolean = false;
  private is_searched:  boolean = false;
  private all_shared_documents:  boolean;
  private have_more: boolean = false;
  private is_request:  boolean = false;

  private shared_with:  string  = 'me';
  private topbar:  String  = 'open';
  private search:  string  = '';
  private my_search:  string  = '';
  private other_search:  string  = '';

  private search_org_id: number;
  private current_page: number = 1;


  constructor(public navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              public authService: AuthServiceProvider,
              private alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public DocumentService: DocumentServiceProvider,
              public navParams: NavParams,
              public session: SessionHelper,
              public globalVars: GlobalVarsProvider) {

              this.documents = this.navParams.data.documents;
              this.my_permissions = this.navParams.data.permissions || [];
              this.conditions = this.navParams.data.conditions || [];
              this.search_org_id = this.navParams.data.org_id;
              this.org_name = this.navParams.data.org_name;

              this.params = {   cat_attrs :  this.navParams.data.cat_attrs ,
                                sub_cat_attrs : this.navParams.data.sub_cat_attrs,
                                shared_with : this.navParams.data.shared_with,
                                category : this.navParams.data.category || [],
                                conditions : this.conditions,
                                callback : 'shared',
                                subcategory : this.navParams.data.subcategory || [] }
              console.log(this.conditions);
              console.log(this.documents);
                             
              if(this.documents == undefined){
                this.init();
              } else {
                this.all_shared_documents = false;
                this.shared_with = this.navParams.data.shared_with;

              }
  }

  init(){

    this.Notifications.presentLoader();
    
    this.DocumentService.getShareDocumentCount()
    .then(data => {

      if(data.count > config.shared_documents_count ){
      
        this.all_shared_documents = false;
     
        this.DocumentService.getSharedDocumentOrgs(this.shared_with)
        .then(data => {
          this.Notifications.dismissLoader();
          this.selectOrg(data.organisations);
          this.organisations = data.organisations;
        });

      } else {  
      
        this.all_shared_documents = true;
        this.getDocuments();
      }

    });

  }

  permissions(doc, u){

    let alert = this.alertCtrl.create();
   
    alert.setTitle('Select Permissions');

    var permissions = this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by];
    var permission;
    var cindx = 0;
    var indx = 0;

    permissions.forEach(d => {
      
      if(doc.id == d.doc_id) {
        permission = d;
        indx = cindx;
      }

      cindx++;

    });

    var checked_values = {
      can_read : parseInt(permission.can_read) ? true : false,
      can_share : parseInt(permission.can_share) ? true : false,
      can_update : parseInt(permission.can_update) ? true : false,
      can_download : parseInt(permission.can_download) ? true : false,
      can_external_share : parseInt(permission.can_external_share) ? true : false,
      can_create_revison : false,
      can_valid_revision : false
    }

    alert.addInput({
      type: 'checkbox',
      label: 'View description and files',
      value: 'can_read' ,
      disabled : true,
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
      checked: false,
      disabled : true
    });

 
    alert.addInput({
      type: 'checkbox',
      label: 'Valide a revision',
      value: 'can_valid_revision' ,
      checked: false,
      disabled : true
    });

    //Next Version 
    

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log(data)
        let params = {data : data, shared_document : permission}
       
        console.log(data)

        if( data.indexOf('can_read') !== -1 ){
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_read'] = '1'
        } else {
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_read'] = '0'
        }
        
        if( data.indexOf('can_share') !== -1 ){
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_share'] = '1'
        } else {

          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_share'] = '0'
        }

        if( data.indexOf('can_update') !== -1 ){
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_update'] = '1'
        }else {
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_update'] = '0'
        }

        if( data.indexOf('can_download') !== -1 ){
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_download'] = '1'
        } else {
          this.data.shared_with_others.permissions[doc.shared_by_org][doc.shared_by][indx]['can_download'] = '0'
        }

        this.DocumentService.updateSharedDocumentsPermissions(params)
        .then(res => {
          
          

        });

      }
    });

    alert.present();

  }
  
  getDocuments(){
    this.othersUserKeys = [];
    this.myUserKeys = [];
    this.my_documents = [];
    this.others_documents = [];
    
    this.DocumentService.sharedDocuments()
    .then(data => {
        
        this.Notifications.dismissLoader();
        if(data.error == undefined){
          
          this.data = data;

          this.others_documents = data.shared_with_others.documents;
          this.my_documents = data.shared_with_me.documents;

          this.others_users = data.shared_with_others.users;
          this.my_users = data.shared_with_me.users;

          this.othersOrgKeys = Object.keys(data.shared_with_others.documents);
          this.myUserKeys = Object.keys(data.shared_with_me.documents);

          this.my_permissions = data.shared_with_me.permissions;

          this.reload = false;

        }  else {
         this.Notifications.presentToast('Please Request Again');
         this.reload = true;
        }
        
    });

  }

  getOrgUsers(org_id){

    if(this.others_documents[org_id])
      return Object.keys( this.others_documents[org_id] );
    
  }

  getOrgDocuments(id){

    this.Notifications.presentLoader();
    

    this.DocumentService.sharedDocuments(id,1)
    .then(data => {
        
        this.Notifications.dismissLoader();
        if(data.error == undefined){
          
          this.data = data;

          this.search_org_id = id;

          this.others_documents = data.shared_with_others.documents;
          this.my_documents = data.shared_with_me.documents;

          this.my_permissions = data.shared_with_me.permissions;
        
          this.others_users = data.shared_with_others.users;
          this.my_users = data.shared_with_me.users;

          this.myUserKeys = Object.keys(data.shared_with_me.documents);
          this.othersOrgKeys = Object.keys(data.shared_with_others.documents);


          if(this.shared_with == 'me'){
            
            this.selected_org  = data.shared_with_me.organisations[id];
            this.org_name  = data.shared_with_me.organisations[id].name;

          } else {
            
            this.selected_org  = data.shared_with_others.organisations[id];
            this.org_name  = data.shared_with_others.organisations[id].name;

          }

          this.reload = false;

        }  else {
         this.Notifications.presentToast('Please Request Again');
         this.reload = true;
        }
        
    });

  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){
      this.is_request = true;

      this.DocumentService.sharedDocuments(this.search_org_id, ++this.current_page, this.search)
      .then(res => {

          this.is_request = false;

          if( res.error == undefined ){
            if( res.shared_with_me.documents.length < config.per_page){
                this.have_more = false;
            }

            res.shared_with_me.documents.forEach(d=> {
              this.documents.push(d)
            });

            infiniteScroll.complete();
          } else {
            --this.current_page;
            this.doInfinite(infiniteScroll);
          }
          
      });

    }

  }

  replaceDocument(s){
    
    // if(this.search !== '') {
    //     this.search = '';
    //     this.getItems();
    // } else {
    if(s == 'me') {
      this.documents = this.my_documents;
      this.search = this.my_search;
    } else {
      this.documents = this.others_documents;
      this.search = this.other_search;
    }
    // }

    this.DocumentService.getSharedDocumentOrgs(this.shared_with)
    .then(data => {
      this.organisations = data.organisations;
    });
  }

  selectOrg(orgs){
    let alert = this.alertCtrl.create();
   
    alert.setTitle('Select Organisation');
    
    orgs.forEach(d=> {
      alert.addInput({
        type: 'radio',
        label: d.name,
        value: d.id ,
        checked: false
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
          if(data > 0){
            this.getOrgDocuments(data)
          }
      }
    });

    alert.present();
  }

  view(state, d ){
    console.log(d);
    console.log(this.my_permissions);
    
    if(this.shared_with == 'me') {
      let permissions = this.my_permissions[d.shared_by_org][d.shared_by];
      let permission;
      permissions.forEach(p=> {
        if(p.doc_id == d.id){
          permission = p;
        }
      });

      console.log(permission,'permission');

      if(!permission){
        this.Notifications.presentToast('Document permissions not found');
        return false
      }

      if( parseInt(permission.can_read) ){

        this.navCtrl.push(state, {
          id: d.id,
          org_id : d.org_id,
          permission : permission
        });

      } else {
        this.Notifications.presentToast('You do not have permission to read the document');
      }
    } else {
      this.navCtrl.push(state, {
        id: d.id
      });
    }

  }

  getItems(){

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.DocumentService.searchSharedDocuments(this.search.toLowerCase(), this.search_org_id, this.shared_with)
        .then(data => {

          this.is_searched = false;

          if(this.shared_with == 'me') {
            this.my_search = this.search;
            this.my_permissions = data.permissions;
            this.my_documents = data.documents;
            this.my_users = data.users;
            this.myUserKeys = Object.keys(data.documents);

          } else {
           
            this.other_search = this.search;
            this.othersOrgKeys = Object.keys(data.documents);
            this.others_documents = data.documents;
            this.others_users = data.users;
          }

        });
      },500)
    }

  }   

  searchSetting(){
    var handler = (data: any) => {
          this.search_org_id = data;
      }

    this.filters(handler);
  }

  applyConditions(){
    console.log(this.search_org_id)
    if(this.search_org_id){

      this.params.org_id = this.search_org_id;
      this.params.org_name = this.org_name;
      this.params.shared_with = this.shared_with;

      this.navCtrl.push(DocumentsConditions, this.params);

    } else {
       var handler = (data: any) => {
          this.params.org_id = data;
          this.params.org_name = this.org_name;
          this.params.shared_with = this.shared_with;
          this.navCtrl.push(DocumentsConditions, this.params);
      }

      this.filters(handler);
    }

   
  }

  filters(handler){
    
    let alert = this.alertCtrl.create();
   
    alert.setTitle('Select Organisation');

    Object.keys(this.data.shared_with_me.organisations).forEach(d=> {
      alert.addInput({
        type: 'radio',
        label: this.data.shared_with_me.organisations[d].name,
        value: d ,
        checked: false
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: handler
    });

    alert.present();

  }

  cancel(doc_id, user_id, org_id){

    let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to cancel the sharing of document?',
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
                var params = {
                    doc_id : doc_id,
                    user_id : user_id,
                    org_id : org_id
                  }
                this.Notifications.presentLoader();
                this.DocumentService.cancelSharedDocument(params)
                 .then(data => {
                  this.Notifications.dismissLoader();
                  this.Notifications.presentToast('Success');
                  this.getDocuments();
                }, err => {
                  this.Notifications.dismissLoader();
                });
            }
          }
        ]
      });
      alert.present();
  }

  reloadMe(){ 
    this.getDocuments();
  }


  presentActionSheet(p, d) {
      let options = [];

      if(this.shared_with == 'me') {
        let permissions = this.my_permissions[d.shared_by_org][d.shared_by];
        let permission;
        permissions.forEach(p=> {
          if(p.doc_id == d.id){
            permission = p;
          }
        });

        console.log(permission,'permission');

        if(!permission){
          this.Notifications.presentToast('Document permissions not found');
          return false
        }

        if( parseInt(permission.can_share) ){

             options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(p, d);
                      }
                  },{
                      text: 'View files',
                      handler: () => {
                        this.view(this.page.view, d);
                      }
                  },{
                      text: 'Share',
                      handler: () => {
                        this.searchUserPrompt(d,permission);
                      }
                  },{
                  text: 'Cancel',
                  role: 'cancel'
              }]);

        } else {
          
            options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(p, d);
                      }
                  },{
                      text: 'View files',
                      handler: () => {
                        this.view(this.page.view, d);
                      }
                  },{
                  text: 'Cancel',
                  role: 'cancel'
              }]);

        }
      } else {

          
          options = options.concat([{
                    text: 'Description',
                    handler: () => {
                      this.view(p, d);
                    }
                },{
                    text: 'View files',
                    handler: () => {
                      this.view(this.page.view, d);
                    }
                },{
                text: 'Cancel',
                role: 'cancel'
            }]);
      }

      let actionSheet = this.actionSheetCtrl.create({
          title: 'Choose one option',
          buttons: options
    });
    actionSheet.present();
  }

  actionSheetOthers(d, u = false ) {
      let options = [];
      if(!u){
        u = this.navParams.data.users[d.shared_by]
      }
      console.log(d);
      console.log(u)
      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(this.page.info, d);
                      }
                  },{
                      text: 'View files',
                      handler: () => {
                        this.view(this.page.view, d);
                      }
                  },{
                      text: 'Permissions',
                      handler: () => {
                        this.permissions(d, u);
                      }
                  },{
                      text: 'Remove sharing',
                      role: 'destructive',
                      handler: () => {
                        this.cancel(d.id, u, d.org_id);
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

  doRefresh(refresher) {
    setTimeout(() => {
      this.getDocuments();
      refresher.completes();
    }, 2000);
  }
  

  getUrl(u){
    var user = this.shared_with == 'me' ? this.my_users[u] : this.others_users[u];
    return config.api_url + 'documents/download?fileName=' + user.profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + user.org_id
  }

  searchUserPrompt(d,permissions) {

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
            console.log('userdata',data)
              this.share(d,data.username,permissions);
          }
        }
      ]
    });
    alert.present();
  }


  share(d, search, permissions) {

    this.navCtrl.push(DocumentsShare,{
                                        doc_id : d.id, 
                                        type : 'users', 
                                        search : search , 
                                        callback : 'shared',
                                        permissions : permissions
                                      });

  }

}
