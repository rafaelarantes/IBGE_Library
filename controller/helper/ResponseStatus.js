this.status;

function ResponseStatus(){
    ResponseStatus.prototype.setStatusDefault();
}

ResponseStatus.prototype.setStatusDefault = () => {
    this.status = {
        success : false,
        error: false,
        information: false,
        message: "",
        recordsAffected: 0,
        data : null
    };
}

ResponseStatus.prototype.setStatusSuccess = (recordsAffected = 0, message = "", data = null) => {
    setStatus(recordsAffected, message, data);
    this.status.success = true;
}

ResponseStatus.prototype.setStatusError = (recordsAffected, message, data = null) => {
    setStatus(recordsAffected, message, data);
    this.status.error = true;
    
}

ResponseStatus.prototype.setStatusInformation = (recordsAffected = 0, message, data = null) => {
    setStatus(recordsAffected, message, data);
    this.status.information = true;
}

function setStatus(recordsAffected, message, data){
    ResponseStatus.prototype.setStatusDefault();
    this.status.recordsAffected = recordsAffected;
    this.status.message = message;
    this.status.data = data;
}

ResponseStatus.prototype.getStatus = () => {
    return this.status;
}


module.exports = ResponseStatus;