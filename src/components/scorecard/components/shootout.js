var alertify = require("../../../util/alertify");

exports.MODE = 2;

exports.confirmThrow = function () {
    var submitting = false;
    var dart = this.getCurrentDart();
    var scored = dart.getValue();
    if (scored === 0) {
        this.setDart(0, 1);
    }
    this.state.totalScore += scored;
    this.state.currentDart++;
    this.state.isSubmitted = true;

    this.emit('score-change', -scored);
    var isCheckout = module.exports.isCheckout(this.state.leg, this.state.currentDart);
    if (isCheckout) {
        submitting = true;
        alertify.confirm('Leg will be finished.',
            () => {
                this.emit('leg-finished', true);
            }, () => {
                this.removeLast();
                this.emit('leg-finished', false);
            });
    }
    this.state.player.current_score += scored;
    this.emit('possible-throw', isCheckout, false, this.state.currentDart - 1, dart.getScore(), dart.getMultiplier(), false);

    return submitting;
}

exports.isCheckout = function(leg, currentDart) {
    var visits = leg.visits.length;
    if (currentDart > 3) {
        visits++;
    }
    return visits > 0 && ((visits * 3) % (9 * leg.players.length) === 0);
}