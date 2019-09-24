import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams } from 'ionic-angular';
import { ContactServiceProvider } from '../../../../../../providers/contact-service/contact-service';
import { NotificationsHelper } from '../../../../../../helpers/notifications.helper';
import { config } from '../../../../../../app.config';
import { SessionHelper } from '../../../../../../helpers/session.helper';
import { CameraHelper } from '../../../../../../helpers/camera.helper';
import { ContactInternal } from '../../../list/list';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { CreateLinkedContactInternalForDocuments } from '../../../../../documents/links/contact_internal/create/create'

@Component({
  selector: 'page-create',
  templateUrl: 'upload.html',
  providers: [CameraHelper]
})

export class UploadProfilePictureCI {

	person:any = { name : '' , attributes : {} };
	image_data:any;
	employee:any;
	current_user:any;
	employee_data:any;
	header_class = "item item-ios list-header list-header-ios screen-header"
	input_class = "text-input text-input-ios"

	constructor( public navCtrl: NavController, 
				 public Notification: NotificationsHelper, 
				 public params: NavParams, 
				 public camera: CameraHelper,
				 public transfer: Transfer,
				 public session: SessionHelper,
				 public actionSheetCtrl: ActionSheetController,
				 public ContactService: ContactServiceProvider ) {
		this.current_user = this.session.getUser();
		this.image_data = "assets/img/dummy_user.png";
		this.employee = this.params.get('employee')
		console.log(this.employee);
		this.employee_data = this.params.get('employee_data')
		console.log(this.params)
	}

	fileTransfer: TransferObject = this.transfer.create();

	skip(){
		this.goTo();
	}


	openCamera(){
		this.camera.action( (image) => {
			this.upload(image);
		});
	}


	getPersonName(){
		let name = '';
		this.employee_data.persons.forEach( (per) => {
			if(per.id == this.employee.person){
				name = per.first_name + ' ' + per.last_name;
			}
		})
		return name 
	}

	upload(imageData) {
	    let options: FileUploadOptions = {
	                fileKey: 'file',
	                fileName: 'file.jpg',
	                mimeType: "multipart/form-data",
	                params : { 'fileName': 'file.jpg',
	                           'org_user_id' : this.current_user.user_id ,
	                           'employee_id' : this.employee.id ,
	                           'org_id' : this.current_user.user_org_id 
	                         }
	              }
	    this.Notification.presentLoader();

	    this.fileTransfer.upload(imageData, config.api_url + 'uploads/profile_pic_ci', options)
	    .then((data) => {
	   		this.Notification.dismissLoader();
	 	    this.Notification.presentToast("Profile picture updated successfully");
	 	    this.goTo();
	    }, (err) => {
	 		this.Notification.dismissLoader();
	      	this.Notification.presentToast("Unable to update profile picture");
	    })
    }

	goTo(){
		switch(this.params.get('page')){
			case 'linked_documents':
				this.navCtrl.push(CreateLinkedContactInternalForDocuments, { document_id: this.params.get('document_id') } );
			break;

			default:
	 	    	this.navCtrl.push(ContactInternal);
			break;
		}
	}

}
