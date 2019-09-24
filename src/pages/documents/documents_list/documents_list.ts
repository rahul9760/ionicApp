import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Nav, ActionSheetController, AlertController, PopoverController } from 'ionic-angular';
import {DocumentsListView} from "../documents_list_view/documents_list_view";
import {DocumentsListInfo} from "../documents_list_info/documents_list_info";
import {DocumentsShare} from "../documents_share/documents_share";
import {DocumentsShared} from "../documents_shared/documents_shared";
import {GlobalVarsProvider} from "../../../providers/global-vars/global-vars";
import {Screen1} from "../documents_create/screen1/screen1";
import { Dashboard } from '../../dashboard/dashboard';

import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { DocumentsConditions } from '../documents_conditions/documents_conditions';
import { NotificationsHelper } from '../../../helpers/notifications.helper';

import { config } from '../../../app.config';


@Component({
  selector: 'page-list-documents',
  templateUrl: 'documents_list.html',
  providers: [DocumentServiceProvider,NotificationsHelper,GlobalVarsProvider]
})

export class DocumentsList {

  @ViewChild(Navbar) navBar: Navbar;

  page = { view : DocumentsListView, info : DocumentsListInfo, create : Screen1};
  documents: any;
  params: any;
  allDocuments: any;
  conditions: any;
  documentConditions = DocumentsConditions;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request: boolean = false;
  is_searched: boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public popoverCtrl: PopoverController,
              public DocumentService: DocumentServiceProvider,
              public navParams: NavParams,
              public globalVars: GlobalVarsProvider) {

  }

  ngOnInit(){
    this.documents = this.navParams.data.documents;
    this.conditions = this.navParams.data.conditions || [];
    this.params = {   cat_attrs :  this.navParams.data.cat_attrs,
                      sub_cat_attrs : this.navParams.data.sub_cat_attrs,
                      category : this.navParams.data.category || [],
                      conditions : this.conditions,
                      callback : 'list',
                      subcategory : this.navParams.data.subcategory || [] };

    if(this.documents == undefined){
      this.getDocuments();
    }
  }

  reloadMe(){ 
    this.getDocuments();
  }


  doRefresh(refresher) {
    setTimeout(() => {
      this.getDocuments();
      refresher.complete();
    }, 2000);
  }


  getDocuments(){
    this.Notifications.presentLoader();
    this.DocumentService.getDocuments(1,this.search)
    .then(data => {
      this.Notifications.dismissLoader();

      if( data.error == undefined ){
        this.documents = data.documents;
        this.reload = false;

        this.params = { cat_attrs :  data.cat_attrs ,
                        sub_cat_attrs : data.sub_cat_attrs,
                        category : [],
                        conditions : this.conditions,
                        callback : 'list',
                        subcategory : [] }

        if(this.documents.length == config.per_page){
            this.have_more = true;
        }

        this.allDocuments = this.documents;
      } else {
        this.Notifications.presentToast('Please Request Again');
        this.reload = true;
      }

    });
  }

  view(comp,id,i, org_id){
    this.navCtrl.push(comp, {
      id: id,
      org_id: org_id
    });

    var p = 0;
    this.documents.forEach(d=> {
      this.documents[p].opened = false;
      p++;
    });

    this.documents[i].opened = true;

    this.DocumentService.updateRecent(id).then(data => {
      
    });

 
  }

  delete(id,i){

      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this document?',
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
                this.DocumentService.delete(id)
                .then(data => {
                  if(data.status){
                     this.documents.splice(i, 1);
                     this.Notifications.presentToast('Deleted Successfully');
                  } else {
                     this.Notifications.presentToast(data.message);
                  }
                });
            }
          }
        ]
      });
      alert.present();

  }

  getItems(ev: any) {
   
    this.documents = this.allDocuments;

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.DocumentService.searchDocuments(this.search.toLowerCase())
        .then(data => {

          this.is_searched = false;
          if(data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.documents = data;
          this.allDocuments = this.documents;
        });
      },500)
    }
  }

  doInfinite(infiniteScroll) {
    if(!this.is_request){
      this.is_request = true;
      let doc_ids = []
      this.documents.forEach(d=> {
          doc_ids.push(d.id);
      });

      this.DocumentService.getDocuments(++this.current_page,this.search,doc_ids.join(','))
      .then(res => {
        this.is_request = false;
        if( res.error == undefined ){
          if(res.documents.length < config.per_page){
              this.have_more = false;
          }

          res.documents.forEach(d=> {
            this.documents.push(d)
          });

          this.allDocuments = this.documents;
          infiniteScroll.complete();
        } else {
          --this.current_page;
          this.doInfinite(infiniteScroll);
        }
      });
    }
  }

  create(){
    this.navCtrl.push(this.page.create);
  }

  share(d = 0, type = 'documents', search) {
    this.navCtrl.push(DocumentsShare,{doc_id : d, type : type, search : search});
  }

  shared() {
    this.navCtrl.push(DocumentsShared);
  }

  back(){
    this.navCtrl.push(Dashboard);
  }

  presentActionSheet(d, i) {
      let options = [];
      
      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(this.page.info, d, i, 0);
                      }
                  },{
                      text: 'View Files',
                      handler: () => {
                        this.view(this.page.view, d, i, 0);
                      }
                  }, {
                     text: 'Delete',
                     role: 'destructive',
                     handler: () => {
                        this.delete(d,i);
                     }
                  }, {
                     text: 'Share',
                     handler: () => {
                        this.presentPrompt(d);
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

  presentPrompt(d) {
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
            
              this.share(d,'users',data.username);
          }
        }
      ]
    });
    alert.present();
  }

}
