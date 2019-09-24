import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../../../../providers/tasks-service/tasks-service';
import { ContactServiceProvider } from '../../../../../providers/contact-service/contact-service';
import { DocumentServiceProvider } from '../../../../../providers/document-service/document-service';
import { InfrastructureServiceProvider } from '../../../../../providers/infrastructure-service/infrastructure-service';
import { NotificationsHelper } from '../../../../../helpers/notifications.helper';
import { AgendaDescription } from '../../../show/show';
import { config } from '../../../../../app.config';
import { ContactExternalDescription } from '../../../../contact/external/show/show';
import { LinkedInfrastructureWithAgenda } from '../infrastructure';
import { Infrastructure } from '../../../../infrastructure/list/list';
import { InfrastructureCreate } from '../../../../infrastructure/create/create';
import { CreateInfrastructureModal } from '../../../../common/infrastructure/infrastructure';

@Component({
  selector: 'page-agenda',
  templateUrl: 'create.html',
  providers: [TasksServiceProvider,InfrastructureServiceProvider]
})

export class CreateLinkedInfrastructureForAgenda {
  
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
              public TasksService: TasksServiceProvider, 
              public InfrastructureService: InfrastructureServiceProvider, 
              public ContactService: ContactServiceProvider, 
              public DocumentService: DocumentServiceProvider, 
              public alertCtrl: AlertController, 
              public Notification: NotificationsHelper, 
              public actionSheetCtrl: ActionSheetController) {
              this.link.task_id = this.params.get('task_id');
              //this.getDocuments();
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
    this.TasksService.saveLinkedInfrastructure(this.link)
    .then(data => {
      this.Notification.dismissLoader();
      if( data.status ){
        this.navCtrl.push(LinkedInfrastructureWithAgenda , { task_id : this.params.get('task_id')} )
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
