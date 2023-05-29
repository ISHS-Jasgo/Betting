export class QueryChecker {
    
    notNull(...params: any[]) {
        let result = true;
        params.forEach((element) => {
            if (element == null) {
                result = false;
            }
        });
        return result;
    }

    hasInvalidString(...params: string[]) {
        let injectionRegex = new RegExp(/#|-|\/|\\|\"|\'|;/g);
        let result = false;
        params.forEach((element) => {
            if (injectionRegex.test(element)) {
                result = true;
            }
        });  
        return result;
    }
}