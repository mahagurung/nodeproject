const path = require('path')
module.exports = {

uplaodDir: path.join(__dirname, '../public/upload/'),

isEmpty:function(obj){
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            return false;
        };
    }
    return true;
}
}