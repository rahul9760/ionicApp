// AUTHOR : HS
// CREATED : 11-04-2018
// DESCRIPTION : Used to list, delete, show the levels.

import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { InfrastructureCreate } from '../create/create';
import { Infrastructure } from '../list/list';
import { InfrastructureDescription } from '../show/show';

import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';

@Component({
  selector: 'page-levels',
  templateUrl: 'levels.html',
  providers: [InfrastructureServiceProvider, ,FunctionsHelper]
})

export class InfrastructureLevels {

  public search = '';
  public count;
  public parent_id;
  public location_id;
  public infrastructure:any;
  public parents:any = [];
  public backup: any;

  constructor(
          public navCtrl: NavController, 
  				public params: NavParams, 
          public Notifications: NotificationsHelper, 
  				public actionSheetCtrl: ActionSheetController, 
          public fns: FunctionsHelper, 
  				public InfrastructureService:InfrastructureServiceProvider
  			) {
  	this.getInfrastructureList();
  }

  getInfrastructureList( back = false ){
    this.parents = this.params.get('parents');
    this.parent_id = this.params.get('parent_id');
    this.location_id = this.params.get('location_id');
    this.count = this.params.get('count') || 0;

  	this.Notifications.presentLoader();
    let where = 'parent_id=' + this.parent_id + '&location_id=' + this.location_id;
    this.InfrastructureService.getInfrastructureList(1,this.search, where)
    .then(data => {
      this.Notifications.dismissLoader();
      if(data && data.location.name && data.location.location_name !=0)
      {
        this.infrastructure = data;
      }
        
     
       this.backup = data.locations.slice()
      if(this.parent_id > 0){
          this.parents = [{ 
                            name: data.parent_location.name , 
                            level_name: data.location.name , 
                            id : data.parent_location.id , 
                            parent_id : data.parent_location.parent_id 
                         }]
      }
      if(!back){
        this.count++;
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
    if(this.count < (this.infrastructure.levels_count - 1) ){
      this.params.data.parent_id = t.id;
      this.params.data.location_id = t.location_id;
      this.params.data.parents = [{   
                                    name: t.name , 
                                    id : t.id , 
                                    parent_id :  t.parent_id 
                                }];

      this.navCtrl.push(InfrastructureLevels,{ parent_id : t.id, 
                                               parents : this.params.data.parents , 
                                               location_id : t.location_id ,
                                               count : this.count 
                                             })
    } else {
      this.view(t.id)
    }
  }

  view(id){
    this.navCtrl.push(InfrastructureDescription, { id : id , 'parents' : this.parents, 'count' : this.count })
  }

  delete(id){
    
  }

  //name conversion:singular to plural eg country = countries, state = states 

  location(name){
    return name ? name[name.length - 1] == 'y' ? 
            name.slice(0, -1) + 'ies' : name + 's' : 'Infrastructure';
  }

  back(parent, index){
    this.params.data.parent_id = parent.parent_id;
    this.params.data.parents = [];
    this.count = this.count - 1;
    this.params.data.count = this.count;
    parent.parent_id == 0 ? this.navCtrl.push(Infrastructure) :  this.getInfrastructureList(true)
  }  

  create(){
     this.navCtrl.push(InfrastructureCreate, { 
                                                location_id: this.infrastructure.location.id, 
                                                parent_id : this.params.get('parent_id') ,
                                                count : this.count
                                            })  
  }

  getItems(ev: any){
    let val = ev.target.value;
    
    if (val && val.trim() != '') {

      this.infrastructure.locations = this.backup.filter((location) => {

       var condition = this.fns.match(location.name, val) ||
                       this.fns.match(location.barcode, val)

       return ( condition );

      })

    } else {
      this.infrastructure.locations = this.backup
    }
  }

}
