import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { EquipmentServiceProvider } from '../../../providers/equipment-service/equipment-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { EquipmentsLevels } from '../levels/levels';
import { Dashboard } from '../../dashboard/dashboard';
import { CreateEquipmentLevel } from './create/create';
import { config } from '../../../app.config';

@Component({
  selector: 'page-agenda',
  templateUrl: 'list.html',
  providers: [EquipmentServiceProvider]
})

export class Equipments {
 
  public levels: any;
  public current_level;
  public current_page: number = 1;
  public have_more: boolean = false;
  public search: String = '';
  public is_request:  boolean = false;
  public is_searched:  boolean = false;
  public is_hold:  boolean = false;
  public reload:  boolean = false;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public Notifications: NotificationsHelper,
              public EquipmentService: EquipmentServiceProvider,
              public actionSheetCtrl: ActionSheetController) {
  }

  ionViewWillEnter(){
    this.getLevels()
  }

  getLevels(){
    this.Notifications.presentLoader();
    this.EquipmentService.getLevels(1,this.search)
    .then( data => {
      this.Notifications.dismissLoader();
      if( data.error == undefined ){
        this.levels = data.levels_data;
        this.current_level = data.current_level;
        this.reload = false;
      
        if(this.levels.length == config.per_page){
            this.have_more = true;
        }

      } else {
       this.Notifications.presentToast('Please request again.');
       this.reload = true;
      }

    });
  }

  doRefresh(refresher){
    setTimeout(() => {
      this.getLevels();
      refresher.complete();
    }, 2000);
  }

  view(id){
    
  }

  delete(id) {
    
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete this level?',
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

  create(){
    this.navCtrl.push(CreateEquipmentLevel, {  
                                             parent_id : 0,
                                             current_level : this.current_level
                                          })
  }

  next(t){

    this.navCtrl.push( EquipmentsLevels, {  
                                           parent_id : t.id
                                        } )
  }

  back(){
    this.navCtrl.push(Dashboard);
  }

  presentActionSheet(t) {
      let options = [];

      options = options.concat([ {
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

  getItems(ev: any) {
    if(!this.is_searched){
      this.is_searched = true;
      this.EquipmentService.searchLevelsData(1, this.search.toLowerCase(), 0 ).then(data => {

        if( data.error == undefined ){
           
          this.is_searched = false;
          
          if(data.levels_data.length < config.per_page){
            this.have_more = false;
          } else {
            this.have_more = true;
          }
          this.levels = data.levels_data;

        } else {
          this.Notifications.presentToast('Please request again.');
          this.reload = true;
        }
           
      });
    }
  }

}
