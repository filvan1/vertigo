import { EventMessageSubscriber } from "./EventMessageSubscriber";
import { Message, MessagePriority } from "./Message";

export class EventMessageHandler {
	private _subscriberMap: { [identifier: string]: EventMessageSubscriber[] } = {};
	private _normalMessageCapacity = 10;
	private _messageQueue: Message[] = [];

	private static _instance: EventMessageHandler
;

	private constructor() {}

	public static getInstance() {
		if (EventMessageHandler
		._instance == null) {
			EventMessageHandler
		._instance = new EventMessageHandler
		();
		}
		return EventMessageHandler
	._instance;
	}

	public addSubscription(
		identifier: string,
		subscriber: EventMessageSubscriber
	): void {
		let current = this._subscriberMap[identifier];
		if (current === undefined) {
			this._subscriberMap[identifier] = [];
			current = [];
		}

		if (current.indexOf(subscriber) !== -1) {
			console.warn(
				subscriber + " already exists in sub map with key " + identifier
			);
		} else {
			this._subscriberMap[identifier].push(subscriber);
		}
	}

	public removeSubscription(
		identifier: string,
		subscriber: EventMessageSubscriber
	): void {
		let current = this._subscriberMap[identifier];
		if (current === undefined) {
			console.warn(subscriber + " not subscribed to " + identifier);
			return;
		}

		let index = current.indexOf(subscriber);
		if (index !== -1) {
			this._subscriberMap[identifier].splice(index, 1);
		}
	}

	public post(message: Message): void {
		let subscribers = this._subscriberMap[message.identifier];
		if (subscribers === undefined) {
			console.log(
				"Message " + message.identifier + " not posted: No subscribers "
			);
			return;
		}

		for (let s of subscribers) {
			if (message.priority == MessagePriority.HIGH) {
				s.receiveMessage(message);
			} else {
				this._messageQueue.push(message);
			}
		}
	}

	public update(): void {
		if (this._messageQueue.length === 0) {
			return;
		}

		let messageLimit = Math.min(
			this._normalMessageCapacity,
			this._messageQueue.length
		);
		for (let i = 0; i < messageLimit; i++) {
			let message = this._messageQueue.pop();
			for (let s of this._subscriberMap[message.identifier]) {
				s.receiveMessage(message);
			}
		}
	}
}
