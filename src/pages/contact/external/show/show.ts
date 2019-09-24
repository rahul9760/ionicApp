import { Component } from '@angular/core';
import { NavParams, NavController, Platform } from 'ionic-angular';

import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { ContactServiceProvider } from '../../../../providers/contact-service/contact-service';
import { LinkedDocumentsWithCE } from '../links/documents/documents';
import { LinkedAgendaWithCE } from '../links/agenda/agenda';
import { LinkedInfrastructureWithCE } from '../links/infrastructure/infrastructure';
import { LinkedEquipmentWithCE } from '../links/equipments/equipments';
import { FunctionsHelper } from '../../../../helpers/functions.helper';
import { SessionHelper } from '../../../../helpers/session.helper';
import { CameraHelper } from '../../../../helpers/camera.helper';
import { config } from '../../../../app.config';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Component({
  selector: 'page-contact-external-description',
  templateUrl: 'show.html',
  providers: [NotificationsHelper,FunctionsHelper,CallNumber,SocialSharing,CameraHelper]
})

export class ContactExternalDescription {

  private profile_pic: String = 'assets/img/dummy_user.png';
  private contact_id: number;
  private description: any;
  private organisations: any;
  private divisions: any;
  private current_user: any;
  private backup: any;
  private color: String = '#488aff';
  private is_edit : boolean = false;
  private reload:  boolean = false;
  private permission:  boolean = false;
  private segement: String = 'contact';
  private item_header_class: String = 'item item-ios list-header list-header-ios';
  private input_class = "text-input text-input-ios"

  constructor(
    private params: NavParams,
    private platform: Platform,
    private fns: FunctionsHelper,
    private session: SessionHelper,
    private camera: CameraHelper,
    private transfer: Transfer,
    private ContactService: ContactServiceProvider,
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    private Notifications: NotificationsHelper) {
     this.contact_id = this.params.get('id');
     this.current_user = this.session.getUser();
  }

  fileTransfer: TransferObject = this.transfer.create();

  ionViewWillEnter(){
    this.getDescription();
  }

  getDescription(){
    console.log("id sdfksdf",this.contact_id)    
    this.Notifications.presentLoader();

    this.ContactService.getContactExternal(this.contact_id)
    .then(data => {
      
      this.Notifications.dismissLoader();
      
      if(data.status){
        this.description = data;
        console.log("check",data)
        this.backup = this.fns.cloneObject(data);
        
        this.getProfilePic();
        this.getContactOrgs();
        this.getContactDivisions(data.contact.co_id);
      } else {

        //IF PERMISSION NOT FOUND
        if(data.permission){
          this.permission = data.permission;
        } else { // IF REQUEST NOT FOUND
          this.reload = true;
        }

        this.Notifications.presentToast(data.message);
      }

    });
  }

  attrName(id, type){
    var name = '';
    var attributes = this.description.attributes;
    switch(type){

          case 'person':
            name = attributes.person[id] ? attributes.person[id]['name'] : ''
          break;

          case 'contact':
            name = attributes.contact[id] ? attributes.contact[id]['name'] : ''
          break;

          case 'division':
            name = attributes.division[id] ? attributes.division[id]['name'] : ''
          break;

          case 'organization':
            name = attributes.organization[id] ? attributes.organization[id]['name'] : ''
          break;

    }

    return name;
  }


  edit(){
    this.color = '#1ea209'; 
    this.is_edit = true;  
    this.backup = Object.assign({}, this.description);
  }
  
  update(){
    this.ContactService.update( this.description )
    .then(data => {

      if (data.status){
        this.getDescription();
        this.resetVaribles();
      } else {

        this.Notifications.presentToast(data.message);
        
      }

    });
  }

  resetVaribles(){
    this.is_edit = false;
    this.color = '#488aff';
  }
  
  cancelEdition(){
    this.is_edit = false;
    this.color = '#488aff';
    this.description = this.backup;
  }
  
