import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { CalendarModule } from "ion2-calendar";
import { MediaCapture } from '@ionic-native/media-capture/ngx';

//Login & Registration
import { Login1Page } from '../pages/login/login1/login1';
import { Login2Page } from '../pages/login/login2/login2';
import { Step1Page } from '../pages/pin/step1/step1';
import { Step2Page } from '../pages/pin/step2/step2';
import { RegisterPage } from '../pages/register/register';
import { EditPage } from '../pages/profile/edit/edit';

//Dashboard
import { Dashboard } from '../pages/dashboard/dashboard';
import { ProfilePage } from '../pages/profile/profile';

//Documents
import { DocumentsList } from '../pages/documents/documents_list/documents_list';
import { DocumentsShare } from '../pages/documents/documents_share/documents_share';
import { DocumentsShared } from '../pages/documents/documents_shared/documents_shared';
import { DocumentsListView } from '../pages/documents/documents_list_view/documents_list_view';
import { DocumentsListInfo } from '../pages/documents/documents_list_info/documents_list_info';
import { DocumentsResult } from '../pages/documents/documents_result/documents_result';
import { DocumentsConditions } from '../pages/documents/documents_conditions/documents_conditions';
import { Screen1 } from '../pages/documents/documents_create/screen1/screen1';
import { Screen2 } from '../pages/documents/documents_create/screen2/screen2';
import { Screen3 } from '../pages/documents/documents_create/screen3/screen3';
import { Uploading } from '../pages/documents/documents_create/uploading/uploading';
import { LinkedAgendaWithDocuments } from '../pages/documents/links/agenda/agenda';
import { CreateLinkedAgendaForDocuments } from '../pages/documents/links/agenda/create/create';
import { CreateLinkedContactExternalForDocuments } from '../pages/documents/links/contact_external/create/create';
import { LinkedContactExternalWithDocuments } from '../pages/documents/links/contact_external/contact_external';
import { CreateLinkedInfrastructureForDocuments } from '../pages/documents/links/infrastructure/create/create';
import { LinkedInfrastructureWithDocuments } from '../pages/documents/links/infrastructure/infrastructure';
import { CreateLinkedContactInternalForDocuments } from '../pages/documents/links/contact_internal/create/create';
import { LinkedContactInternalWithDocuments } from '../pages/documents/links/contact_internal/contact_internal';
import { LinkedEquipmentWithDocuments } from '../pages/documents/links/equipments/equipments';
import { CreateLinkedEquipmentForDocuments } from '../pages/documents/links/equipments/create/create';
import { LinkedDocumentWithDocuments } from '../pages/documents/links/documents/documents';
import { CreateLinkedDocumentForDocument } from '../pages/documents/links/documents/create/create';

//Requests
import { SearchUsers } from '../pages/search_users/list/list'

//Others
import { Users } from '../pages/documents/documents_share/users/users';
import { Tags } from '../pages/tags/list/list';
import { Notifications } from '../pages/notifications/notifications';
import { NotificationSetting } from '../pages/notifications/notification_setting/notification_setting';
import { Settings } from '../pages/settings/settings';
import { Items } from '../pages/items/items';
import { PopoverPage } from '../pages/login/login1/more';
import { CreateLinkedEquipmentForDocumentsModal } from '../pages/documents/links/equipments/create/modal';
import { CreateArticleModal } from '../pages/common/articles/articles';
import { CreateInfrastructureModal } from '../pages/common/infrastructure/infrastructure';
import { InfrastructureLocationModal } from '../pages/common/infrastructure/infrastructurelocationmodal';
import { LocationListModal } from '../pages/common/infrastructure/locationlistmodal';

//document
import { CreateDocument } from '../pages/common/document/document';

//Agenda
import { Agenda } from '../pages/agenda/list/list';
import { AgendaDescription } from '../pages/agenda/show/show';
import { AgendaCreate } from '../pages/agenda/create/create';
import { LinkedContactExternalWithAgenda } from '../pages/agenda/links/contact_external/contact_external';
import { LinkedDocuments } from '../pages/agenda/links/documents/documents';
import { CreateLinkedContactExternalForAgenda } from '../pages/agenda/links/contact_external/create/create';
import { CreateLinkedDocument } from '../pages/agenda/links/documents/create/create';
import { LinkedInfrastructureWithAgenda } from '../pages/agenda/links/infrastructure/infrastructure';
import { CreateLinkedInfrastructureForAgenda } from '../pages/agenda/links/infrastructure/create/create';
import { CreateLinkedContactInternalForAgenda } from '../pages/agenda/links/contact_internal/create/create';
import { LinkedContactInternalWithAgenda } from '../pages/agenda/links/contact_internal/contact_internal';
import { CreateLinkedEquipmentForAgenda } from '../pages/agenda/links/equipments/create/create';
import { LinkedEquipmentWithAgenda } from '../pages/agenda/links/equipments/equipments';
import { Attendees } from '../pages/agenda/attendees/attendees';

