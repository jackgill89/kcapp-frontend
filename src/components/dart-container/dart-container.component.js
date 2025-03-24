const CLASS_DART_SINGLE = 'dart-score-single';
const CLASS_DART_DOUBLE = 'dart-score-double';
const CLASS_DART_TRIPLE = 'dart-score-triple';

module.exports = {
    onCreate(input) {
        this.state = this.initialState();
        if (input.dart) {
            this.setDart(input.dart.value, input.dart.multiplier);
        } else if (input.value && input.multiplier) {
            this.setDart(input.value, input.multiplier);
        }
    },
    onInput(input) {
        if (input.dart) {
            this.setDart(input.dart.value, input.dart.multiplier);
        }
    },
    initialState() {
        return {
            text: '',
            class: '',
            value: 0,
            multiplier: 1,
            initial: true
        }
    },
    getValue() {
        return this.state.value * this.state.multiplier;
    },
    getScore() {
        return this.state.value;
    },
    getMultiplier() {
        return this.state.multiplier;
    },
    reset() {
        this.state = this.initialState();
    },
    setDart(value, multiplier) {
        let dart = this.state;

        if (value !== null) {
            // Check if the value contains a dash (e.g., T-20 or D-5)
            if (typeof value === 'string' && value.includes('-')) {
                // Split the string by the dash and parse the value and multiplier
                const parts = value.split('-');
                value = parseInt(parts[1]); // Get the number after the dash
                multiplier = parts[0] === 'T' ? 3 : (parts[0] === 'D' ? 2 : 1); // Set the multiplier based on 'T', 'D', or 'S'
            } else if (typeof value === 'string' && value[0].toUpperCase() === 'T') {
                value = parseInt(value.substring(1)); // Get the number after the 'T'
                multiplier = 3; // Triple score (T)
            } else if (typeof value === 'string' && value[0].toUpperCase() === 'D') {
                value = parseInt(value.substring(1)); // Get the number after the 'D'
                multiplier = 2; // Double score (D)
            } else {
                value = parseInt(value); // Just a regular number (S or single score)
                multiplier = 1; // Single score
            }

            dart.text += value;
            dart.value = value;
            dart.multiplier = multiplier;

            if (dart.value == 0) {
                dart.text = 'Miss';
                dart.class = CLASS_DART_SINGLE;
            } else if (dart.multiplier == 3) {
                dart.class = CLASS_DART_TRIPLE;
                dart.text = 'T-' + dart.value;
            } else if (dart.multiplier == 2) {
                dart.class = CLASS_DART_DOUBLE;
                dart.text = 'D-' + dart.value;
            } else {
                dart.class = CLASS_DART_SINGLE;
                dart.text = dart.value;
            }
        }
        this.state.initial = false;
    },
    toJSON() {
        return {
            value: this.state.value,
            multiplier: this.state.multiplier
        }
    }
};