  link(type){
 
    switch(type){
          
          case 'document':
            this.navCtrl.push(LinkedDocumentsWithCE, { row_id : this.description.contact.cc_id , 
                                                       contact_id : this.description.contact.contact_id 
                                                    })
          break;
          
          case 'agenda':
            this.navCtrl.push(LinkedAgendaWithCE, {  row_id : this.description.contact.cc_id , 
                                                     contact_id : this.description.contact.contact_id 
                                                  })
          break;
          
          case 'infrastructure':
            this.navCtrl.push(LinkedInfrastructureWithCE, {  row_id : this.description.contact.cc_id , 
                                                             contact_id : this.description.contact.contact_id 
                                                          })
          break;

          case 'equipment':
            this.navCtrl.push(LinkedEquipmentWithCE, {  row_id : this.description.contact.cc_id , 
                                                        contact_id : this.description.contact.contact_id 
                                                      })
          break;
           
    }
    
  }

  access(attr_id){
    let attribute = this.getAccessType(attr_id)
    let icon = ''
    let icons = { 
                  'call' : 'call', 
                  'email' : 'mail', 
                  'link' : 'link', 
                  'skype' : 'logo-skype'
                }

    if( attribute ){
      icon = icons[attribute.access_type]
    }

    return icon;
  }

  accessAction(attr_id, value){
    let attribute = this.getAccessType(attr_id)

    if( attribute ){
      console.log(attribute.access_type);
      switch(attribute.access_type){
       
        case 'call':
          this.call(value)
        break;

        case 'email':
          this.email(value)
        break;

        case 'link':
          this.openlink(value)
        break;

      }

    }
    
  }

  getAccessType(attr_id){

    let attribute

    this.description.contact.access_types.forEach( d => {
      if( attr_id == d.attribute_id ){
        attribute = d
      }
    });

    return attribute
  }

  call(number){
    this.callNumber.callNumber(number, true)
    .then(res => 
      console.log('Launched dialer!', res))
    .catch(err =>
       console.log('Error launching dialer', err)
    );
  }

  email(value){

    this.socialSharing.shareViaEmail('Body', 'VelvetFM Contact External', [value] ).then(() => {
      
    }).catch((err) => {
      
    });

  }

  openlink(value){
    this.iab.create( 'http://' + value );
  }  

  getProfilePic(){
      if(this.description.contact.profile_pic){
        this.profile_pic =  config.api_url + 
                    'documents/download?fileName=' + 
                    this.description.contact.profile_pic + 
                    '&token='+this.session.getToken() + 
                    '&type=profile_pic_ce'

        if(this.platform.is('android') || this.platform.is('ios'))  {
          this.profile_pic += '&timestamp=' + new Date().getTime();
        }
      }
  }

  openCamera(){
    this.camera.action( (image) => {
      this.upload(image);
    });
  }

  upload(imageData) {
      let options: FileUploadOptions = {
                  fileKey: 'file',
                  fileName: 'file.jpg',
                  mimeType: "multipart/form-data",
                  params : { 'fileName': 'file.jpg',
                             'org_user_id' : this.current_user.user_id ,
                             'employee_id' : this.contact_id ,
                             'org_id' : this.current_user.user_org_id 
                           }
                }
      this.Notifications.presentLoader();

      this.fileTransfer.upload(imageData, config.api_url + 'uploads/profile_pic_ce', options)
      .then((data) => {
        this.Notifications.dismissLoader();
        this.getDescription();
        this.Notifications.presentToast("Profile picture updated successfully");
        
      }, (err) => {
        this.Notifications.dismissLoader();
          this.Notifications.presentToast("Unable to update profile picture");
      })
  }


  getContactOrgs(){   
    this.ContactService.getContactOrgs(1,'')
    .then(data => {
      if( data.error == undefined ){
        this.organisations = data;
      } else {
        this.getContactOrgs();
      }
    });
  }


  getContactDivisions(id){
    
    this.ContactService.getContactDivisionsAndOrgAttrs(id)
    .then(data => {

      if( data.error == undefined ){
      
        this.divisions = data.divisions;
        this.description.contact.org_attrs_data = data.org_attributes;
      
        if(this.description.contact.co_id !== this.backup.contact.co_id) {
         this.description.contact.division_attrs_data = [];
        }

      } else {
        //this.getContactDivisions(id);
      }

    });
  }

  getContactDivisionAttrs(id){
    
    this.ContactService.getContactDivisionAttrs(id)
    .then(data => {

      if( data.error == undefined ){
      
        this.description.contact.division_attrs_data = data.division_attrs;

      } else {
        // this.getContactDivisionAttrs(id);
      }

    });
  }

}
