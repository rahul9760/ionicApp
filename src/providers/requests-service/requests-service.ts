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
export class RequestsServiceProvider {
	public documents: any[];
	public data: any;

	constructor(public http: Http, public session: SessionHelper) {

	}

	getHeaders(): RequestOptions{
		let headers = new Headers({'Content-Type': 'application/json'});  
			headers.append('Authorization', this.session.getToken() );
	    return new RequestOptions({ headers: headers }); // Create a request option
	}

	getRequests(page = 1, search = '') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'requests?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getAcceptedRequests(page = 1, search = '') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'requests/accepted?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getSentRequests(page = 1, search = '') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'requests/sent?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	getRecievedRequests(page = 1, search = '') {
		return new Promise<any>(resolve => {
			this.http.get(config.api_url + 'requests/recieved?page='+page+'&per_page='+config.per_page+'&search='+search, this.getHeaders())
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

	sendRequest(params){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'requests/create' , params , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	acceptRequest(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'requests/accept/'+ id , {} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	rejectRequest(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'requests/reject/' + id , {} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	resendRequest(id){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'requests/resend/' + id , {} , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}

	searchNewUsers(search){
		return new Promise<any>(resolve => {
			this.http.post(config.api_url + 'requests/search_new_users' , { search : search } , this.getHeaders())
			.map(res => res.json())
			.subscribe(data => {
				this.data = data;
	    		resolve(this.data);
			});
		});
	}
}
