// AUTHOR : HS
// CREATED : 2-04-2018
// DESCRIPTION : Used to list, delete, show infrastructure actions.

import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';

import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { InfrastructureDescription } from '../show/show';
import { InfrastructureLevels } from '../levels/levels';
import { InfrastructureCreate } from '../create/create';
import { Dashboard } from '../../dashboard/dashboard';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';

@Component({
  selector: 'page-infrastructure',
  templateUrl: 'list.html',
  providers: [InfrastructureServiceProvider,FunctionsHelper]
})

export class Infrastructure {
  
  public search = '';
  public location_id :any;
  public infrastructure:any;
  public backup: any;

  constructor( public navCtrl: NavController, public Notifications: NotificationsHelper, public actionSheetCtrl: ActionSheetController, public fns: FunctionsHelper, public InfrastructureService:InfrastructureServiceProvider) {

  }

  ionViewDidEnter() {
    this.getInfrastructureList();
  }

  getInfrastructureList(){
  	this.Notifications.presentLoader();
    this.InfrastructureService.getInfrastructureList(1,this.search)
    .then(data => {
  		this.Notifications.dismissLoader();
      this.infrastructure = data.locations;
      this.backup = this.infrastructure.slice();
     	this.location_id = data.location.id;
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

  view(id){
    this.navCtrl.push(InfrastructureDescription, { id : id , count : 0 })
  }

  next(t){
    let locations = []
    locations.push({ name: t.name , 
                     id : t.id , 
                     parent_id :  t.parent_id 
                  })
    this.navCtrl.push( InfrastructureLevels, {  
                                               parent_id : t.id, 
                                               parents : locations, 
                                               location_id : t.location_id  
                                            } )
  }

  delete(id){
  }

  back(){
    this.navCtrl.push(Dashboard);
  }

  create(){
     this.navCtrl.push(InfrastructureCreate, {location_id:this.location_id})  
  }

  getItems(ev: any) {

    let val = ev.target.value;
    
    if (val && val.trim() != '') {

      this.infrastructure = this.backup.filter((location) => {

       var condition = this.fns.match(location.name, val) ||
                       this.fns.match(location.barcode, val)

       return ( condition );

      })

    } else {
      this.infrastructure = this.backup
    }
  }

}
