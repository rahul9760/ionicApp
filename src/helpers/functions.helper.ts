export class FunctionsHelper {
  
  constructor() {}

  count(c){
    return c > 99 ? '99+' : c;
  }

  match(x, y){
    return x.toLowerCase().indexOf(y.toLowerCase()) > -1
  } 

  generateAlphabets(){
	var i = 0;
	var alphabets = []
	while (i < 26) {
		var digit = 65 + i;
	    alphabets.push(String.fromCharCode(digit));
	    i++;
	}
	return alphabets;
  }

  clone(data) {

    var response = data;

    if( data instanceof Object ){
      response = Object.assign({}, data);
    } else if(data instanceof Array){
      response = data.slice()
    }

    return response

  }

  cloneObject(data) {

  	return JSON.parse(JSON.stringify(data));

  }

  sortTheAlphabets(alphabets){
    alphabets.sort(function(a, b){
        if(a < b) return -1;
        if(a > b ) return 1;
        return 0;
    })
  }

  ObjLength(obj){
    return Object.keys(obj).length
  }

}