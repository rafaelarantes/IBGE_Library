var status;

function ResponseStatus(){
    ResponseStatus.prototype.setStatusDefault();
}

ResponseStatus.prototype.setStatusDefault = () => {
    status = {
        success : false,
        error: false,
        information: false,
        message: "",
        recordsAffected: 0,
        data : null
    };
}

ResponseStatus.prototype.setStatusSuccess = (data, recordsAffected = 0, message = "") => {
    setStatus(recordsAffected, message, data);
    status.success = true;
}

ResponseStatus.prototype.setStatusError = (recordsAffected, message, data = null) => {
    setStatus(recordsAffected, message, data);
    status.error = true;
    
}

ResponseStatus.prototype.setStatusInformation = (recordsAffected = 0, message, data = null) => {
    setStatus(recordsAffected, message, data);
    status.information = true;
}

function setStatus(recordsAffected, message, data){
    ResponseStatus.prototype.setStatusDefault();
    status.recordsAffected = recordsAffected;
    status.message = message;
    status.data = data;
}

ResponseStatus.prototype.getStatus = () => {
    return status;
}


module.exports = ResponseStatus;