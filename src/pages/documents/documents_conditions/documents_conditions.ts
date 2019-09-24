import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import { DocumentsResult } from '../documents_result/documents_result';
import { DocumentsShared } from '../documents_shared/documents_shared';
import { DocumentsList } from '../documents_list/documents_list';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import {GlobalVarsProvider} from "../../../providers/global-vars/global-vars";
import { SessionHelper } from '../../../helpers/session.helper';

import { config } from '../../../app.config';

@Component({
  selector: 'page-documents-conditions',
  templateUrl: 'documents_conditions.html'
})
export class DocumentsConditions {
  conditions: any = [] 
  cat_attrs:any 
  sub_cat_attrs:any
  callback:any
  cat_attrs_keys:any = []
  sub_cat_attrs_keys:any = []

  org_name:any
  categories: any
  category: any = []
  subcategory: any = []
  subcategories: any
  documents: any = []
  reload: Boolean = false;
  operators:any = [
                     {value : 'equal_to', title : '=' },
                     {value : 'less_than', title : '<' },
                     {value : 'greater_than', title : '>' },
                     {value : 'less_than_equal_to', title : '<=' },
                     {value : 'greater_than_equal_to', title : '>=' },
                     {value : 'like', title : 'LIKE' }
                    ]

  constructor( public navCtrl: NavController,
 			  public params: NavParams,
        public session: SessionHelper,
        public globalVars: GlobalVarsProvider,
        public DocumentService: DocumentServiceProvider,
			  public Notification: NotificationsHelper,
			  public alertCtrl: AlertController ) {

    this.callback = this.params.data.callback;
    this.Notification.presentLoader();
    this.org_name = this.params.data.org_name;
    console.log(this.params);

    this.DocumentService.getCategories(this.params.data.shared_with == 'me' ? this.params.data.org_id : '')
    .then(data => {
      //this.Notification.dismissLoader();
      this.categories = data.categories;
      this.subcategories = data.subcategories;
      
      if(this.params.data.category && this.params.data.subcategory){
        this.category = [];
        this.subcategory = [];
        this.categories.forEach(ct=> {
          this.category.push(ct.id);
        });

        this.subcategories.forEach(st=> {
          this.subcategory.push(st.id);
        });

        this.conditions = this.params.data.conditions.length > 0 ? 
                        this.params.data.conditions :
                        [ this.conditonObj() ];
        if(this.category.length > 0 && this.subcategory.length > 0 ){
          this.subCatChange(false);
        }

      } else {  
        this.category = this.params.data.category;
        this.subcategory = this.params.data.subcategory;

        this.conditions = this.params.data.conditions.length > 0 ? 
                        this.params.data.conditions :
                        [ this.conditonObj() ];
        if(this.category.length > 0 && this.subcategory.length > 0 ){
          this.subCatChange(false);
        }
        
      }

    });


   
  }
  
  current_user:any = this.session.getUser()
  
  ionViewDidLoad() {

    

  }

  userLang(data,type = 'json'){
    var current_user = this.session.getUser();
    var d;
    if( type == 'json'){
       d = JSON.parse(data);
    } else {
       d = data;
    }
    
    var res;
    
    if ( d[current_user.user_lang_id] ){
      res = d[current_user.user_lang_id];
    } else {
      res = d[Object.keys(d)[0]];
    }

    return res
  }

  catChange(){
    this.Notification.presentLoader();
    this.DocumentService.getSubCategories(this.category.join(','),this.params.data.org_id)
    .then(data => {
      this.Notification.dismissLoader();
      this.subcategories = data.subcategories;
    });
  }

