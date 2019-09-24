import { Component } from '@angular/core';
import { ActionSheetController, NavParams, AlertController, NavController } from 'ionic-angular';
import { DocumentServiceProvider } from '../../../providers/document-service/document-service';
import {DocumentsListView} from "../documents_list_view/documents_list_view";

import { LinkedAgendaWithDocuments } from "../links/agenda/agenda";
import { LinkedContactExternalWithDocuments } from "../links/contact_external/contact_external";
import { LinkedInfrastructureWithDocuments } from "../links/infrastructure/infrastructure";
import { LinkedContactInternalWithDocuments } from "../links/contact_internal/contact_internal";
import { LinkedEquipmentWithDocuments } from "../links/equipments/equipments";

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { SessionHelper } from '../../../helpers/session.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';
import { LinkedDocumentWithDocuments } from "../links/documents/documents";


@Component({
  selector: 'page-list-documents-info',
  templateUrl: 'documents_list_info.html',
  providers: [
              DocumentServiceProvider,
              FunctionsHelper,
              NotificationsHelper]
})

export class DocumentsListInfo {
 
  public document: any;
  public current_user: any;
  public data: any = {};
  public orignal_data: any;
  public categories : any = [];
  public subcategories : any = [];
  public selected_org_id : any;
  public document_id: number;

  public color: String = '#488aff';

  public is_edit : boolean = false;
  public is_requested : boolean = false;
  public reload:  boolean = false;

  constructor(
    public  actionSheetCtrl: ActionSheetController,
    private params: NavParams,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private session: SessionHelper,
    private fns: FunctionsHelper,
    private DocumentService: DocumentServiceProvider,
    private Notifications: NotificationsHelper) {
      this.document_id = this.params.get('id');
      this.current_user = this.session.getUser();
      this.selected_org_id = this.params.get('org_id');
      this.data.designation = this.setValue('', 'Designation', 'designation' , true);
      this.data.category = this.setValue('', 'Category', 'category' , true);
      this.data.subcategory = this.setValue('', 'Subcategory', 'subcategory' , true);
    }

  ngOnInit(){

  }

  ionViewWillEnter(){
    this.getDocument();
  }

  getDocument(){
    
    this.data.categories = [];
    this.data.subcategories = [];
    this.data.tagKeys = [];

    this.Notifications.presentLoader();

    this.DocumentService.getDocument(this.document_id, this.selected_org_id)
    .then(data => {
    
      this.Notifications.dismissLoader();
      this.reload = false;
      this.is_requested = true;
      
      if( data.error == undefined) {
        
        this.document = data;

        this.data.id = this.document_id;
        this.data.cat_id = data.cat_id;
        this.data.sub_cat_id = data.sub_cat_id;
        this.data.designation = this.setValue(data.designation, 'Designation', 'designation' , true);
        this.data.category = this.setValue(data.cat_name, 'Category', 'category' , true);
        this.data.subcategory = this.setValue(data.sub_cat_name, 'Subcategory', 'subcategory' , true);
        
        this.data.tagKeys = Object.keys(data.tags);

        this.data.tags = data.tags;

        this.data.catKeys = Object.keys(data.cat_attrs_data);


        data.cat_attrs.forEach( (ck) => {
           this.data.categories.push({  value : data.cat_attrs_data[ck.id] ,
                                        column : ck.name ,
                                        disabled : true,
                                        id : ck.id,
                                        type : ck.attr_type,
                                        options : ck.options || []
                                   })
        });


        data.sub_cat_attrs.forEach( (sk) => {
          this.data.subcategories.push({ value : data.sub_cat_attrs_data[sk.id] ,
                                    column : sk.name ,
                                    disabled : true,
                                    id : sk.id,
                                    type : sk.attr_type,
                                    options : sk.options || [],
                                 })
        });

        this.orignal_data = data;
        this.orignal_data.designation = this.setValue(data.designation, 'Designation', 'designation' , true);
        this.orignal_data.ntagKeys =  Object.keys(data.tags);


      } else {
        this.reload = true;
        this.Notifications.presentToast('Timeout error');
      }

    });
  }

