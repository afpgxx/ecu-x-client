const EventEmitter = require('events');

class CommunicationManager extends EventEmitter {
  constructor() {
    super();
    this.strategy = null;
  }

  /**
   * Set the current communication strategy
   * @param {Object} strategy - The strategy instance (must implement connect, disconnect, send, on)
   */
  setStrategy(strategy) {
    if (this.strategy) {
      // Remove listeners from old strategy to prevent memory leaks and duplicate events
      this.strategy.removeAllListeners();
    }
    this.strategy = strategy;
    
    if (this.strategy) {
      // Forward events from strategy to manager
      this.strategy.on('data', (data) => this.emit('data', data));
      this.strategy.on('error', (err) => this.emit('error', err));
      this.strategy.on('status', (status) => this.emit('status', status));
    }
  }

  async connect(...args) {
    if (!this.strategy) {
      throw new Error('No communication strategy set');
    }
    return this.strategy.connect(...args);
  }

  async disconnect() {
    if (this.strategy) {
      return this.strategy.disconnect();
    }
  }

  async send(data) {
    if (!this.strategy) {
      throw new Error('No communication strategy set');
    }
    return this.strategy.send(data);
  }
  
  // Specific method for Serial Strategy, but handled gracefully if not present
  async listPorts() {
    if (this.strategy && typeof this.strategy.listPorts === 'function') {
      return this.strategy.listPorts();
    }
    return [];
  }
}

module.exports = new CommunicationManager();
