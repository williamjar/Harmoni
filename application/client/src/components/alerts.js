import * as React from 'react';
import { Component } from 'react-simplified';

/**
 * @class Alert
 * @classdesc Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
    alerts = [];
    static nextId = 0;

    render() {
        return (
            <>
                {this.alerts.map((alert, i) => (
                    <div key={alert.id} className={'alert alert-' + alert.type} role="alert">
                        {alert.text}
                        <button
                            type="button"
                            className="close"
                            onClick={() => {
                                this.alerts.splice(i, 1);
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}

            </>
        );
    }

    static success(text) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'success' });
        });
    }

    static info(text) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'info' });
        });
    }

    static warning(text) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'warning' });
        });
    }

    static danger(text) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'danger' });
        });
    }
}