  subCatChange(is_loading = true){
    console.log(this.category)
    console.log(this.subcategory)
    if(this.category.length > 0 && this.subcategory.length > 0 ){
     
      if(is_loading){
        this.Notification.presentLoader();
      }
      
      this.DocumentService.getDocumentsBySubcats(this.subcategory.join(',') , 1, '', this.params.data.shared_with == 'me' ? this.params.data.org_id : '', this.params.data.shared_with)
      .then(data => {
        this.Notification.dismissLoader();
        if(data.error == undefined){
          this.documents = data.documents;
          this.cat_attrs = data.cat_attrs;
          this.sub_cat_attrs = data.sub_cat_attrs;
          this.cat_attrs_keys = Object.keys(data.cat_attrs);
          this.sub_cat_attrs_keys = Object.keys(data.sub_cat_attrs);
        } else {
          this.reload = true;
          this.Notification.presentToast('Timeout error');
        }
        
      });
    } else {
      this.Notification.presentToast('Please select the required fields');
    }

  }

  addConditions(){
    var last = this.conditions[this.conditions.length - 1]

    if( this.conditions.length < config.conditions_limit ){
      if( last.attribute != '' && last.operator != '' && last.value != '' ){
        let obj =  this.conditonObj()

         this.conditions.push(obj);
      } else {
        this.Notification.presentToast('Please fill the required fields',2000);
      }
    } else {
      this.Notification.presentToast('you have exceeded your limit',2000);
    }
  }

  removeCondition(index){
    if (index > -1) {
      const alert = this.alertCtrl.create({
          title: 'Remove condition',
          message: 'Do you want to remove this condition?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Ok',
              handler: () => {
              this.conditions.splice(index, 1);
              }
            }
          ]
        });
        alert.present();
    }
  }

  resetConditions(){
  	this.conditions = [this.conditonObj()]
  }

  applyConditions(){
    var last = this.conditions[this.conditions.length - 1]

    if( this.conditions.length == 1 || ( last.attribute != '' && last.operator != '' && last.value != '' ) ){
      this.Notification.presentLoader();
      this.DocumentService.applyConditions(this.conditions,this.subcategory,this.params.data.org_id,this.params.data.shared_with)
      .then(data => {
         this.Notification.dismissLoader();
         this.globalVars.setAppliedConditions(this.conditions);

          this.navCtrl.push( this.callback  == 'list' ? DocumentsList : DocumentsShared ,
           {documents : data.documents,
            cat_attrs : this.cat_attrs,
            category : this.category,
            users : data.users,
            subcategory : this.subcategory,
            conditions : this.conditions,
            org_id : this.params.data.org_id,
            shared_with : this.params.data.shared_with,
            org_name : this.params.data.org_name,
            permissions : data.permissions,
            sub_cat_attrs : this.sub_cat_attrs});
        });
    } else {
      this.Notification.presentToast('Please fill the required fields',2000);
    }
  }

  changeType(i){

    var other = JSON.parse(this.conditions[i].other);
     this.conditions[i].attribute = other.id;
     this.conditions[i].attr_for = other.for;

    switch(other.type){

      case 'text':
        this.conditions[i].type = 'text';
        this.conditions[i].operators = [
                                   {value : 'equal_to', title : '=' },
                                   {value : 'like', title : 'LIKE' }
                                  ];

        break;

      case 'number':
        this.conditions[i].type = 'number';
        this.conditions[i].operators = this.operators;

        break;

      case 'date':
        this.conditions[i].type = 'date';
        this.conditions[i].operators = [
                                   {value : 'equal_to', title : '=' },
                                   {value : 'less_than', title : '<' },
                                   {value : 'greater_than', title : '>' },
                                   {value : 'less_than_equal_to', title : '<=' },
                                   {value : 'greater_than_equal_to', title : '>=' }
                                  ];


        break;

    }

    
    // delete this.conditions[i].other;

  }

  conditonObj(){
    var obj = { attribute : '',
                 operator : '', 
                 operators : this.operators ,
                 value : '', 
                 logical : 'AND', 
                 type : 'text', 
                 other: '', 
                 attr_for : 'cat' }
    return obj;
  }


}