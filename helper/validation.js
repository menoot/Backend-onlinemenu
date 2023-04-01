import {ObjectId} from 'mongodb';

let exportedMethods = {
    shallowCompare : (obj1, obj2) =>
        Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key => 
            obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
    ),
    validateID : (id) => {
        exportedMethods.validateString("id", id, "^.*$", "id must be a nonempty string");
        id = id.trim();
        if (!ObjectId.isValid(id)) throw "invalid object id";
        return id
    },
    // check if a string is a number, if so, parse it into number
    isNumber : (string) => {
        if (isNaN(string)) throw "This string is not a number";
        return Number(string);
    },

    //must supply a nonempty array that contains nonempty strings
    //if no regex supplied it allows any letters and numbers.
    validateIDArray : (input) => {
        if (!input || !Array.isArray(input)) throw "You must provide an array"
        // if (input.length===0) throw "Must have atleast one element"
        let x = input.map(element => {return exportedMethods.validateID(element);}); 
        return x;
    },

    //check if input is an int
    /**
     * The int must be a whole number
     * Check if the value is between and includes startingRange and endRange. Returns the int
     * @param {*} parameterName 
     * @param {*} input 
     * @param {*} startingRange -inclusive
     * @param {*} endRange -inclusive
     */
    validateInt : (parameterName, input, startingRange, endingRange) => {
        // if (!input) throw `${parameterName} is missing an input`
        if (typeof input !== 'number') throw `${parameterName} must be an int`
        
        if(input>endingRange || input<startingRange){
            throw `${parameterName} is not in range [${startingRange},${endingRange}]`
        }

        //check if whole number is a whole number
        if (!input.toString().match(String.raw `^\d{1,}$`)){
            throw `${parameterName} must be an int`
        }

        return input;
    },


    // these validation do not return value;

    validateString : (parameterName, input, regex = "^.*$", errorMessage) => {
        if (!input) throw `${parameterName} is missing an input`
        if (typeof input !== 'string') throw `${parameterName} must be a string`
        if (input.trim().length === 0) throw `${parameterName} Cannot be an empty string or string with just spaces`
        input = input.trim()

        if(!input.match(regex)){
        throw `${errorMessage}`
        }
        return input;
    },

    //must supply a nonempty array that contains nonempty strings
    //if no regex supplied it allows any letters and numbers.
    validateStringArray : (parameterName, input, minSize, regex, errorMessage) => {
        if (!input || !Array.isArray(input)) throw "You must provide an array"
        if (input.length < minSize) throw `Must have atleast ${minSize} elements`
        let x = input.map(element => {return exportedMethods.validateString(`${parameterName} elements` , element, regex, errorMessage);}); 
        return x;
    },


    checkIsProperString : (str,strName) =>{
        if(typeof str !== 'string' || str === null || str=== undefined){
            throw `${strName || 'provided variable'} should be string`;
        }
        if(str.trim().length == 0|| str.length == 0){
            throw `${strName || 'provided string'} cannot be empty or all spaces`
        }
    },

    checkIsLetterOrNum : (str,strName) =>{
        for (var i=0;i<str.length;i++) {
            var asc = str.charCodeAt(i);
            if (!(asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122 || asc>=48 && asc<=57)) {
                throw `${strName || 'provided variable'} contains characters are not letters or number `;
            }
        }

    },

    checkIsOnlyLetter : (str,strName) =>{
        for (var i=0;i<str.length;i++) {
            var asc = str.charCodeAt(i);
            if (!(asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
                throw `${strName || 'provided String'} should only contain letters `;
            }
        }

    },

    // check the person Name in regular way (Format: FirstName + LastName)
    checkIsProperName : (str,strName) =>{
        exportedMethods.checkIsProperString(str,strName);
        exportedMethods.checkIsOnlyLetter(str.replace(/ /g, ""),strName);
        //check is only one space
        let trimString = str.trim().replace(/ /g, "");
        if(str.length-trimString.length!==1){
            throw `${strName || 'provided Name'} should only contain one space `;
        }
        let nameArr = [];
        nameArr= str.split(" ");
        if(nameArr.length!=2){
            throw `${strName || 'provided Name'} must be FirstName space LastName`;
        }
        for(var i = 0; i<nameArr.length;i++){
            var nameStr = nameArr[i];
            exportedMethods.checkIsProperString(nameStr,"first or last name");
            exportedMethods.checkIsOnlyLetter(nameStr,"first or last name");
            if(nameStr.length<2){
                throw `first or last name must at least be 3 characters long`;
            }
            if(!(nameStr.charCodeAt(0)>= 65 && nameStr.charCodeAt(0) <= 90)){
                throw `The initial letter of name should be uppercase`;
            }
        }

    },

    checkIsOnlyNum : (numStr,name) =>{
        for (var i=0;i<numStr.length;i++) {
            var asc = numStr.charCodeAt(i);
            if (!(asc>=48 && asc<=57)) {
                throw `${name || 'provided String'} is not only numbers`;
            }
        }
    },

    // Data format: 03/12/2022;
    checkIsProperDate : (date) => {
        exportedMethods.checkIsProperString(date,"date");
        let dateArr = date.split("/");
        if(dateArr.length !== 3||dateArr[0].length!=2||dateArr[1].length!=2||dateArr[2].length!=4){
            throw `provided date format is not valid`;
        }
        let month = dateArr[0];
        let day = dateArr[1];
        let year = dateArr[2];
        exportedMethods.checkIsProperString(month,"month");
        exportedMethods.checkIsOnlyNum(month,"month");
        let intMonth = parseInt(month);
        if(intMonth<0 || intMonth>12){
            throw `provided month is not valid`;
        }
        
        exportedMethods.checkIsProperString(day,"day");
        exportedMethods.checkIsOnlyNum(day,"day");
        let intDay = parseInt(day);
        if(intMonth==2){
            if(intDay<1 || intDay>28){
                throw `provided day is not valid`;
            }
        }
        if(intMonth== 1|| intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12){
            if(intDay<1 || intDay>31){
                throw `provided day is not valid`;
            }
        }
        if(intMonth == 4||intMonth == 6|| intMonth == 9 ||intMonth == 11){
            if(intDay<1||intDay>30){
                throw `provided day is not valid`;
            }
        }
        
        exportedMethods.checkIsProperString(year,"year");
        exportedMethods.checkIsOnlyNum(year,"year");
        let intYear = parseInt(year);
        var nowDate = new Date();
        if(intYear<1900||intYear>nowDate.getFullYear()+2){
            throw `provided year is not valid`;
        }
        
    }
};

export default exportedMethods;