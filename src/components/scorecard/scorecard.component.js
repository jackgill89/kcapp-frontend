const alertify = require("../../util/alertify");
var x01 = require("./components/x01");
var shootout = require("./components/shootout")

const DART_CONTAINER_MAP = { 1: 'first', 2: 'second', 3: 'third' };

module.exports = {
    onCreate(input) {
        var player = input.player;
        this.state = {
            leg: input.leg,
            visits: input.leg.visits.length,
            player: player,
            mode: input.mode,
            playerId: player.player_id,
            isCurrentPlayer: player.is_current_player,
            totalScore: 0,
            currentDart: 1,
            isSubmitted: true,
            isBusted: false
        }
    },

    reset() {
        this.state.totalScore = 0;
        this.state.currentDart = 1;
        this.state.isSubmitted = true;
        this.state.isBusted = false;

        // Reset all the darts to their initial state
        this.getComponent(DART_CONTAINER_MAP[1]).reset();
        this.getComponent(DART_CONTAINER_MAP[2]).reset();
        this.getComponent(DART_CONTAINER_MAP[3]).reset();
    },

    setLeg(leg) {
        this.state.leg = leg;
    },

    getDart(idx) {
        return this.getComponent(DART_CONTAINER_MAP[idx]);
    },

    getCurrentDart() {
        return this.getComponent(DART_CONTAINER_MAP[this.state.currentDart]);
    },

    getCurrentValue() {
        var dart = this.getCurrentDart();
        return dart ? dart.state.value : 0;
    },

    getCurrentMultiplier() {
        var dart = this.getCurrentDart()
        return dart ? dart.state.multiplier : 1;
    },

    getDartsThrown() {
        return this.state.currentDart;
    },

    removeLast() {
        if (this.state.currentDart <= 1 && this.state.isSubmitted) {
            this.state.visits--;
            this.emit('undo-throw');
            return;
        }
        if (this.state.isSubmitted) {
            this.state.currentDart--;
            var dart = this.getCurrentDart();
            var value = dart.getValue();

            switch (this.state.mode) {
                case shootout.MODE:
                    this.state.totalScore += value;
                    this.state.player.current_score -= value;
                    this.emit('score-change', value);
                    this.emit('possible-throw', false, false, this.state.currentDart, dart.getScore(), dart.getMultiplier(), true);
                    break;
                case x01.MODE:
                    this.state.totalScore -= value;
                    this.state.player.current_score += value;
                    this.emit('score-change', -value);
                    this.emit('possible-throw', false, false, this.state.currentDart, -dart.getScore(), dart.getMultiplier(), true);
                    break;
            }
            dart.reset();
        } else {
            var dart = this.getCurrentDart()
            dart.reset();
        }
        this.state.isSubmitted = true;
    },

    confirmThrow() {
        var submitting = false;
        if (this.state.currentDart <= 3 && !this.state.isBusted) {
            switch (this.state.mode) {
                case shootout.MODE:
                    submitting = shootout.confirmThrow.bind(this)();
                    break;
                case x01.MODE:
                    submitting = x01.confirmThrow.bind(this)();
                    break;
            }
        }
        if (this.state.currentDart >= 3) {
            this.state.visits++;
        }
        return submitting;
    },

    setDart(value, multiplier, idx) {
        var dart;
        if (idx) {
            dart = this.getDart(idx);
        } else {
            dart = this.getCurrentDart();
        }
        var newValue = parseInt(dart.state.value + '' + value);
        if (newValue > 20 && newValue !== 25) {
            alertify.alert('Invalid Value', () => { });
            return;
        }
        dart.setDart(newValue, multiplier);
        this.state.isSubmitted = false;
    },

    getPayload() {
        var first = this.getComponent(DART_CONTAINER_MAP[1]);
        var second = this.getComponent(DART_CONTAINER_MAP[2]);
        var third = this.getComponent(DART_CONTAINER_MAP[3]);
        return {
            player_id: this.state.playerId,
            leg_id: this.state.leg.id,
            first_dart: first.toJSON(),
            second_dart: second.toJSON(),
            third_dart: third.toJSON()
        };
    }
};
