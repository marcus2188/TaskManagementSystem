/* DATEHANDLER holds utility functions to hold and manipulate date strings for use */

// Convert HTML input date type strings to DD/MM/YYYY format
function convertToDDMMYYYY(datestr){
    dd = datestr.split('-');
    dd.reverse();
    dd = dd.join('/')
    return dd;
}

module.exports = {convertToDDMMYYYY: convertToDDMMYYYY};