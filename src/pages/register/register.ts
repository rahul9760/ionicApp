import { Component,NgZone } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { NotificationsHelper } from '../../helpers/notifications.helper';
import { SessionHelper } from '../../helpers/session.helper';
import { ValidationHelper } from '../../helpers/validation.helper';
import { Login2Page } from '../login/login2/login2';

import {
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { config } from '../../app.config';

import { Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers : [
                AuthServiceProvider,
                Camera,
                Transfer,
                GlobalVarsProvider,
                NotificationsHelper,
                SessionHelper
              ]
})
export class RegisterPage {

  public register_form: FormGroup;
  EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  public type1 = 'password'; 
  public showPass1 = false; 
  public type2 = 'password'; 
  public showPass2 = false; 
  public password_eye = "ios-eye-off-outline";
  public confirm_password_eye = "ios-eye-off-outline";

  countryList: any;

  public register: any = { user_name:"", password:"", confirm_password:"", name:"", email:"", contact:"", address:"", country:"", gmail:"", languages:"" };

  image_data:any;

  languages: Array<{id: number, name: string}>;

  constructor(
    public globalVars: GlobalVarsProvider,
    public auth: AuthServiceProvider,
    public navCtrl: NavController,
    private camera: Camera,
    private transfer: Transfer,
    public actionSheetCtrl: ActionSheetController,
    public Notifications: NotificationsHelper,
    public validation:ValidationHelper,
    private _ngZone: NgZone,
    public Session: SessionHelper,
    public http: Http,
    public loadingCtrl: LoadingController) {
      this.languages = [
        {id : 1, name : 'English'},
        {id : 2, name : 'French'},
        {id : 3, name : 'German'},
        {id : 4, name : 'Dutch'}
      ]

      this.countryList = [{"name":"Afghanistan"},{"name":"Åland Islands"},{"name":"Albania"},{"name":"Algeria"},{"name":"American Samoa"},{"name":"Andorra"},{"name":"Angola"},{"name":"Anguilla"},{"name":"Antarctica"},{"name":"Antigua and Barbuda"},{"name":"Argentina"},{"name":"Armenia"},{"name":"Aruba"},{"name":"Australia"},{"name":"Austria"},{"name":"Azerbaijan"},{"name":"Bahamas"},{"name":"Bahrain"},{"name":"Bangladesh"},{"name":"Barbados"},{"name":"Belarus"},{"name":"Belgium"},{"name":"Belize"},{"name":"Benin"},{"name":"Bermuda"},{"name":"Bhutan"},{"name":"Bolivia (Plurinational State of)"},{"name":"Bonaire, Sint Eustatius and Saba"},{"name":"Bosnia and Herzegovina"},{"name":"Botswana"},{"name":"Bouvet Island"},{"name":"Brazil"},{"name":"British Indian Ocean Territory"},{"name":"United States Minor Outlying Islands"},{"name":"Virgin Islands (British)"},{"name":"Virgin Islands (U.S.)"},{"name":"Brunei Darussalam"},{"name":"Bulgaria"},{"name":"Burkina Faso"},{"name":"Burundi"},{"name":"Cambodia"},{"name":"Cameroon"},{"name":"Canada"},{"name":"Cabo Verde"},{"name":"Cayman Islands"},{"name":"Central African Republic"},{"name":"Chad"},{"name":"Chile"},{"name":"China"},{"name":"Christmas Island"},{"name":"Cocos (Keeling) Islands"},{"name":"Colombia"},{"name":"Comoros"},{"name":"Congo"},{"name":"Congo (Democratic Republic of the)"},{"name":"Cook Islands"},{"name":"Costa Rica"},{"name":"Croatia"},{"name":"Cuba"},{"name":"Curaçao"},{"name":"Cyprus"},{"name":"Czech Republic"},{"name":"Denmark"},{"name":"Djibouti"},{"name":"Dominica"},{"name":"Dominican Republic"},{"name":"Ecuador"},{"name":"Egypt"},{"name":"El Salvador"},{"name":"Equatorial Guinea"},{"name":"Eritrea"},{"name":"Estonia"},{"name":"Ethiopia"},{"name":"Falkland Islands (Malvinas)"},{"name":"Faroe Islands"},{"name":"Fiji"},{"name":"Finland"},{"name":"France"},{"name":"French Guiana"},{"name":"French Polynesia"},{"name":"French Southern Territories"},{"name":"Gabon"},{"name":"Gambia"},{"name":"Georgia"},{"name":"Germany"},{"name":"Ghana"},{"name":"Gibraltar"},{"name":"Greece"},{"name":"Greenland"},{"name":"Grenada"},{"name":"Guadeloupe"},{"name":"Guam"},{"name":"Guatemala"},{"name":"Guernsey"},{"name":"Guinea"},{"name":"Guinea-Bissau"},{"name":"Guyana"},{"name":"Haiti"},{"name":"Heard Island and McDonald Islands"},{"name":"Holy See"},{"name":"Honduras"},{"name":"Hong Kong"},{"name":"Hungary"},{"name":"Iceland"},{"name":"India"},{"name":"Indonesia"},{"name":"Côte d'Ivoire"},{"name":"Iran (Islamic Republic of)"},{"name":"Iraq"},{"name":"Ireland"},{"name":"Isle of Man"},{"name":"Israel"},{"name":"Italy"},{"name":"Jamaica"},{"name":"Japan"},{"name":"Jersey"},{"name":"Jordan"},{"name":"Kazakhstan"},{"name":"Kenya"},{"name":"Kiribati"},{"name":"Kuwait"},{"name":"Kyrgyzstan"},{"name":"Lao People's Democratic Republic"},{"name":"Latvia"},{"name":"Lebanon"},{"name":"Lesotho"},{"name":"Liberia"},{"name":"Libya"},{"name":"Liechtenstein"},{"name":"Lithuania"},{"name":"Luxembourg"},{"name":"Macao"},{"name":"Macedonia (the former Yugoslav Republic of)"},{"name":"Madagascar"},{"name":"Malawi"},{"name":"Malaysia"},{"name":"Maldives"},{"name":"Mali"},{"name":"Malta"},{"name":"Marshall Islands"},{"name":"Martinique"},{"name":"Mauritania"},{"name":"Mauritius"},{"name":"Mayotte"},{"name":"Mexico"},{"name":"Micronesia (Federated States of)"},{"name":"Moldova (Republic of)"},{"name":"Monaco"},{"name":"Mongolia"},{"name":"Montenegro"},{"name":"Montserrat"},{"name":"Morocco"},{"name":"Mozambique"},{"name":"Myanmar"},{"name":"Namibia"},{"name":"Nauru"},{"name":"Nepal"},{"name":"Netherlands"},{"name":"New Caledonia"},{"name":"New Zealand"},{"name":"Nicaragua"},{"name":"Niger"},{"name":"Nigeria"},{"name":"Niue"},{"name":"Norfolk Island"},{"name":"Korea (Democratic People's Republic of)"},{"name":"Northern Mariana Islands"},{"name":"Norway"},{"name":"Oman"},{"name":"Pakistan"},{"name":"Palau"},{"name":"Palestine, State of"},{"name":"Panama"},{"name":"Papua New Guinea"},{"name":"Paraguay"},{"name":"Peru"},{"name":"Philippines"},{"name":"Pitcairn"},{"name":"Poland"},{"name":"Portugal"},{"name":"Puerto Rico"},{"name":"Qatar"},{"name":"Republic of Kosovo"},{"name":"Réunion"},{"name":"Romania"},{"name":"Russian Federation"},{"name":"Rwanda"},{"name":"Saint Barthélemy"},{"name":"Saint Helena, Ascension and Tristan da Cunha"},{"name":"Saint Kitts and Nevis"},{"name":"Saint Lucia"},{"name":"Saint Martin (French part)"},{"name":"Saint Pierre and Miquelon"},{"name":"Saint Vincent and the Grenadines"},{"name":"Samoa"},{"name":"San Marino"},{"name":"Sao Tome and Principe"},{"name":"Saudi Arabia"},{"name":"Senegal"},{"name":"Serbia"},{"name":"Seychelles"},{"name":"Sierra Leone"},{"name":"Singapore"},{"name":"Sint Maarten (Dutch part)"},{"name":"Slovakia"},{"name":"Slovenia"},{"name":"Solomon Islands"},{"name":"Somalia"},{"name":"South Africa"},{"name":"South Georgia and the South Sandwich Islands"},{"name":"Korea (Republic of)"},{"name":"South Sudan"},{"name":"Spain"},{"name":"Sri Lanka"},{"name":"Sudan"},{"name":"Suriname"},{"name":"Svalbard and Jan Mayen"},{"name":"Swaziland"},{"name":"Sweden"},{"name":"Switzerland"},{"name":"Syrian Arab Republic"},{"name":"Taiwan"},{"name":"Tajikistan"},{"name":"Tanzania, United Republic of"},{"name":"Thailand"},{"name":"Timor-Leste"},{"name":"Togo"},{"name":"Tokelau"},{"name":"Tonga"},{"name":"Trinidad and Tobago"},{"name":"Tunisia"},{"name":"Turkey"},{"name":"Turkmenistan"},{"name":"Turks and Caicos Islands"},{"name":"Tuvalu"},{"name":"Uganda"},{"name":"Ukraine"},{"name":"United Arab Emirates"},{"name":"United Kingdom of Great Britain and Northern Ireland"},{"name":"United States of America"},{"name":"Uruguay"},{"name":"Uzbekistan"},{"name":"Vanuatu"},{"name":"Venezuela (Bolivarian Republic of)"},{"name":"Viet Nam"},{"name":"Wallis and Futuna"},{"name":"Western Sahara"},{"name":"Yemen"},{"name":"Zambia"},{"name":"Zimbabwe"}];
    
      this.register_form = new FormGroup({
        user_name: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/),Validators.pattern(/^[a-zA-Z]*$/)]),
        password: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/), Validators.minLength(6), Validators.maxLength(10)]),
        confirm_password: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/), Validators.minLength(6), Validators.maxLength(10)]),
        name: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/),Validators.pattern(/^[a-zA-Z]*$/)]),
        email: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/), Validators.pattern(this.EMAIL_REGEX)]),
        contact: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/), Validators.minLength(10), Validators.maxLength(13)]),
        address: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
        country: new FormControl("", [Validators.required]),
        gmail: new FormControl("", [Validators.required,Validators.pattern(/^\S*$/), Validators.pattern(this.EMAIL_REGEX)]),
        languages: new FormControl("", [Validators.required])
      });

    }

  fileTransfer: TransferObject = this.transfer.create();

  user_register(formData){
    this.Notifications.presentLoader();
    if (!formData.valid) {
      this.register_form.get('user_name').markAsDirty();
      this.register_form.get('password').markAsDirty();
      this.register_form.get('confirm_password').markAsDirty();
      this.register_form.get('name').markAsDirty();
      this.register_form.get('email').markAsDirty();
      this.register_form.get('contact').markAsDirty();
      this.register_form.get('address').markAsDirty();
      this.register_form.get('gmail').markAsDirty();
      this.register_form.get('languages').markAsDirty();

      this.Notifications.dismissLoader();
    }
    else{
      let password = this.register_form.controls["password"].value;
      let confirm_password = this.register_form.controls["confirm_password"].value;

      console.log("Password :"+password+" && confirm_password :"+confirm_password);

      this.register = {
        user_name:this.register_form.controls["user_name"].value, 
        password:this.register_form.controls["password"].value, 
        confirm_password:this.register_form.controls["confirm_password"].value, 
        name:this.register_form.controls["name"].value, 
        email:this.register_form.controls["email"].value, 
        contact:this.register_form.controls["contact"].value, 
        address:this.register_form.controls["address"].value, 
        country:this.register_form.controls["country"].value, 
        gmail:this.register_form.controls["gmail"].value, 
        languages:this.register_form.controls["languages"].value
      };

      console.log("Register Form :"+JSON.stringify(this.register));

      if(password == confirm_password){
        this.auth.register(this.register)
        .then(data => {
            
            if(data.main_success){
              this.Notifications.dismissLoader();
              this.Notifications.presentToast("Registered successfully");
              this.navCtrl.setRoot(Login2Page);
              
              if(this.image_data != undefined){
                let options: FileUploadOptions = {
                  fileKey: 'file',
                  fileName: 'file.jpg',
                  mimeType: "multipart/form-data",
                  params : { 'fileName': 'file.jpg', 'org_user_id' : data.org_user_id , 'org_id' : data.org_id }
                };

                this.Notifications.setToastFile('Uploading Profile Picture'); 

                this.fileTransfer.onProgress((progressEvent: any ) => {
                  if (progressEvent.lengthComputable) {
                    let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    console.log("Uploading Profile Picture :"+progress);
                    this.Notifications.setToastFile('Uploading Profile Picture (' + progress + '%)')
                    this._ngZone.run(() => {});
                  }
                });
                
                this._ngZone.run(() => { 
                  this.uploadImage(options);
                });
              }
              else{
                console.log("No Image Dismiss Loader !!!");
              }
              
            } else if(!data.main_success) {
              this.Notifications.dismissLoader();
              this.Notifications.presentToast(data.main_message);
            }
        });
      }
      else{
        this.Notifications.dismissLoader();
        this.Notifications.presentToast('Password not match');
      }
    }

  }

  remove_image(){
    this.image_data = "";
    console.log("Image Data :"+this.image_data);
  }

  showPassword_1() {
    this.showPass1 = !this.showPass1;
    if(this.showPass1){
      this.type1 = 'text';
      this.password_eye = "ios-eye-outline";
    } else {
      this.type1 = 'password';
      this.password_eye = "ios-eye-off-outline";
    }
  }

  showPassword_2() {
    this.showPass2 = !this.showPass2;
    if(this.showPass2){
      this.type2 = 'text';
      this.confirm_password_eye = "ios-eye-outline";
    } else {
      this.type2 = 'password';
      this.confirm_password_eye = "ios-eye-off-outline";
    }
  }

  uploadImage(options){
    this.fileTransfer.upload(this.image_data, config.api_url + 'auth/uploads', options)
      .then((data) => {
        console.log("Upload Response :"+JSON.stringify(data));
        this.Notifications.setToastFile('Uploaded Successfully');
        this.Notifications.dismissToaster();
      }, (err) => {
        console.log("Upload Error :"+JSON.stringify(err));
        this.Notifications.setToastFile('Uploading Failed');
        alert('Failed')
        this.Notifications.dismissToaster();
    })
  }

  presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create({
          title: 'Choose one option',
          buttons: [
          {
              text: 'Camera',
              role: 'destructive',
              handler: () => {
                this.captureImage(this.options(this.camera.PictureSourceType.CAMERA));
            }
          },{
              text: 'Gallery',
              handler: () => {
                this.captureImage(this.options(this.camera.PictureSourceType.PHOTOLIBRARY));
              }
          },{
          text: 'Cancel',
          role: 'cancel'
      }]
    });
    actionSheet.present();
  }

  captureImage(camera_options){
      this.camera.getPicture(camera_options).then((imageData) => {
      this.image_data = imageData;
      // this.upload(imageData);
    }, (err) => {
      alert(err);
    });

  }

  options(source_type){
    let camera_options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: source_type,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit:true,
        correctOrientation:true,
        targetWidth: 500,
        targetHeight: 500
    }
    return camera_options;
  }

  upload(imageData) {
    
    let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: 'name.jpg',
          mimeType: "multipart/form-data",
          params : {'fileName': 'name.jpg'}
        }

    this.fileTransfer.upload(imageData, config.api_url + 'auth/uploads', options)
    .then((data) => {
      alert('success');
    }, (err) => {
       alert(err);
    })
  }
}
