// AUTHOR : HS
// CREATED : 2-04-2018
// DESCRIPTION : Used to show the infrastructure description.

import { Component } from '@angular/core';
import { NavController, 
         ActionSheetController, 
         NavParams } from 'ionic-angular';

import { InfrastructureServiceProvider } from '../../../providers/infrastructure-service/infrastructure-service';
import { NotificationsHelper } from '../../../helpers/notifications.helper';
import { GoogleMapHelper } from '../../../helpers/gmap.helper';
import { FunctionsHelper } from '../../../helpers/functions.helper';
import { InfrastructureLevels } from '../levels/levels';
import { LinkedDocumentsWithInfrastructure } from '../links/documents/documents';
import { LinkedAgendaWithInfrastructure } from '../links/agenda/agenda';
import { LinkedContactExternalWithInfrastructure } from '../links/contact_external/contact_external';
import { LinkedContactInternalWithInfrastructure } from '../links/contact_internal/contact_internal';
import { LinkedEquipmentWithInfrastructure } from '../links/equipments/equipments';


@Component({
  selector: 'page-infrastructure',
  templateUrl: 'show.html',
  providers: [InfrastructureServiceProvider,GoogleMapHelper,FunctionsHelper]
})

export class InfrastructureDescription {
  public search = '';
  public is_edit = false;
  public count = 0;
  public backup:any;
  public infrastructure:any;
  public color: String = '#488aff';
  public item_header_class: String = 'item item-ios list-header list-header-ios';
  public input_class = "text-input text-input-ios"

  constructor(
          public navCtrl: NavController, 
          public params: NavParams,
  				public gmap: GoogleMapHelper, 
          public Notifications: NotificationsHelper, 
          public fns: FunctionsHelper, 
  				public actionSheetCtrl: ActionSheetController, 
  				public InfrastructureService:InfrastructureServiceProvider
  			) {
      this.getInfrastructure()
      this.count = this.params.get('count')
  }

  ionViewDidLoad() {
      this.gmap.loadMap({
                        camera: {
                          target: {
                            lat: 43.0741904,
                            lng: -89.3809802
                          },
                          zoom: 18,
                          tilt: 30
                        }
                      });
  }

  getInfrastructure(){
  	this.Notifications.presentLoader();
    
    this.InfrastructureService.getInfrastructure(this.params.get('id'))
    .then(data => {
      this.Notifications.dismissLoader();
      console.log("jdsfsdfd",data)
     	this.infrastructure = data;
    });
  }

  attrName(id){
    return this.infrastructure.location_attrs[id] ? this.infrastructure.location_attrs[id]['name'] : '-'
  }

  next(){
   // let locations = this.params.get('parents') || []
    let locations = []
    locations.push({ name: this.infrastructure.location.name ,
                     id : this.infrastructure.location.id , 
                     parent_id :  this.infrastructure.location.parent_id })
    this.navCtrl.push( InfrastructureLevels, { parent_id : this.infrastructure.location.id, 'parents' : locations , 'location_id' : this.infrastructure.location.location_id, 'count' : this.count  } )
  }

   link(type){
    
    switch(type){

          case 'contact_external':
            this.navCtrl.push(LinkedContactExternalWithInfrastructure, { location_id : this.params.get('id') })
          break;

          case 'contact_internal':
            this.navCtrl.push(LinkedContactInternalWithInfrastructure, { location_id : this.params.get('id') })
          break;
          
          case 'document':
            this.navCtrl.push(LinkedDocumentsWithInfrastructure, { location_id : this.params.get('id') })
          break;
          
          case 'agenda':
            this.navCtrl.push(LinkedAgendaWithInfrastructure, { location_id : this.params.get('id') })
          break;
          
          case 'equipment':
            this.navCtrl.push(LinkedEquipmentWithInfrastructure, { location_id : this.params.get('id') })
          break;
           
    }
    
  }

  edit(){
    this.color = '#1ea209'; 
    this.is_edit = true;  
    this.backup = this.fns.cloneObject(this.infrastructure);
  }

  cancelEdition(){
    this.resetVars()
    this.infrastructure = this.backup;
  }

  resetVars(){
    this.is_edit = false;
    this.color = '#488aff';
  }

  update(){
    this.Notifications.presentLoader();
    
    this.InfrastructureService.update(this.infrastructure)
    .then(data => {
      this.Notifications.dismissLoader();
      this.resetVars();
      this.getInfrastructure();
    });
  }

}
