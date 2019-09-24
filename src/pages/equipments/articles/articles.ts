// AUTHOR : HS
// CREATED : 11-04-2018
// DESCRIPTION : Used to list, delete, show the levels.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../providers/equipment-service/equipment-service'

import { NotificationsHelper } from '../../../helpers/notifications.helper';

import { EquipmentsModels } from '../models/models';
import { EquipmentsArticleDescription } from './description/description';
import { EquipmentsArticleCreate } from './create/create';

import { config } from '../../../app.config';

@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsArticles {

  public search = '';
  public level_names = '';
  public levels_data_id;
  public model_data_id;
  public articles:any;
  public attributes:any;
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
    this.getArticles();
  }


  getArticles(){
    this.levels_data_id = this.params.get('levels_data_id');
    this.model_data_id = this.params.get('model_data_id');
    this.Notifications.presentLoader();
    
    this.EquipmentService.getArticles(1, this.search, this.levels_data_id, this.model_data_id)
    .then(data => {
      this.Notifications.dismissLoader();
      this.articles = data.articles_data;
      this.attributes = data.article_attrs;
      this.level_names = data.level_names;      
     
      if(data.articles_data.length == config.per_page){
        this.have_more = true;
      }

    });
  }

  view(t){
    this.navCtrl.push(EquipmentsArticleDescription, { id : t.id })
  }

  presentActionSheet(t) {
      let options = [];

      options = options.concat([{
                      text: 'Description',
                      handler: () => {
                        this.view(t);
                      }
                  }, {
                     text: 'Delete',
                     role: 'destructive',
                     handler: () => {
                        this.delete(t);
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

  create(){
    this.navCtrl.push(EquipmentsArticleCreate,{ levels_data_id : this.levels_data_id, model_data_id : this.model_data_id })
  }

 
  delete(t) {
    
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
               this.EquipmentService.deleteArticle(t.id)
              .then(data => {
                 this.getArticles();
              });
            }
          }
        ]
      });
      alert.present();
    
  } 

  back(){
    this.navCtrl.push(EquipmentsModels,{ levels_data_id : this.levels_data_id , parent_id : this.params.get('parent_id') })
  }

  getItems(ev: any) {
    if(!this.is_searched){
      this.is_searched = true;
      this.EquipmentService.getArticles( 1, this.search, this.levels_data_id, this.model_data_id )
        .then(data => {

          this.is_searched = false;
          
          if(data.articles_data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.articles = data.articles_data;
          this.attributes = data.article_attrs;
          this.level_names = data.level_names;  
        });
    }
  }


  doRefresh(refresher) {
    setTimeout(() => {
      this.getArticles();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;

      this.EquipmentService.getArticles( ++this.current_page, this.search, this.levels_data_id, this.model_data_id )
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.articles_data.length < config.per_page){
              this.have_more = false;
          }

          res.articles_data.forEach(d=> {
            this.articles.push(d)
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
