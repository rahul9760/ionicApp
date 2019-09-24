import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';

import { NotificationServiceProvider } from '../../providers/notifications-service/notifications-service';
import {DocumentsListView} from "../documents/documents_list_view/documents_list_view";
import {AgendaDescription} from "../agenda//show/show";
import {DocumentsListInfo} from "../documents/documents_list_info/documents_list_info";
import {ContactInternalDescription} from "../contact/internal/show/show";
import {ContactExternalDescription} from "../contact/external/show/show";
import { EquipmentsLevels } from '../equipments/levels/levels';
import { EquipmentsModels } from '../equipments/models/models';
import { EquipmentsArticles } from '../equipments/articles/articles';
import { EquipmentsArticleDescription } from '../equipments/articles/description/description';
import { InfrastructureDescription } from '../infrastructure/show/show';

import { NotificationsHelper } from '../../helpers/notifications.helper';

import { config } from '../../app.config';
import { SessionHelper } from '../../helpers/session.helper';

@Component({
  selector: 'page-items',
  templateUrl: 'items.html'
})

export class Items {
    
    page = { view : DocumentsListView, info : DocumentsListInfo }

    items:any = []
    current_page: number = 1;
    have_more: boolean = false;
    search: String = '';
    is_request:  boolean = false;
    is_searched:  boolean = false;
    is_hold:  boolean = false;
    reload:  boolean = false;
    selected_count: number = 0;

    constructor(public navCtrl: NavController,
                public actionSheetCtrl: ActionSheetController,
                public Notification: NotificationsHelper,
                public session: SessionHelper,
                public NotificationService: NotificationServiceProvider
                ) {
        this.getItems()
    }
    

  getItems(){
    this.resetVaribles();
    this.Notification.presentLoader();
    this.NotificationService.getItems(1,this.search)
    .then(data => {
      this.Notification.dismissLoader();

      if( data.error == undefined ){
        this.items = data.items;
        
        if(this.items.length == config.per_page){
            this.have_more = true;
        }

      } else {
       
       this.Notification.presentToast('Please Request Again');
       this.reload = true;
      
      }

    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getItems();
      refresher.complete();
    }, 2000);
  }

  avatar(notification){
    return config.api_url + 'documents/download?fileName=' + notification.by_user_profile_pic.name + '&token=' + this.session.getToken() + '&type=profile_pic&thumb=true&' + '&org_id=' + notification.by_org_id
  }

  doInfinite(infiniteScroll) {

    if(!this.is_request){

      this.is_request = true;

      this.NotificationService.getItems(++this.current_page,this.search)
      .then(res => {

        this.is_request = false;
        
        if( res.error == undefined ){
          if(res.items.length < config.per_page){
              this.have_more = false;
          }

          res.items.forEach(d=> {
            this.items.push(d)
          });

          infiniteScroll.complete();
        
        } else {

          --this.current_page;
          this.doInfinite(infiniteScroll);

        }

      });
    }
  }

  open(notification, index){
  
  }

  openItem(item, index){
      console.log(item)
      
      switch(item.request_type){
        
        case 'document':
          this.navCtrl.push( DocumentsListInfo , {
              id: item.request_id
          });
        break;
        
        case 'contact_internal':
          this.navCtrl.push( ContactInternalDescription , {
              id: item.request_id
          });
        break;
        
        case 'contact_external':
          this.navCtrl.push( ContactExternalDescription , {
              id: item.request_id
          });
        break;
        
        case 'agenda':
          this.navCtrl.push( AgendaDescription , {
              id: item.request_id
          });
        break;
        
        case 'locations':
          this.navCtrl.push(InfrastructureDescription, { id : item.request_id , count : 0 })

        break;

        case 'objects':
          
          switch(item.module){
          
            case 'levels_data':


              item.contain_three_levels ? this.navCtrl.push(EquipmentsModels,{ 
                                                    levels_data_id : item.request_id, 
                                                    parent_id : item.parent_id
                                                 })
                                                 : 
                                        this.navCtrl.push( EquipmentsLevels, {  
                                           parent_id : item.request_id
                                        } )

               
            break;

            case 'model_data':
                this.navCtrl.push(EquipmentsArticles,{ 
                                            levels_data_id : item.levels_data_id, 
                                            model_data_id : item.request_id, 
                                            parent_id : item.parent_id  
                                        }
                                )
            break;

            case 'article_data':

              this.navCtrl.push(EquipmentsArticleDescription, { id : item.request_id })

            break;
          
          }

        
        break;

      }

      
  }


  resetVaribles(){
    this.items = [];
    this.current_page = 1;
    this.have_more = false;
    this.search = '';
    this.is_request = false;
    this.is_searched = false;
    this.is_hold = false;
    this.reload = false;
    this.selected_count = 0;
  }

  // stateColor(state){
  //   let color = 'primary'

  //   switch(state){
  //     case 'edit':
  //       color = 'danger'
  //       break;
  //     case 'create':
  //       color = 'primary'
  //       break;
  //   }

  //   return color
  // }

  stateName(state){
    let name = ''

    switch(state){
      case 'edit':
        name = 'Edited'
        break;
      case 'create':
        name = 'Created'
        break;
    }

    return name
  }

}