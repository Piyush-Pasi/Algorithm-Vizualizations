var extensionLists = {}; //Create an object for all extension lists
extensionLists.csv = ['csv'];

/**
 * Function to validate all file types
 * @param {String} fName - File name
 * @param {String} fType - File type
 * @returns {Boolean}
 */   
function isValidFileType(fName, fType) {
    return extensionLists[fType].indexOf(fName.split('.').pop()) > -1;
}

/**
 * Function to check if multiple files have been submitted
 * @param {Object}} obj - file object
 */
function changeText(obj){
    if (obj.files.length >1){
        $('#uploadText').text("You can select only 1 file! Please select again.");
    }
    else{
        $('#uploadText').text(obj.files[0].name + " selected");
    }

}

/**
 * Function to check if file type is valid or not
 * @returns {Boolean} 
 */
function validateAndSubmit(){
    var name = $.trim($('#csvFiles').val()); 
    if (isValidFileType(name,'csv')){
        return true;
    }
    else{
        alert("Invalid file type.");
        return false;
    }
}