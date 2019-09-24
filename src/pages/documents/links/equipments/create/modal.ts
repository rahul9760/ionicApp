import { Component  } from '@angular/core';
import { ViewController, App } from 'ionic-angular';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { EquipmentServiceProvider } from '../../../../../providers/equipment-service/equipment-service'


@Component({
  templateUrl: 'modal.html',
  providers: [EquipmentServiceProvider, NotificationsHelper]
})

export class CreateLinkedEquipmentForDocumentsModal {
  
  models: any = []
  article:any = { attrs_data: {} }
  levels: any = { one: [] , two: [], three: [], model:[]} 
  level: any = { one: '' , two: '', three: '', model : ''} 
  levels_data_id: any;
  attributes: any = [];
  article_attributes: any = [];
  item_header_class: String = 'item item-ios list-header list-header-ios';
  input_class = "text-input text-input-ios"

  reload: Boolean = false;
  constructor(
              public viewCtrl: ViewController, 
              public Notifications: NotificationsHelper,
              public EquipmentService: EquipmentServiceProvider,
              public app: App) {
      this.getLevels(1);
  }
  
  getLevels(level){

    switch(level){
      
      case 1:
        
        this.Notifications.presentLoader();
        this.EquipmentService.getLevels(1,'')
        .then( data => {
          this.Notifications.dismissLoader();
          if( data.error == undefined ){
            this.levels.one = data.levels_data;
            this.reload = false;
          } else {
           this.Notifications.presentToast('Please Request Again.');
           this.reload = true;
          } 

        });
      break;

    }

  }

  changeLevel(level, id){
    
    this.resetLevel(level);
    this.Notifications.presentLoader();
    let where = '&parent_id=' + id;
   
    this.EquipmentService.getLevels(1,'', where)  
    .then(data => {
      this.Notifications.dismissLoader();
      
      switch(level){
      
          case 1:
            this.levels.two = data.levels_data;
          break;

          case 2:
            this.levels.three = data.levels_data; 
            this.levels_data_id = data.parent.parent_id

          break;

      }
      
    }); 

  }

  resetLevel(level){
    if(level == 1){
      this.levels.two = [];
      this.levels.three = [];
      this.models = [];
      this.article_attributes = [];
    } else if( level == 2){
      this.levels.three = [];
      this.models = [];
      this.article_attributes = [];
    } else if( level == 3){
      this.models = [];
      this.article_attributes = [];
    }
  }

  changeModal(){
    this.Notifications.presentLoader();
    this.EquipmentService.getModels(1, '', this.level.three)
    .then(data => {
      this.Notifications.dismissLoader();
      this.models = data.models_data;
      this.attributes = data.models_attrs;
    });
  }

  getArticles(){
    this.Notifications.presentLoader();
    this.EquipmentService.getArticleAttrs(this.level.three)
    .then(data => {
      this.Notifications.dismissLoader();
      this.article_attributes = data.attributes;
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }


  create(){
    if(Object.keys(this.article.attrs_data).length > 0){
      this.article.levels_data_id = this.level.three; 
      this.article.model_data_id = this.levels.model;
      this.EquipmentService.createArticle(this.article)
      .then(data => {
        if(data.status){
          this.dismiss();
        }
      });
    } else {
      this.dismiss();
    }
  }


}