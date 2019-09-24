import { Component,ViewChild , NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar } from 'ionic-angular';
import { DocumentsList} from '../../documents_list/documents_list';
import { DocumentsListView} from '../../documents_list_view/documents_list_view';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { SessionHelper } from '../../../../helpers/session.helper';

import { ActionSheetController } from 'ionic-angular';
import { config } from '../../../../app.config';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@Component({
  selector: 'page-create-screen3',
  templateUrl: 'screen3.html',
  providers: [File,FilePath,Transfer]
})

export class Screen3 {

  @ViewChild(Navbar) navBar: Navbar;
  categories_attrs: any
  category: any = []
  subcategory: any = []
  sub_categories_attrs: any
  documents: any = []
  image_data:any = []
  files:any = []
  tempfiles:any = []
  urls:any 
  fileTransfer:any 
  category_id:String = '';
  subcategory_id:String = '';
  designation:String = '';
  lastImage:String = '';
  tags:any;
  
  category_data: any = {}
  subcategory_data: any = {}
  category_files_data: any = {}
  subcategory_files_data: any = {}
  ca_f: any = {}
  select_files: any = {}

  constructor(public navCtrl: NavController,
              public _ngZone: NgZone,
      			  public DocumentService: DocumentServiceProvider,
      			  public Notifications: NotificationsHelper,
              private transfer: Transfer,
              public actionSheetCtrl: ActionSheetController,
              public filePath: FilePath,
              public file: File,
              public session: SessionHelper,
      			  public navParams: NavParams) {
   
    this.category_data = this.navParams.data.category_data;
    this.category_id = this.navParams.data.category_id;
    this.subcategory_data = this.navParams.data.subcategory_data;
    this.subcategory_id = this.navParams.data.subcategory_id;
    this.designation = this.navParams.data.designation;
    this.categories_attrs = this.navParams.data.attributes.categories_attrs;
    this.sub_categories_attrs = this.navParams.data.attributes.sub_categories_attrs;    
    this.tags = this.navParams.data.tags;    
    console.log("uploading running here");
  }

  // fileTransfer: TransferObject = this.transfer.create();

  ionViewDidLoad() {

    this.loadFiles();

  }

  loadFiles(){

    this.files = this.session.getUrl();
    var opFiles = [];
    this.select_files = {};
    this.category_files_data = {};
    this.subcategory_files_data = {};

    if(this.files && this.files.length > 0 ){
      this.files.forEach(f=> {
        opFiles.push({
                      'path' : f,
                      'is_disabled' : false
                    })
      });

    
      Object.keys(this.categories_attrs).forEach(d=> {
          this.select_files[this.categories_attrs[d].id+'_'+'c'] = opFiles ;
      });
    
      Object.keys(this.sub_categories_attrs).forEach(d=> {
          this.select_files[this.sub_categories_attrs[d].id+'_'+'s'] = opFiles ;
      });
    }
  }

  userLang(data,type = 'json'){
  	var current_user = this.session.getUser();
  	return JSON.parse(data)[current_user.user_lang_id]
  }

  save(){
    this.Notifications.presentLoader();

    if(this.navParams.data.doc_id){
      this.Notifications.dismissLoader();
      this.uploadQueue(this.navParams.data.doc_id);
      this.navCtrl.push(DocumentsListView,{ id : this.navParams.data.doc_id});
    } else {
        this.DocumentService.create( {  category : this.category_data,
                                        category_id :  this.category_id,
                                        designation :  this.designation,
                                        subcategory_id :  this.subcategory_id,
                                        subcategory : this.subcategory_data,
                                        subcategory_files : this.subcategory_files_data,
                                        tags : this.tags,
                                        category_files : this.category_files_data,
                                        row_id : this.navParams.data.row_id,
                                        page : this.navParams.data.page,
                                        request_id : this.navParams.data.request_id } )
      .then(data => {
        this.Notifications.dismissLoader();
        if(data.main_success){
          this.uploadQueue(data.doc_id);
          this.navCtrl.push(DocumentsList);
        } else {
          this.Notifications.presentToast(data.main_message);
        }
      });
    }
   
  }


