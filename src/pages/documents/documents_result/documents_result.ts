import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { DocumentsConditions } from '../documents_conditions/documents_conditions';

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import {DocumentsListView} from "../documents_list_view/documents_list_view";
import {DocumentsListInfo} from "../documents_list_info/documents_list_info";
import {GlobalVarsProvider} from "../../../providers/global-vars/global-vars";

import { config } from '../../../app.config';

@Component({
  selector: 'page-documents-result',
  templateUrl: 'documents_result.html',
  providers : [DocumentServiceProvider, NotificationsHelper, SessionHelper]
})
export class DocumentsResult {
  
  @ViewChild(Navbar) navBar: Navbar;

  documents: any
  category: any
  subcategory: any
  params: any
  conditions: any
  have_more: boolean = false
  is_request: boolean = false
  is_searched: boolean = false
  current_page: number = 1
  search: String = ''
  documentConditions = DocumentsConditions

  page = { view : DocumentsListView, info : DocumentsListInfo }

  constructor(public navCtrl: NavController,
  			  public DocumentService: DocumentServiceProvider,
          public Notifications: NotificationsHelper,
  			  public globalVars: GlobalVarsProvider,
  			  public session: SessionHelper,
  			  public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.documents = this.navParams.data.documents;
    this.conditions = this.navParams.data.conditions || [];

    this.setBackButtonAction()
    if(this.documents.length == config.per_page){
        this.have_more = true;
    }

    this.category = this.navParams.data.category;
    this.subcategory = this.navParams.data.subcategory;
    this.params = { cat_attrs :  this.navParams.data.cat_attrs ,
                    sub_cat_attrs : this.navParams.data.sub_cat_attrs,
                    callback : 'result',
                    category : this.category,
                    conditions : this.conditions,
                    org_id : this.navParams.data.org_id,
                    subcategory : this.subcategory }
  }

  setBackButtonAction(){
     
  }

  doInfinite(infiniteScroll) {
   
    if(!this.is_request){
      this.is_request = true;
      this.DocumentService.getDocumentsBySubcats(this.subcategory.join(','), ++this.current_page)
      .then(res => {
        this.is_request = false;
        if(res.documents.length < config.per_page){
            this.have_more = false;
        }

        res.documents.forEach(d=> {
          this.documents.push(d)
        });

        infiniteScroll.complete();
      });
    }

  }
  
  getItems(ev: any) {

    this.current_page = 1;

    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.Notifications.presentLoader();

       this.DocumentService.getDocumentsBySubcats(this.subcategory.join(','), 1 ,this.search.toLowerCase())
      .then(data => {
        this.Notifications.dismissLoader();
        this.is_searched = false;
        if(data.documents.length < config.per_page){
          this.have_more = false;
        } else {
          this.have_more = true;
        }

        this.documents = data.documents;

      });
      },500)
    }
  }

  // getItems(ev: any) {

  //   let val = ev.target.value;
  //   this.current_page = 1;


  //   this.search = val;
  //   this.Notifications.presentLoader();

  //   this.DocumentService.getDocumentsBySubcats(this.subcategory.join(','), 1 ,val.toLowerCase())
  //   .then(data => {
  //     this.Notifications.dismissLoader();
     
  //     if(data.documents.length < config.per_page){
  //       this.have_more = false;
  //     } else {
  //       this.have_more = true;
  //     }

  //     this.documents = data.documents;

  //   });
    
  // }

  view(comp,id,i){
    var p = 0;
    this.documents.forEach(d=> {
      this.documents[p].opened = false;
      p++
    });

    this.documents[i].opened = true;

    this.DocumentService.updateRecent(id)
    .then(data => {
     console.log(data);
    });

    this.navCtrl.push(comp, {
      id: id
    });
  }

}