  reloadMe(){ 
    this.getDocument();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getDocument();
      refresher.complete();
    }, 2000);
  }

  edit(){
    if(this.selected_org_id > 0){
      
      if(parseInt(this.params.get('permission').can_update)){
        this.is_edit = true;
        this.color = '#1ea209';
        this.data.designation.disabled = false;
        this.data.org_id = this.selected_org_id;
        this.data.category.disabled = false;
        this.data.subcategory.disabled = false;
        
        this.data.categories.forEach((c,i) => {
          this.data.categories[i]['disabled'] = false; 
        });
        
        this.data.subcategories.forEach((s,i) => {
          this.data.subcategories[i]['disabled'] = false; 
        });
      } else {
        this.Notifications.presentToast('You do not have permission to update the document');
      }

    } else {
      this.is_edit = true;
      this.color = '#1ea209';
      this.data.designation.disabled = false;
      this.data.category.disabled = false;
      this.data.subcategory.disabled = false;
      this.data.org_id = 0;
      this.data.categories.forEach((c,i) => {
        this.data.categories[i]['disabled'] = false; 
      });
      
      this.data.subcategories.forEach((s,i) => {
        this.data.subcategories[i]['disabled'] = false; 
      });
    }
  }

  cancelEdition(){
    
    this.is_edit = false;
    this.color = '#488aff';

    this.data.designation = this.orignal_data.designation;
  
    this.data.tagKeys = this.orignal_data.ntagKeys;

    this.data.tags = this.orignal_data.tags;

    this.data.categories = [];

    this.orignal_data.cat_attrs.forEach( (ck) => {
       this.data.categories.push({  value : this.orignal_data.cat_attrs_data[ck.id] ,
                                    column : ck.name ,
                                    disabled : true,
                                    id : ck.id,
                                    type : ck.attr_type,
                                    options : ck.options || []
                               })
    });

    this.data.subcategories = [];

    this.orignal_data.sub_cat_attrs.forEach( (sk) => {
      this.data.subcategories.push({ value : this.orignal_data.sub_cat_attrs_data[sk.id] ,
                                column : sk.name ,
                                disabled : true,
                                id : sk.id,
                                type : sk.attr_type,
                                options : sk.options || [],
                             })
    });

  }

  update(){

    this.Notifications.presentLoader();
    this.DocumentService.update(this.data)
    .then(data => {
      this.Notifications.dismissLoader();
      this.is_edit = false;
      this.color = '#488aff';
      this.getDocument();

      if(data.status){
        this.Notifications.presentToast('Updated successfully');
      } else {
        this.Notifications.presentToast(data.message);
      }
    });

  }

  setValue(value,column,type,disabled){
    return {  value : value ,
              column : column,
              disabled : disabled,
              type : type
           }
  }

  deleteTag(val, key){
    this.data.tagKeys.splice(key,1);
  }


  addTags(){
      this.is_edit = true;
      this.Notifications.presentLoader();
      let alert = this.alertCtrl.create();

      alert.setTitle('Select tags');

       this.DocumentService.getTags()
      .then(data => { 
        this.Notifications.dismissLoader();

        data.tags.forEach((t) => {
           alert.addInput({
              type: 'checkbox',
              label: t.tag_name,
              value: t.id,
              checked: this.data.tagKeys.indexOf(t.id) !== -1
          });
        });

        alert.addButton('Cancel');

        alert.addButton({
          text: 'Okay',
          handler: (d) => {
            this.getTag(d,data.tags);
            this.data.tagKeys = this.data.tagKeys.concat(d).filter((x, i, a) => x && a.indexOf(x) === i);

          }
        });

        alert.present();

      });

  }

  getTag(ids,tags){
    ids.forEach( (id) => {
      tags.forEach((t) => {
        if(t.id == id){
          this.data.tags[t.id] = t
        } 
      });
    });
    
  }

  goToList(){
    this.navCtrl.push(DocumentsListView, this.params.data);
  }


  link(type){
    
    switch(type){

          case 'document':
            this.navCtrl.push(LinkedDocumentWithDocuments, { document_id : this.document_id })
          break;
          
          case 'agenda':
            this.navCtrl.push(LinkedAgendaWithDocuments, { document_id : this.document_id })
          break;

          case 'contact_external':
            this.navCtrl.push(LinkedContactExternalWithDocuments, { document_id : this.document_id })
          break;

          case 'contact_internal':
            this.navCtrl.push(LinkedContactInternalWithDocuments, { document_id : this.document_id })
          break;

          case 'infrastructure':
            this.navCtrl.push(LinkedInfrastructureWithDocuments, { document_id : this.document_id })
          break;

          case 'equipment':
            this.navCtrl.push(LinkedEquipmentWithDocuments, { document_id : this.document_id })
          break;
           
    }
    
  }

}
