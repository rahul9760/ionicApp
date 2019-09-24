import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { InfrastructureServiceProvider } from '../../../../../providers/infrastructure-service/infrastructure-service';
import { EquipmentServiceProvider } from '../../../../../providers/equipment-service/equipment-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../../../helpers/functions.helper';

import { config } from '../../../../../app.config';
import { LinkedEquipmentWithInfrastructure } from '../equipments';
import { Equipments } from "../../../../equipments/list/list";
import { CreateEquipmentLevel } from "../../../../equipments/list/create/create";
import { CreateArticleModal } from '../../../../common/articles/articles';


@Component({
  selector: 'page-equipment-create',
  templateUrl: 'create.html',
  providers: [EquipmentServiceProvider, FunctionsHelper, InfrastructureServiceProvider]
})

export class CreateLinkedEquipmentForInfrastructure {
  
  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public articles: any = [];
  public attributes: any;
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;
  model_data_id: any;
  levels_data_id:  any;

  constructor(public navCtrl: NavController,
		          public params: NavParams,   
              public fns: FunctionsHelper,
              public EquipmentService: EquipmentServiceProvider, 
              public InfrastructureService: InfrastructureServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.location_id = this.params.get('location_id');
              this.levels_data_id = this.params.get('levels_data_id');
              this.model_data_id = this.params.get('model_data_id');
  }

 
  getItems(ev: any) {

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.EquipmentService.getArticles(1, this.search.toLowerCase(), 0, 0)
        .then(data => {
         
          this.is_searched = false;
          this.articles = data.articles_data;
          this.attributes = data.article_attrs;    
         
          if(data.articles_data.length == config.per_page){
            this.have_more = true;
          }

        });

      }, 500)
    }
  }  
  
  getFirst(article){
     let $first = '--';
     
     if( this.fns.ObjLength(article.attrs_data) > 0 ) {
        let $key = Object.keys(article.attrs_data)[0];
        $first = article.attrs_data[$key];
     }
     
     return $first
  }

  save(){
    this.Notification.presentLoader();
    this.InfrastructureService.saveLinkedEquipment(this.link)
    .then(data => {
      this.Notification.dismissLoader();

      if( data.status ){
        this.navCtrl.push(LinkedEquipmentWithInfrastructure , { location_id : this.params.get('location_id')} )
      }
      
      this.Notification.presentToast(data.message);
    });
  }

  initLocation(article){
   this.link.name = this.getFirst(article);
   this.link.equipment_id = article.id;
  }

  addEquipment() {
  
      let options = [];

      options = options.concat([{
                      text: 'Create Equipment (Level 1)',
                      handler: () => {
                        this.navCtrl.push(CreateEquipmentLevel,{ parent_id : 0 })  
                      }
                  },{
                      text: 'Select Level',
                      handler: () => {
                        this.navCtrl.push(CreateArticleModal)
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

 


}