//Contacts External
import { ContactExternal } from '../pages/contact/external/list/list';
import { ContactExternalDescription } from '../pages/contact/external/show/show';
import { ContactExternalCreateScreen1 } from '../pages/contact/external/create/screen1/screen1';
import { CreateOrganisation } from '../pages/contact/external/create/screen1/create/create';
import { CreateDivision } from '../pages/contact/external/create/screen2/create/create';
import { CreatePerson } from '../pages/contact/external/create/screen3/create/create';
import { ContactExternalCreateScreen2 } from '../pages/contact/external/create/screen2/screen2';
import { ContactExternalCreateScreen3 } from '../pages/contact/external/create/screen3/screen3';
import { LinkedDocumentsWithCE } from '../pages/contact/external/links/documents/documents';
import { CreateLinkedDocumentForCE } from '../pages/contact/external/links/documents/create/create';
import { CreateLinkedAgendaForCE } from '../pages/contact/external/links/agenda/create/create';
import { LinkedAgendaWithCE } from '../pages/contact/external/links/agenda/agenda';
import { UploadProfilePictureCE } from '../pages/contact/external/create/screen3/upload/upload';
import { CreateLinkedInfrastructureForCE } from '../pages/contact/external/links/infrastructure/create/create';
import { LinkedInfrastructureWithCE } from '../pages/contact/external/links/infrastructure/infrastructure';
import { CreateLinkedEquipmentForCE } from '../pages/contact/external/links/equipments/create/create';
import { LinkedEquipmentWithCE } from '../pages/contact/external/links/equipments/equipments';

//Contacts Internal
import { ContactInternal } from '../pages/contact/internal/list/list';
import { ContactInternalDescription } from '../pages/contact/internal/show/show';
import { ContactInternalCreateScreen1 } from '../pages/contact/internal/create/screen1/screen1';
import { ContactInternalCreateScreen2 } from '../pages/contact/internal/create/screen2/screen2';
import { ContactInternalCreateScreen3 } from '../pages/contact/internal/create/screen3/screen3';
import { CreateSite } from '../pages/contact/internal/create/screen1/create/create';
import { CreateDepartment } from '../pages/contact/internal/create/screen2/create/create';
import { CreatePersonCI } from '../pages/contact/internal/create/screen3/create/create';
import { UploadProfilePictureCI } from '../pages/contact/internal/create/screen3/upload/upload';
import { LinkedDocumentsWithCI } from '../pages/contact/internal/links/documents/documents';
import { CreateLinkedDocumentForCI } from '../pages/contact/internal/links/documents/create/create';
import { CreateLinkedAgendaForCI } from '../pages/contact/internal/links/agenda/create/create';
import { LinkedAgendaWithCI } from '../pages/contact/internal/links/agenda/agenda';
import { CreateLinkedInfrastructureForCI } from '../pages/contact/internal/links/infrastructure/create/create';
import { LinkedInfrastructureWithCI } from '../pages/contact/internal/links/infrastructure/infrastructure';
import { LinkedEquipmentWithCI } from '../pages/contact/internal/links/equipments/equipments';
import { CreateLinkedEquipmentForCI } from '../pages/contact/internal/links/equipments/create/create';

