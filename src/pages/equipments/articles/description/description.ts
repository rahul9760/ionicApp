// AUTHOR : HS
// CREATED : 11-04-2018
// DESCRIPTION : Used to list, delete, show the levels.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service'

import { NotificationsHelper } from '../../../../helpers/notifications.helper';

import { LinkedContactExternalWithEquipments } from '../../links/contact_external/contact_external';
import { LinkedContactInternalWithEquipments } from '../../links/contact_internal/contact_internal';
import { LinkedDocumentsWithEquipments } from '../../links/documents/documents';
import { LinkedAgendaWithEquipments } from '../../links/agenda/agenda';
import { LinkedInfrastructureWithEquipments } from '../../links/infrastructure/infrastructure';


@Component({
  selector: 'page-articles',
  templateUrl: 'description.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsArticleDescription {

  public article_id;
  public article:any;
  public backup:any;
  public attributes:any;
  private color: String = '#488aff';
  private level_names: String = '';
  private is_edit: Boolean = false;  
  public item_header_class: String = 'item item-ios list-header list-header-ios';
  public input_class: String = "text-input text-input-ios"

  constructor(
          public navCtrl: NavController, 
          public params: NavParams, 
          public Notifications: NotificationsHelper, 
          public actionSheetCtrl: ActionSheetController, 
          public EquipmentService:EquipmentServiceProvider
        ) {
    this.getArticle();
  }


  getArticle(){
    this.article_id = this.params.get('id');
    this.Notifications.presentLoader();

    this.EquipmentService.getArticle(this.article_id)
    .then(data => {
      this.Notifications.dismissLoader();
      this.article = data.article;
      this.level_names = data.level_names;
      this.attributes = data.attributes;
    });
  }

  view(t){
    this.navCtrl.push(EquipmentsArticleDescription, { id : t.id })
  }

  update(){
    console.log(this.article); 
    this.EquipmentService.updateArticle(this.article)
    .then(data => {
      this.resetVaribles();
      this.getArticle();
    });
  }

  edit(){
    this.color = '#1ea209'; 
    this.is_edit = true;  
    this.backup = Object.assign({}, this.article);
  }
  
  cancelEdition(){
    this.resetVaribles();
    this.article = this.backup;
  }

  resetVaribles(){
    this.is_edit = false;
    this.color = '#488aff';
  }

  link(type){
    console.log(type);
    
    switch(type){

          case 'contact_external':
            this.navCtrl.push(LinkedContactExternalWithEquipments, { equipment_id : this.article_id })
          break;

          case 'contact_internal':
            this.navCtrl.push(LinkedContactInternalWithEquipments, { equipment_id : this.article_id })
          break;

          case 'document':
            this.navCtrl.push(LinkedDocumentsWithEquipments, { equipment_id : this.article_id })
          break;

          case 'agenda':
            this.navCtrl.push(LinkedAgendaWithEquipments, { equipment_id : this.article_id })
          break;

          case 'infrastructure':
            this.navCtrl.push(LinkedInfrastructureWithEquipments, { equipment_id : this.article_id })
          break;

           
    }
    
  }

}
