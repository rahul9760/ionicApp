// AUTHOR : HS
// CREATED : 11-04-2018
// DESCRIPTION : Used to list, delete, show the levels.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { EquipmentServiceProvider } from '../../../providers/equipment-service/equipment-service'

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { Equipments } from '../list/list';

import { EquipmentsModels } from '../models/models';
import { EquipmentsLevelDescription } from './description/description';
import { CreateEquipmentLevel } from '../list/create/create';

import { config } from '../../../app.config';

@Component({
  selector: 'page-level',
  templateUrl: 'levels.html',
  providers: [EquipmentServiceProvider]
})

export class EquipmentsLevels {

  public search = '';
  public is_searched = false;
  public is_request = false;
  public current_page = 1;
  public have_more = false;
  public count;
  public parent_id;
  public levels:any;

  constructor(public navCtrl: NavController, public params: NavParams, public Notifications: NotificationsHelper, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public EquipmentService:EquipmentServiceProvider) {
    this.getLevels();
  }


  getLevels(){
    this.parent_id = this.params.get('parent_id');
    this.count = this.params.get('count') || 2;
    this.Notifications.presentLoader();
    let where = '&parent_id=' + this.parent_id;
    this.EquipmentService.getLevels(1,this.search, where).then(data => {
      this.Notifications.dismissLoader();
      this.levels = data;
      if(data.levels_data.length == config.per_page){
        this.have_more = true;
      }
    });
  }

   presentActionSheet(t) {

    let options = [];
    options = options.concat([{
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
    if(this.count < 3){
     this.navCtrl.push(EquipmentsLevels,{ parent_id : t.id , count : 3 });
    } else {
     this.navCtrl.push(EquipmentsModels,{ levels_data_id : t.id, parent_id : t.parent_id });
    }
  }

  view(id){
    this.navCtrl.push(EquipmentsLevelDescription,{ id : id })
  }

  delete(id) {
    
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to delete this level?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            this.Notifications.presentLoader();
            this.EquipmentService.deleteLevel(id)
            .then( data => {
              this.Notifications.dismissLoader();
              if(data.status){
                this.getLevels();
              }
              this.Notifications.presentToast(data.message)
            });
          }
        }
      ]
    });

    alert.present();
    
  } 

  //name conversion:singular to plural eg country = countries, state = states  

  create(){
    this.navCtrl.push(CreateEquipmentLevel, {  
                                             parent_id : this.parent_id,
                                             current_level : this.levels.current_level,
                                             level: true,
                                             count: this.count
                                          })
  }

  back(){
    if(this.count == 3){
      this.navCtrl.push(EquipmentsLevels,{ parent_id : this.levels.parent.parent_id , count : 2 });
    } else if(this.count == 2){
      this.navCtrl.push(Equipments);
    } 
    this.count--;
  }

  getItems(ev: any) {
    if(!this.is_searched){
      this.is_searched = true;
      this.EquipmentService.searchLevelsData(1, this.search.toLowerCase(), this.parent_id )
        .then(data => {

          this.is_searched = false;
          if(data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }

          this.levels = data;
        });
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getLevels();
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;
      let where = '&parent_id=' + this.parent_id;
      this.EquipmentService.getLevels(++this.current_page, this.search, where).then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.levels_data.length < config.per_page){
              this.have_more = false;
          }

          res.levels_data.forEach(d=> {
            this.levels.levels_data.push(d);
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