//Infrastructure
import { Infrastructure } from '../pages/infrastructure/list/list';
import { InfrastructureDescription } from '../pages/infrastructure/show/show';
import { InfrastructureLevels } from '../pages/infrastructure/levels/levels';
import { InfrastructureCreate } from '../pages/infrastructure/create/create';
import { LinkedDocumentsWithInfrastructure } from '../pages/infrastructure/links/documents/documents';
import { LinkedAgendaWithInfrastructure } from '../pages/infrastructure/links/agenda/agenda';
import { CreateLinkedAgendaForInfrastructure } from '../pages/infrastructure/links/agenda/create/create';
import { CreateLinkedDocumentForInfrastructure } from '../pages/infrastructure/links/documents/create/create';
import { LinkedContactExternalWithInfrastructure } from '../pages/infrastructure/links/contact_external/contact_external';
import { CreateLinkedContactExternalForInfrastructure } from '../pages/infrastructure/links/contact_external/create/create';
import { LinkedContactInternalWithInfrastructure } from '../pages/infrastructure/links/contact_internal/contact_internal';
import { CreateLinkedContactInternalForInfrastructure } from '../pages/infrastructure/links/contact_internal/create/create';
import { LinkedEquipmentWithInfrastructure } from '../pages/infrastructure/links/equipments/equipments';
import { CreateLinkedEquipmentForInfrastructure } from '../pages/infrastructure/links/equipments/create/create';


//Equipments
import { Equipments } from '../pages/equipments/list/list';
import { EquipmentsLevels } from '../pages/equipments/levels/levels';
import { EquipmentsModels } from '../pages/equipments/models/models';
import { EquipmentsArticles } from '../pages/equipments/articles/articles';
import { EquipmentsMenu } from '../pages/equipments/menu/menu';
import { EquipmentsArticleDescription } from '../pages/equipments/articles/description/description';
import { EquipmentsModelDescription } from '../pages/equipments/models/description/description';
import { EquipmentsLevelDescription } from '../pages/equipments/levels/description/description';
import { EquipmentsModelCreate } from '../pages/equipments/models/create/create';
import { EquipmentsArticleCreate } from '../pages/equipments/articles/create/create';
import { LinkedContactExternalWithEquipments } from '../pages/equipments/links/contact_external/contact_external';
import { CreateLinkedContactExternalForEquipments } from '../pages/equipments/links/contact_external/create/create';
import { LinkedContactInternalWithEquipments } from '../pages/equipments/links/contact_internal/contact_internal';
import { CreateLinkedContactInternalForEquipments } from '../pages/equipments/links/contact_internal/create/create';
import { LinkedDocumentsWithEquipments } from '../pages/equipments/links/documents/documents';
import { CreateLinkedDocumentsForEquipments } from '../pages/equipments/links/documents/create/create';
import { LinkedAgendaWithEquipments } from '../pages/equipments/links/agenda/agenda';
import { CreateLinkedAgendaForEquipments } from '../pages/equipments/links/agenda/create/create';
import { LinkedInfrastructureWithEquipments } from '../pages/equipments/links/infrastructure/infrastructure';
import { CreateLinkedInfrastructureForEquipments } from '../pages/equipments/links/infrastructure/create/create';
import { EquipmentsSearch } from '../pages/equipments/search/search';
import { EquipmentsResult } from '../pages/equipments/search/result/result';
import { CreateEquipmentLevel } from '../pages/equipments/list/create/create';

//Helpers
import { NotificationsHelper } from '../helpers/notifications.helper';
import { SessionHelper } from '../helpers/session.helper';
import { ValidationHelper } from '../helpers/validation.helper';

//Providers
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { TasksServiceProvider } from '../providers/tasks-service/tasks-service';
import { DocumentServiceProvider } from '../providers/document-service/document-service';
import { NotificationServiceProvider } from '../providers/notifications-service/notifications-service';
import { ContactServiceProvider } from '../providers/contact-service/contact-service';

