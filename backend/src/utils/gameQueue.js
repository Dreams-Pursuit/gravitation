"use strict";
const EventEmitter = require("events");
function ListNode(val, next) {
  this.val = val === undefined ? null : val;
  this.next = next === undefined ? null : next;
}

class gameQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.interval = null;
    this.presence = {};
    this.queueEvents = new EventEmitter();
  }
  joinQueue(username) {
    if (typeof username !== "string") {
      console.log("Invalid username");
      return;
    }
    console.log(`${username} has joined!`);
    if (this.presence.hasOwnProperty(username)) {
      console.log(
        "Failed to join the queue - gameQueue.queue user is already in the queue",
      );
      return;
    }
    this.presence[username] = true;
    let temp = new ListNode(username);
    if (this.head == null) {
      this.head = temp;
      this.tail = temp;
    } else {
      this.tail.next = temp;
      this.tail = temp;
    }
  }
  popQueue() {
    if (this.head == null) {
      return null;
    }
    let temp = this.head;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      let curr = this.head.next;
      temp.next = null;
      this.head = curr;
    }
    delete this.presence[temp.val];
    return temp.val;
  }
  startQueue() {
    this.interval = setInterval(() => {
      if (this.head !== this.tail) {
        while (this.head !== this.tail) {
          console.log("Creating a new game!");
          const firstPlayer = this.popQueue();
          console.log(firstPlayer);
          const secondPlayer = this.popQueue();
          console.log(secondPlayer);
          this.queueEvents.emit("startNewGame", firstPlayer, secondPlayer);
        }
      } else {
        console.log("Queue is empty :(");
      }
    }, 5000);
    console.log("The queue started");
  }
  endQueue() {
    clearInterval(this.interval);
  }
}

module.exports = gameQueue;
