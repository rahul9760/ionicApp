// AUTHOR : HS
// CREATED : 11-04-2018
// DESCRIPTION : Used to list, delete, show the levels.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../providers/equipment-service/equipment-service'

import { NotificationsHelper } from '../../../helpers/notifications.helper';

import { EquipmentsArticles } from '../articles/articles';
import { EquipmentsModelDescription } from './description/description';
import { EquipmentsModelCreate } from './create/create';
import { EquipmentsLevels } from '../levels/levels';

import { config } from '../../../app.config';

@Component({
  selector: 'page-models',
  templateUrl: 'models.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsModels {

  public search = '';
  public levels = '';
  public levels_data_id;
  public attributes;
  public models:any;
  public parent_level:any;
  public is_searched = false;
  public is_request = false;
  public current_page = 1;
  public have_more = false;

  constructor(
          public navCtrl: NavController, 
          public params: NavParams, 
          public Notifications: NotificationsHelper, 
          public actionSheetCtrl: ActionSheetController, 
          public alertCtrl: AlertController, 
          public EquipmentService:EquipmentServiceProvider
        ) {
    
    this.getModels();
  }


  getModels(){
    this.levels_data_id = this.params.get('levels_data_id');
    this.Notifications.presentLoader();

    this.EquipmentService.getModels(1, this.search, this.levels_data_id)
    .then(data => {
      this.Notifications.dismissLoader();
      this.models = data.models_data;
      this.levels = data.levels;
      this.parent_level = data.parent_level;
      this.attributes = data.models_attrs;
      
      if(data.models_data.length == config.per_page){
        this.have_more = true;
      }

    });
  }

   presentActionSheet(t) {
      let options = [];

      options = options.concat([{
                      text: 'Next Level',
                      handler: () => {
                        this.next(t);
                      }
                  },{
                      text: 'Description',
                      handler: () => {
                        this.view(t.id);
                      }
                  }, {
                     text: 'Delete',
                     role: 'destructive',
                     handler: () => {
                        this.delete(t.id);
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

  next(t){
    this.navCtrl.push(EquipmentsArticles,{ levels_data_id : this.levels_data_id, model_data_id : t.id, parent_id : this.params.get('parent_id')  })
  }

  view(id){
    this.navCtrl.push(EquipmentsModelDescription,{ id : id })
  }

  create(){
    this.navCtrl.push(EquipmentsModelCreate,{ levels_data_id : this.levels_data_id })
  }

  delete(id) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this article?',
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
               this.EquipmentService.deleteModel(id)
              .then(data => {
                 this.getModels();
              });
            }
          }
        ]
      });
      alert.present();
    
  } 

  back(){
    this.navCtrl.push(EquipmentsLevels,{ parent_id : this.params.get('parent_id') , count : 3 } )
  }

  getItems(ev: any) {
    if(!this.is_searched){
      this.is_searched = true;
      this.EquipmentService.getModels(1, this.search.toLowerCase(), this.levels_data_id )
        .then(data => {

          this.is_searched = false;
          
          if(data.models_data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.models = data.models_data;
          this.levels = data.levels;
          this.parent_level = data.parent_level;
          this.attributes = data.models_attrs;

        });
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getModels();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;

      this.EquipmentService.getModels(++this.current_page, this.search, this.levels_data_id)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.models_data.length < config.per_page){
              this.have_more = false;
          }

          res.models_data.forEach(d=> {
            this.models.push(d)
          });

          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
  }

}
