export class ValidationHelper {
  
    constructor() {}

    public validateFields(fields){
        let errorMessage = "";        
        for(let key in fields){
            if(fields[key] == ""){
                let keyValue = key.replace(/_/g, " ");
                errorMessage = keyValue+" field is required.";
                return errorMessage;
            }
            // else if(fields[key] != ""){
            //     let keyValue = key.replace(/_/g, " ");
            //     const isWhitespace = (keyValue || '').trim().length === 0;
            //     const isValid = !isWhitespace;
            //     console.log("keyValue :"+keyValue+" && isWhitespace :"+isWhitespace);
            //     return isValid ? null : { 'whitespace': true };
            //     errorMessage = keyValue+" field has spaces.";
            //     // return errorMessage;
            // }
        }
    }
}