@NgModule({
  declarations: [
    MyApp,
    Login1Page,
    PopoverPage,
    Login2Page,
    Step1Page,
    Step2Page,
    RegisterPage,
    EditPage,
    Dashboard,
    ProfilePage,
    DocumentsList,
    DocumentsShare,
    DocumentsShared,
    DocumentsListView,
    DocumentsListInfo,
    DocumentsResult,
    DocumentsConditions,
    Screen1,
    Screen2,
    Screen3,
    Uploading,
    LinkedAgendaWithDocuments,
    CreateLinkedAgendaForDocuments,
    Infrastructure,
    Agenda,
    AgendaDescription,
    AgendaCreate,
    Tags,
    Users,
    Items,
    Notifications,
    NotificationSetting,
    Settings,
    ContactExternal,
    ContactExternalDescription,
    ContactExternalCreateScreen1,
    ContactExternalCreateScreen2,
    ContactExternalCreateScreen3,
    CreateLinkedContactExternalForAgenda,
    CreateLinkedContactExternalForDocuments,
    LinkedDocumentsWithCE,
    CreateLinkedDocumentForCE,
    LinkedAgendaWithCE,
    CreateLinkedAgendaForCE,
    LinkedContactExternalWithDocuments,
    CreateLinkedDocument,
    LinkedContactExternalWithAgenda,
    UploadProfilePictureCE,
    LinkedDocumentsWithCI,
    CreateLinkedDocumentForCI,
    CreateLinkedAgendaForCI,
    LinkedAgendaWithCI,
    LinkedDocuments,
    CreateOrganisation,
    CreateDivision,
    CreatePerson,
    ContactInternal,
    ContactInternalDescription,
    ContactInternalCreateScreen1,
    ContactInternalCreateScreen2,
    ContactInternalCreateScreen3,
    CreateSite,
    CreateDepartment,
    CreatePersonCI,
    UploadProfilePictureCI,
    InfrastructureDescription,
    InfrastructureLevels,
    InfrastructureCreate,
    LinkedDocumentsWithInfrastructure,
    LinkedAgendaWithInfrastructure,
    CreateLinkedAgendaForInfrastructure,
    CreateLinkedDocumentForInfrastructure,
    LinkedContactExternalWithInfrastructure,
    CreateLinkedContactExternalForInfrastructure,
    LinkedContactInternalWithInfrastructure,
    CreateLinkedContactInternalForInfrastructure,
    LinkedInfrastructureWithAgenda,
    CreateLinkedInfrastructureForAgenda,
    CreateLinkedInfrastructureForDocuments,
    LinkedInfrastructureWithDocuments,
    CreateLinkedContactInternalForDocuments,
    LinkedContactInternalWithDocuments,
    CreateLinkedContactInternalForAgenda,
    LinkedContactInternalWithAgenda,
    CreateLinkedInfrastructureForCI,
    LinkedInfrastructureWithCI,
    CreateLinkedInfrastructureForCE,
    LinkedInfrastructureWithCE,
    Equipments,
    EquipmentsLevels,
    EquipmentsModels,
    EquipmentsArticles,
    EquipmentsMenu,
    EquipmentsArticleDescription,
    EquipmentsModelDescription,
    EquipmentsLevelDescription,
    EquipmentsModelCreate,
    EquipmentsArticleCreate,
    LinkedContactExternalWithEquipments,
    CreateLinkedContactExternalForEquipments,
    LinkedContactInternalWithEquipments,
    CreateLinkedContactInternalForEquipments,
    LinkedDocumentsWithEquipments,
    CreateLinkedDocumentsForEquipments,
    LinkedAgendaWithEquipments,
    CreateLinkedAgendaForEquipments,
    LinkedInfrastructureWithEquipments,
    CreateLinkedInfrastructureForEquipments,
    EquipmentsSearch,
    EquipmentsResult,
    CreateEquipmentLevel,
    LinkedEquipmentWithDocuments,
    CreateLinkedEquipmentForDocuments,
    CreateLinkedEquipmentForAgenda,
    LinkedEquipmentWithAgenda,
    LinkedEquipmentWithInfrastructure,
    CreateLinkedEquipmentForInfrastructure,
    LinkedEquipmentWithCI,
    CreateLinkedEquipmentForCI,
    SearchUsers,
    Attendees,
    LinkedDocumentWithDocuments,
    CreateLinkedDocumentForDocument,
    CreateLinkedEquipmentForCE,
    LinkedEquipmentWithCE,
    CreateLinkedEquipmentForDocumentsModal,
    CreateArticleModal,
    CreateInfrastructureModal,
    CreateDocument,
    InfrastructureLocationModal,
    LocationListModal

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CalendarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login1Page,
    PopoverPage,
    Login2Page,
    Step1Page,
    Step2Page,
    RegisterPage,
    EditPage,
    Dashboard,
    ProfilePage,
    DocumentsList,
    DocumentsShare,
    DocumentsShared,
    DocumentsListView,
    DocumentsListInfo,
    DocumentsResult,
    DocumentsConditions,
    Screen1,
    Screen2,
    Screen3,
    Uploading,
    LinkedAgendaWithDocuments,
    CreateLinkedAgendaForDocuments,
    CreateLinkedContactExternalForDocuments,
    LinkedDocumentsWithCE,
    CreateLinkedDocumentForCE,
    LinkedAgendaWithCE,
    CreateLinkedAgendaForCE,
    LinkedContactExternalWithDocuments,
    Infrastructure,
    Agenda,
    AgendaDescription,
    AgendaCreate,
    Tags,
    Users,
    Items,
    Notifications,
    NotificationSetting,
    Settings,
    ContactExternal,
    ContactExternalDescription,
    ContactExternalCreateScreen1,
    ContactExternalCreateScreen2,
    ContactExternalCreateScreen3,
    CreateLinkedContactExternalForAgenda,
    CreateLinkedDocument,
    LinkedContactExternalWithAgenda,
    LinkedDocumentsWithCI,
    CreateLinkedDocumentForCI,
    CreateLinkedAgendaForCI,
    LinkedAgendaWithCI,
    UploadProfilePictureCE,
    LinkedDocuments,
    CreateOrganisation,
    CreateDivision,
    CreatePerson,
    ContactInternal,
    ContactInternalDescription,
    ContactInternalCreateScreen1,
    ContactInternalCreateScreen2,
    ContactInternalCreateScreen3,
    CreateSite,
    CreateDepartment,
    CreatePersonCI,
    UploadProfilePictureCI,
    InfrastructureDescription,
    InfrastructureLevels,
    InfrastructureCreate,
    LinkedDocumentsWithInfrastructure,
    LinkedAgendaWithInfrastructure,
    CreateLinkedAgendaForInfrastructure,
    CreateLinkedDocumentForInfrastructure,
    LinkedContactExternalWithInfrastructure,
    CreateLinkedContactExternalForInfrastructure,
    LinkedContactInternalWithInfrastructure,
    CreateLinkedContactInternalForInfrastructure,
    LinkedInfrastructureWithAgenda,
    CreateLinkedInfrastructureForAgenda,
    CreateLinkedInfrastructureForDocuments,
    LinkedInfrastructureWithDocuments,
    CreateLinkedContactInternalForDocuments,
    LinkedContactInternalWithDocuments,
    CreateLinkedContactInternalForAgenda,
    LinkedContactInternalWithAgenda,
    CreateLinkedInfrastructureForCI,
    LinkedInfrastructureWithCI,
    CreateLinkedInfrastructureForCE,
    LinkedInfrastructureWithCE,
    Equipments,
    EquipmentsLevels,
    EquipmentsModels,
    EquipmentsArticles,
    EquipmentsMenu,
    EquipmentsArticleDescription,
    EquipmentsModelDescription,
    EquipmentsLevelDescription,
    EquipmentsModelCreate,
    EquipmentsArticleCreate,
    LinkedContactExternalWithEquipments,
    CreateLinkedContactExternalForEquipments,
    LinkedContactInternalWithEquipments,
    CreateLinkedContactInternalForEquipments,
    LinkedDocumentsWithEquipments,
    CreateLinkedDocumentsForEquipments,
    LinkedAgendaWithEquipments,
    CreateLinkedAgendaForEquipments,
    LinkedInfrastructureWithEquipments,
    CreateLinkedInfrastructureForEquipments,
    EquipmentsSearch,
    EquipmentsResult,
    CreateEquipmentLevel,
    LinkedEquipmentWithDocuments,
    CreateLinkedEquipmentForDocuments,
    CreateLinkedEquipmentForAgenda,
    LinkedEquipmentWithAgenda,
    LinkedEquipmentWithInfrastructure,
    CreateLinkedEquipmentForInfrastructure,
    LinkedEquipmentWithCI,
    CreateLinkedEquipmentForCI,
    SearchUsers,
    Attendees,
    LinkedDocumentWithDocuments,
    CreateLinkedDocumentForDocument,
    CreateLinkedEquipmentForCE,
    LinkedEquipmentWithCE,
    CreateLinkedEquipmentForDocumentsModal,
    CreateArticleModal,
    CreateInfrastructureModal,
    CreateDocument,
    InfrastructureLocationModal,
    LocationListModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NotificationsHelper,
    SessionHelper,
    ValidationHelper,
    InAppBrowser,
    PhotoViewer,
    FileTransfer,
    MediaCapture,
    FileTransferObject,
    File,
    Camera,
    ActionSheetController,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    GlobalVarsProvider,
    TasksServiceProvider,
    DocumentServiceProvider,
    NotificationServiceProvider,
    ContactServiceProvider
  ]
})
export class AppModule {}
