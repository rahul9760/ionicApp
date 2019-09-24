import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { config } from '../../app.config';
import { SessionHelper } from '../../helpers/session.helper';

@Injectable()
export class EquipmentServiceProvider {
	public data: any;
	constructor(public http: Http, public session: SessionHelper) {

	}
  
	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
		headers.append('Authorization', this.session.getToken() );
		return new RequestOptions({ headers: headers }); // Create a request option
	}

	getLevels(page = 1, search, params = '' ){
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects?page='+page+'&per_page='+config.per_page+'&search='+search+params , this.getHeaders())
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

	getArticle(id){
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/article/'+id, this.getHeaders())
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

	getArticles(page = 1, search, levels_data_id, model_data_id){
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/articles/'+levels_data_id+'?page='+page+'&per_page='+config.per_page+'&search='+search+'&model_data_id='+ model_data_id , this.getHeaders())
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

	getModels(page = 1, search, levels_data_id){
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/models/'+levels_data_id+'?page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getModel(id){
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/model/'+id, this.getHeaders())
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

	getModelAttrs(id) {
	  return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/get_model_attributes/' + id, this.getHeaders())
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

	getArticleAttrs(id) {
	  return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/get_article_attributes/' + id, this.getHeaders())
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

	searchObjects(params) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/search_objects' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	searchAttrs() {
	  return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/search_attributes', this.getHeaders())
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

	createModel(model) {
	  	return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/create_model' , model , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	createLevel(level) {
	  	return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/create_level' , level , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLevel(id) {
	  	return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_level' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	updateModel(model) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/update_model' , model , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	createArticle(article) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/create_article' , article , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	updateArticle(article) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/update_article' , article , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteArticle(id) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_article' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteModel(id) {
	  return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_model' , { id : id } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	searchLevels(search){
		console.log(search)
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects/search_levels?search='+search , this.getHeaders())
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

	searchLevelsData(page = 1, search, parent_id){
		console.log(search)
		return new Promise<any>(resolve => {
		this.http.get(config.api_url + 'objects?page='+page+'&per_page='+config.per_page+'&search='+search+'&parent_id='+ parent_id , this.getHeaders())
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

	getLinkedAgendas(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'objects/linked_agendas?equipment_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedDocuments(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'objects/linked_documents?equipment_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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
	    this.http.get(config.api_url + 'objects/linked_infrastructure?equipment_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	getLinkedContactExternal(id, page = 1, search){ 
	  return new Promise<any>(resolve => {
	    this.http.get(config.api_url + 'objects/linked_contacts_external?equipment_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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
	    this.http.get(config.api_url + 'objects/linked_contacts_internal?equipment_id='+id+'&page='+page+'&per_page='+config.per_page+'&search='+search , this.getHeaders())
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

	saveLinkedAgenda(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/save_linked_agenda' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedDocument(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/save_linked_document' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedInfrastructure(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/save_linked_infrastructure' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedEquipment(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/save_linked_equipment' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactExternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/save_linked_contact_external' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	saveLinkedContactInternal(link){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/save_linked_contact_internal' , link , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedContactExternal(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_linked_contact_external' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteLinkedContactInternal(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_linked_contact_external' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteAgendaLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_linked_agenda' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteDocumentLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_linked_document' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	deleteInfrastructureLink(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'objects/delete_linked_infrastructure' , {id:id} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
}
