const localStorageUtil = require("../../util/localstorage");

module.exports = {
    onCreate(input) {
        this.state = {
            officeId: 0
        }
    },
    onMount() {
        if (this.input.localstorage) {
            var officeId = localStorageUtil.getInt("office_id");
            if (officeId) {
                this.changeOffice(officeId);
            }
        }
    },
    changeOfficeEvent(event) {
        this.changeOffice(event.target.value);
        event.preventDefault();
    },
    changeOffice(officeId) {
        this.state.officeId = officeId;
        this.emit('office-changed', officeId, this.input.offices[officeId]);
    }

}