  selectFile(id,t){
    var nid = id + '_' + t;
    Object.keys(this.select_files).forEach(d=> {
       
       if( d !== nid ){
          this.select_files[d].forEach((f,i)=> {
            if(t == 'c'){
              if ( this.category_files_data[id].indexOf(i + '') !== -1 ){
                this.select_files[d][i].is_disabled = true;
              }
            } else {
              if ( this.subcategory_files_data[id].indexOf(i + '') !== -1 ){
                this.select_files[d][i].is_disabled = true;
              }
            }
            
          });
       }

    });

  }

  count(r,a = ['file','image'],c = 0){
    for (var v in r) {
      if( a.indexOf( r[v]['attr_type'] ) !== -1){
        c++;
      }
    }
    return c;
  }

  getName(f){
    var _arr = f.split('/');
    return _arr[_arr.length - 1];
  }

  upload(uri, d, doc_id, i , u = 0 , f = 0  ) {
  
    var keys = Object.keys(this.ca_f);
    var is_cat = keys[i][ keys[i].length - 1 ] == 'c' ? true : false; 
    i = i+1;

    var next = keys[i];
    var current_user = this.session.getUser();
    var fileTransfer:TransferObject = this.transfer.create();

    var params = { 'fileName': this.getName(uri) ,
                   'org_user_id' : current_user.user_id ,
                   'org_id' : current_user.user_org_id,
                   'doc_id' : doc_id,
                   'req_id' : '',
                   'type' : ''
                  }

    if(is_cat){
      params.req_id = d;
      params.type = 'cat';
    } else {
      params.req_id = d;
      params.type = 'subcat';
    }

    let options: FileUploadOptions = {
              fileKey: 'file',
              fileName: this.getName(uri),
              mimeType: "multipart/form-data",
              params : params
            }

      
      fileTransfer.onProgress((progressEvent: any ) => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length, progress)
                this._ngZone.run(() => { });
          }
      });

      fileTransfer.upload( uri, config.api_url + 'auth/document_downloads', options)
      .then((data) => {
        u = u + 1;
        this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length)
        this._ngZone.run(() => { });
        if(next){
         this.upload(this.ca_f[next], next.split('_')[0], doc_id, i, u , f);
        } else {
          this.Notifications.dismissToaster()
        }

      }, (err) => {
        f = f + 1;
        this.Notifications.setToasterContent(u, f, Object.keys(this.ca_f).length);
        this._ngZone.run(() => { });
        if(next){
         this.upload(this.ca_f[next], next.split('_')[0], doc_id, i, u , f);
        } else {
          this.Notifications.dismissToaster()
        }

      })  

  }

  uploadQueue(doc_id){

    var i = 0

    Object.keys(this.category_files_data).forEach(d=> {
      this.category_files_data[d].forEach(e=> {
        var indx = this.category_files_data[d].indexOf(e);
        this.ca_f[d+'_'+indx+'_c'] = this.files[ e ];
      });
    });

    Object.keys(this.subcategory_files_data).forEach(s=> {
      this.subcategory_files_data[s].forEach(si=> {
        var indx = this.subcategory_files_data[s].indexOf(si);
        this.ca_f[s+'_'+indx+'_s'] = this.files[ si ];
      });
    });

    var fst = Object.keys(this.ca_f);

    if( fst.length > 0 ){
      var fst_key = fst[i];

      this.Notifications.uploadingToast('Uploading Files');

      this.upload(this.ca_f[fst_key], fst_key.split('_')[i], doc_id, i);
    }

  }

  presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create({
          title: 'Choose one option',
          buttons: [
          {
              text: 'Save',
              handler: () => {
                this.save();
            }
          },
          {
              text: 'Reset',
              handler: () => {
                this.loadFiles();
            }
          },{
          text: 'Cancel',
          role: 'cancel'
      }]
    });
    actionSheet.present();
  }


}