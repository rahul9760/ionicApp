import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar } from 'ionic-angular';
import { Screen3 } from '../../documents_create/screen3/screen3';
import { Uploading } from '../../documents_create/uploading/uploading';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { SessionHelper } from '../../../../helpers/session.helper';


@Component({
  selector: 'page-create-screen2',
  templateUrl: 'screen2.html'
})

export class Screen2 {
  @ViewChild(Navbar) navBar: Navbar;
  categories_attrs: any;
  category: any = [];
  subcategory: any = [];
  
  category_data: any = {};
  subcategory_data: any = {};
  tags: any;

  sub_categories_attrs: any;
  documents: any = [];
  attributes: any = [];
  tags_data: any = [];
  category_id:String = '';
  subcategory_id:String = '';
  designation:String = '';
  model: any = {};
  
  constructor(public navCtrl: NavController,
  			  public DocumentService: DocumentServiceProvider,
  			  public Notifications: NotificationsHelper,
  			  public session: SessionHelper,
  			  public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.attributes = this.navParams.data.attributes;
    this.category_id = this.navParams.data.category_id;
    this.categories_attrs  = this.navParams.data.attributes;
//console.log("sdfsdfsf",this.navParams.data.attributes);
    this.subcategory_id = this.navParams.data.subcategory_id;
    this.sub_categories_attrs = this.attributes.sub_categories_attrs;
    this.tags_data = this.navParams.data.tagss;

  }

  onSubmit() {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
  }

  userLang(data: string,type = 'json'){
  	var current_user = this.session.getUser();
  	return JSON.parse(data)[current_user.user_lang_id]
  }

  next(){ 
   // console.log("designation :"+this.designation+" && tags :"+this.tags);

    if(this.designation != '' && this.tags != ''){
      this.navCtrl.push(Uploading,{ attributes :this.attributes,
                                category_id :  this.category_id,
                                category_name :  this.navParams.data.category_name,
                                subcategory_name :  this.navParams.data.subcategory_name,
                                subcategory_id :  this.subcategory_id,
                                category_data : this.category_data,
                                subcategory_data : this.subcategory_data,
                                designation : this.designation,
                                tags : this.tags,
                                row_id : this.navParams.data.row_id,
                                page : this.navParams.data.page,
                                request_id : this.navParams.data.request_id
                              });
    }
    else {
      this.Notifications.presentToast('Please select the required values');
    } 
  }

  // count(r,a = ['text','number','date','list'] ,c = 0){
  //   if( r.length > 0 ){
  //     for (var v in r) {
  //       if( a.indexOf( r[v]['attr_type'] ) !== -1){
  //         c++;
  //       }
  //     }
  //   }
  //   return c;
  // }

  // count(r: { [x: string]: { [x: string]: string; }; length: number; },a = ['text','number','date','list'] ,c = 0){
  //   console.log(r);
  //   if( r.length > 0 ){
  //     for (var v in r) {
  //       if( a.indexOf( r[v]['attr_type'] ) !== -1){
  //         c++;
  //       }
  //     }
  //   }
  //   return c;
  // }

}