import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar } from 'ionic-angular';
import { Screen2 } from '../../documents_create/screen2/screen2';
import { DocumentsList} from '../../documents_list/documents_list';
import { DocumentServiceProvider } from '../../../../providers/document-service/document-service';
import { NotificationsHelper } from '../../../../helpers/notifications.helper';
import { SessionHelper } from '../../../../helpers/session.helper';


@Component({
  selector: 'page-create-screen1',
  templateUrl: 'screen1.html'
})

export class Screen1 {
  @ViewChild(Navbar) navBar: Navbar;
  categories: any
  category: String = ''
  cat_name: String = ''
  subcat_name: String = ''
  subcategory: any = ''
  subcategories: any
  attributes: any = []
  reload:  boolean = false;
  rcount: any = 0;
  tags: any;

  constructor(public navCtrl: NavController,
  			  public DocumentService: DocumentServiceProvider,
  			  public Notifications: NotificationsHelper,
  			  public session: SessionHelper,
  			  public navParams: NavParams) { 
    console.log(this.navParams.get('page'));
  }

  ionViewDidLoad() {
    this.setBackButtonAction();
    this.getCategories();
  }

  setBackButtonAction(){
     this.navBar.backButtonClick = () => { 
        this.navCtrl.setRoot(DocumentsList)
     }
  }

  reloadMe(){ 
    this.getCategories();
  }

  getCategories(){

    this.Notifications.presentLoader();
    this.DocumentService.getCategories()
    .then(data => {
      this.Notifications.dismissLoader();
      
      if( data.error == undefined ){
        this.reload = false;
        this.categories = data.categories;
        this.subcategories = data.subcategories;
      } else {
        this.Notifications.presentToast('Please Request Again');
        this.reload = true;
      }

    });

  }

  userLang(data,type = 'json'){
  	var current_user = this.session.getUser();
  	return JSON.parse(data)[current_user.user_lang_id];
  }

  catChange(startLoader = true, subcat = '',ct_name){
    
    this.cat_name = ct_name;

    if(startLoader)
      this.Notifications.presentLoader();

    this.DocumentService.getSubCategories(this.category + '')
    .then(data => {

      if( data.error == undefined ){
        this.rcount = 0;
        this.Notifications.dismissLoader();
        this.reload = false;
        this.subcategories = data.subcategories;
      } else {

        if(this.rcount < 3){
          this.Notifications.dismissLoader();
          this.catChange(false, '' , ct_name);
          this.rcount++;
        } else {
          this.Notifications.presentToast('Please Request Again');
          this.reload = true;
        }

      }

    });
  }

  next(){
    if(this.category !== '' && this.subcategory !== '' ){
      //console.log("Category :"+this.category+" && sub-category :"+this.subcategory);
      this.Notifications.presentLoader();
      this.DocumentService.getAttributes(this.category, this.subcategory)
      .then(data => {
        this.Notifications.dismissLoader();
        
       //console.log("getAttributes:",data.tags);

        if( data.error == undefined){
          this.attributes = data.categories_attrs;
          this.tags = data.tags;
          this.navCtrl.push(Screen2,
                          { attributes : this.attributes, 
                            tagss:this.tags,
                            category_id : this.category, 
                            category_name : this.cat_name, 
                            subcategory_name : this.subcat_name, 
                            subcategory_id : this.subcategory,
                            page : this.navParams.get('page'),
                            row_id : this.navParams.data.row_id,
                            request_id : this.navParams.get('request_id')
                          });
        } else {
          this.Notifications.presentToast('Please Request Again');
        }
      });
    } 
    else {
      this.Notifications.presentToast('Please select the required values');
    }
  }

  catUpdate(cid,st_name){
    this.category = cid
    this.subcat_name = st_name;

    this.categories.forEach((category) => {
      if(category.id == cid){
        this.cat_name = category.name;
      }
    })
  }
}