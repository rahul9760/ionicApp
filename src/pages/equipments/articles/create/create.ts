// AUTHOR : HS
// CREATED : 17-04-2018
// DESCRIPTION : Used to create the model.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../../providers/equipment-service/equipment-service'

import { NotificationsHelper } from '../../../../helpers/notifications.helper';

import { EquipmentsArticles } from '../../articles/articles';

@Component({
  selector: 'page-article-create',
  templateUrl: 'create.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsArticleCreate {

  public levels_data_id:Number;
  public model_data_id:Number;
  public article:any = { attrs_data: {} } ;
  public attributes:any;
  public color: String = '#488aff';
  public item_header_class: String = 'item item-ios list-header list-header-ios';
  public input_class = "text-input text-input-ios"

  constructor(
          public navCtrl: NavController, 
          public params: NavParams, 
          public Notifications: NotificationsHelper, 
          public actionSheetCtrl: ActionSheetController, 
          public EquipmentService:EquipmentServiceProvider
        ) {
    this.levels_data_id = this.params.get('levels_data_id')
    this.model_data_id = this.params.get('model_data_id')
    this.getArticleAttrs();
  }


  getArticleAttrs(){
    this.Notifications.presentLoader();
    this.article.levels_data_id = this.levels_data_id; 
    this.article.model_data_id = this.model_data_id; 
    this.EquipmentService.getArticleAttrs(this.levels_data_id)
    .then(data => {
      this.Notifications.dismissLoader();
      this.attributes = data.attributes;
    });
  }

  create(){
    if(Object.keys(this.article.attrs_data).length > 0){

      this.EquipmentService.createArticle(this.article)
      .then(data => { 
        if(data.status){
          this.navCtrl.push(EquipmentsArticles, { levels_data_id : this.levels_data_id, model_data_id : this.model_data_id } );
        }
      });
    } else {
      this.Notifications.presentToast("Please fill all fields to create article.");
    }
  }

}
