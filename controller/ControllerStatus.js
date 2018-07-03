function ControllerStatus(){

}

ControllerStatus.prototype.getStatusDefault = (recordsAffected = 0, message = "") => {
    return {
        success : false,
        error: false,
        message: message,
        count: recordsAffected
    };
}

ControllerStatus.prototype.getStatusSuccess = (recordsAffected = 0, message = "") => {
    return {
        success : true,
        error: false,
        message: message,
        count: recordsAffected
    };
}

ControllerStatus.prototype.getStatusError = (recordsAffected, message) => {
    return {
        success : false,
        error: true,
        message: message,
        count: recordsAffected
    };
}

ControllerStatus.prototype.getStatusPending = (recordsAffected, message) => {
    return {
        success : false,
        error: true,
        message: message,
        count: recordsAffected
    };
}

module.exports = ControllerStatus;