import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { DocumentServiceProvider } from '../../../../../../providers/document-service/document-service';
import { InfrastructureServiceProvider } from '../../../../../../providers/infrastructure-service/infrastructure-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { config } from '../../../../../../app.config';
import { LinkedInfrastructureWithCI } from '../infrastructure';
import { InfrastructureCreate } from '../../../../../infrastructure/create/create';
import { Infrastructure } from '../../../../../infrastructure/list/list';
import { CreateInfrastructureModal } from '../../../../../common/infrastructure/infrastructure';

@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: [InfrastructureServiceProvider]
})

export class CreateLinkedInfrastructureForCI {
  
  public link:any = {relation_type : ''}
  item_header_class = "item item-ios list-header list-header-ios screen-header"
  input_class = "text-input text-input-ios"
  
  public infrastructure: any = [];
  current_page: number = 1;
  have_more: boolean = false;
  search: String = '';
  is_request:  boolean = false;
  is_searched:  boolean = false;
  is_hold:  boolean = false;
  reload:  boolean = false;

  constructor(public navCtrl: NavController,
		          public params: NavParams,
              public InfrastructureService: InfrastructureServiceProvider, 
              public ContactService: ContactServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.row_id = this.params.get('row_id');
              this.link.contact_id = this.params.get('contact_id');
  }

 
  getItems(ev: any) {

    this.current_page = 1;
    if(!this.is_searched){
      this.is_searched = true;
      setTimeout( ()=>{

        this.InfrastructureService.searchInfrastructure(this.search.toLowerCase())
        .then(data => {

          this.is_searched = false;
          if(data.length < config.per_page){
              this.have_more = false;
          } else {
            this.have_more = true;
          }
          this.infrastructure = data;
        });
      },500)
    }
  }  

  save(){
    this.Notification.presentLoader();
    this.ContactService.saveLinkedInfrastructureCI(this.link)
    .then(data => {
      this.Notification.dismissLoader();
      if( data.status ){
        this.navCtrl.push(LinkedInfrastructureWithCI , { row_id : this.params.get('row_id'), contact_id : this.params.get('contact_id') } )
      }
      
      this.Notification.presentToast(data.message);
    });
  }

  initLocation(location){
   this.link.name = location.name;
   this.link.location_id = location.id;
  }
   
  addLocation() {
      let options = [];

      options = options.concat([{
                      text: 'Create Infrastructure (Level 1)',
                      handler: () => {
                        this.navCtrl.push(InfrastructureCreate)  
                      }
                  },{
                      text: 'Select Level',
                      handler: () => {
                        this.navCtrl.push(CreateInfrastructureModal)
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
