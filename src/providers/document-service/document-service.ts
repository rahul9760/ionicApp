import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeoutWith';

import { config } from '../../app.config';

import { SessionHelper } from '../../helpers/session.helper';


@Injectable()
export class DocumentServiceProvider {
	public documents: any[];
	public data: any;

	constructor(public http: Http, public session: SessionHelper) {
		console.log("Session :"+this.session.getToken());
	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
			headers.append('Authorization', this.session.getToken() );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	getDocuments(page = 1,search,doc_ids = ''){
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents?page='+page+'&per_page='+config.per_page+'&search='+search+'&doc_ids='+doc_ids, this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getSharedDocuments(org_id){
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/shared_documents?org_id=' + org_id , this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getSharedDocument(res){
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/shared_document?user_id=' + res.user_id + "&org_id=" + res.org_id + "&doc_id=" + res.doc_id  , this.getHeaders())
			  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			  .map(res => res.json())
			  .subscribe(
			  	data => {
				  	this.data = data; 
				    resolve(this.data);
				},
				err =>{
					resolve({ error: true })
			  	}
			  );
		});
	}

	getDocument(id, org_id){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/' + id + '?org_id=' + org_id, this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      	},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedAgendas(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/linked_agendas?document_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedInfrastructure(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/linked_infrastructure?document_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedEquipments(id, page = 1, search){
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/linked_equipments?document_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getCategories(org_id = ''){
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/categories?org_id='+org_id , this.getHeaders())
	      	.timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	});
		});
	}

	create(res){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/create' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
	
	cancelSharedDocument(res){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/cancel_shared_document' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	createTag(res){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/create_tag' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	editTag(res) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/update_tag' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteTag(res){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_tag' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	shareDocument(res){
		
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_shared_document' , res , this.getHeaders())
			.map(res => res)
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	updateSharedDocumentsPermissions(res){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/update_shared_document_permissions' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	searchUsers(srch){
		var res = {search : srch}
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'requests/search_accepted_users' , res , this.getHeaders())
			.timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	});
		});
	}

	sharedDocuments(id = 0, page = 1, search = '' ){
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/shared_documents?org_id='+id+ '&page=' + page + '&per_page=' + config.per_page + '&search=' + search  , this.getHeaders())
			.timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	});
		});	
	}

	update(res) {
		console.log(res);
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/update' , res , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	delete(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/delete/'+id , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteFiles(doc_id, files, org_id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_files' , { 'doc_id' : doc_id, 'files' : files , 'org_id' : org_id }, this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	renameFiles(files, doc_id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/rename_files' , { 'files' : files, 'doc_id' : doc_id }, this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteFile(doc_id, file_id, type, indx) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/delete_file?document_id='+doc_id + '&file_id=' + file_id + '&type='+ type + '&index='+ indx , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	download(file) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/download?file_name='+file+'&type=documents' , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				
			});
		});
	}


	updateRecent(id) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/update_recent_document?id='+id, this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
	
	viewDocument(r) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/view_document_file', r , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data.return;
	    		resolve(this.data);
			},err =>{
				console.log(err);
			});
		});
	}
	
	viewDocumentStep(r) {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/view_steps', this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			});
		});
	}

	applyConditions(conditions,subcategory, org_id = '', shared_with = '') {
		return new Promise<any>(resolve => {
	   	 this.http.post(config.api_url + 'documents/conditions',{ conditions : conditions, subcategory : subcategory, org_id : org_id, shared_with : shared_with} , this.getHeaders())
	      .subscribe(data => {
	        this.data = JSON.parse(data['_body']);
	    	resolve(this.data);
	       });
	    });
	}

	getSubCategories(category_ids,org_id = '') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/sub_categories?org_id=' + org_id + '&category_ids=' + category_ids , this.getHeaders())
			.timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			},err =>{
				resolve({ error: true })
			});
		});
	}

	getDocumentsBySubcats(sub_category_ids,page = 1,search = '',org_id = '', shared_with ='') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'documents/documentsBysubs?page='+page+'&per_page='+config.per_page+'&search='+search+'&sub_category_ids=' + sub_category_ids+'&org_id=' + org_id + '&shared_with=' + shared_with, this.getHeaders())
			.timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
				resolve(this.data);
			},err =>{
				console.log(err);
			});
		});
	}

	getShareDocumentCount() {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/shared_document_count' , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	getSharedDocumentOrgs(is) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/shared_document_orgs_count?is=' + is , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	searchDocuments(val, org_id = 0, shared_with = '') {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents?page='+1+'&per_page='+config.per_page+'&search=' + val + '&org_id=' + org_id + '&shared_with=' + shared_with , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data.documents;
	        resolve(this.data);
	      });
	  });
	}

	searchSharedDocuments(val, org_id = 0, shared_with = '') {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents?page='+1+'&per_page='+config.per_page+'&search=' + val + '&org_id=' + org_id + '&shared_with=' + shared_with , this.getHeaders())
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      });
	  });
	}

	getAttributes(cat_id,scat_id) {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/get_attributes?cat_id='+cat_id+'&scat_id='+scat_id , this.getHeaders())
	  	  .map(res => res.json())
	  	  .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      },err =>{
			resolve({ error: true })
	      });
	  });
	}

	// getAttributes(cat_id,scat_id) {
	//   return new Promise<any>(resolve => {
	//     this.http.get(config.api_url + 'documents/get_attributes?cat_id='+cat_id+'&scat_id='+scat_id , this.getHeaders()).subscribe((res)=>{
 //            console.log(res);
 //            this.data = res;
 //            resolve(this.data);
 //        });
	//   });
	// }

	getTags() {
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/tags', this.getHeaders())
	  	  .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
	      .map(res => res.json())
	      .subscribe(data => {
	        this.data = data;
	        resolve(this.data);
	      },err =>{
			resolve({ error: true })
	      });
	  });
	}

	saveLinkedAgenda(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_linked_agenda' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedContactExternal(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/linked_contacts_external?document_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	getLinkedContactInternal(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/linked_contacts_internal?document_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	saveLinkedContactExternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_linked_contact_external' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactInternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_linked_contact_internal' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedInfrastructure(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_linked_infrastructure' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedEquipment(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_linked_equipment' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteInfrastructureLink(params){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_infrastructure' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteEquipmentLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_equipment' , { id: id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedContactExternal(params){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_contact_external' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedContactInternal(params){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_contact_internal' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedDocument(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_document' , { id: id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteAgendaLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_agenda' , { id: id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
	

	deleteContactExternalLink(id) {
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/delete_linked_contact_external' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	getLinkedDocumentDocuments(id, page = 1, search){
	 return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'documents/linked_documents?document_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
	      .timeoutWith(config.timeout,  Observable.throw(new Error('Boom!')) )
		  .map(res => res.json())
		  .subscribe(
		  	data => {
			  	this.data = data; 
			    resolve(this.data);
			},
			err =>{
				resolve({ error: true })
		  	}
		  );
	  });
	}

	saveDocumentDocument(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'documents/save_linked_document' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

}
