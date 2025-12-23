const { SerialPort } = require('serialport');
const EventEmitter = require('events');

class SerialService extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.rxBuffer = Buffer.alloc(0);
    
    // Protocol Constants
    this.HEADER_BYTE_1 = 0xAA;
    this.HEADER_BYTE_2 = 0x55;
    this.MIN_PACKET_SIZE = 5; // Header(2) + Length(2) + Checksum(1)
  }

  async listPorts() {
    try {
      return await SerialPort.list();
    } catch (err) {
      console.error('Error listing ports:', err);
      return [];
    }
  }

  async connect(path, baudRate = 115200) {
    if (this.port && this.port.isOpen) {
      await this.disconnect();
    }

    return new Promise((resolve, reject) => {
      this.port = new SerialPort({ path, baudRate, autoOpen: false });
      this.rxBuffer = Buffer.alloc(0);

      this.port.open((err) => {
        if (err) {
          reject(err.message);
        } else {
          this.port.on('data', this.handleData.bind(this));
          this.port.on('error', (err) => console.error('Serial Port Error:', err));
          resolve('Connected');
        }
      });
    });
  }

  async disconnect() {
    if (this.port && this.port.isOpen) {
      return new Promise((resolve, reject) => {
        this.port.close((err) => {
          if (err) reject(err.message);
          else {
            this.port = null;
            resolve('Closed');
          }
        });
      });
    }
    return 'Already closed';
  }

  async send(data) {
    if (this.port && this.port.isOpen) {
      return new Promise((resolve, reject) => {
        // Ensure data is a string or buffer. If it's an object, stringify it.
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        
        // Construct Packet: Header + Length + Payload + Checksum
        const payloadBuffer = Buffer.from(payload, 'utf-8');
        const length = payloadBuffer.length;
        
        // Header (2 bytes) + Length (2 bytes) + Payload + Checksum (1 byte)
        const packet = Buffer.alloc(2 + 2 + length + 1);
        
        packet[0] = this.HEADER_BYTE_1;
        packet[1] = this.HEADER_BYTE_2;
        packet.writeUInt16BE(length, 2);
        payloadBuffer.copy(packet, 4);
        
        // Calculate Checksum
        let checksum = 0;
        for (const byte of payloadBuffer) {
          checksum = (checksum + byte) & 0xFF;
        }
        packet[4 + length] = checksum;

        this.port.write(packet, (err) => {
          if (err) reject(err.message);
          else resolve('Sent');
        });
      });
    }
    return Promise.reject('Port not open');
  }

  handleData(chunk) {
    this.rxBuffer = Buffer.concat([this.rxBuffer, chunk]);

    while (this.rxBuffer.length >= this.MIN_PACKET_SIZE) {
      // 1. Search for Header
      let headerIndex = -1;
      for (let i = 0; i < this.rxBuffer.length - 1; i++) {
        if (this.rxBuffer[i] === this.HEADER_BYTE_1 && this.rxBuffer[i + 1] === this.HEADER_BYTE_2) {
          headerIndex = i;
          break;
        }
      }

      if (headerIndex === -1) {
        // No header found, keep last byte just in case
        this.rxBuffer = this.rxBuffer.slice(this.rxBuffer.length - 1);
        break;
      }

      // Discard garbage before header
      if (headerIndex > 0) {
        this.rxBuffer = this.rxBuffer.slice(headerIndex);
      }

      // Check if we have enough bytes for Length
      if (this.rxBuffer.length < 4) break;

      // 2. Read Length
      const payloadLength = this.rxBuffer.readUInt16BE(2);
      const totalPacketSize = 4 + payloadLength + 1;

      // Check if we have the full packet
      if (this.rxBuffer.length < totalPacketSize) break;

      // 3. Extract Packet
      const packet = this.rxBuffer.slice(0, totalPacketSize);
      const payload = packet.slice(4, 4 + payloadLength);
      const receivedChecksum = packet[totalPacketSize - 1];

      // 4. Verify Checksum
      let calculatedChecksum = 0;
      for (const byte of payload) {
        calculatedChecksum = (calculatedChecksum + byte) & 0xFF;
      }

      if (calculatedChecksum === receivedChecksum) {
        // Valid Packet: Emit data event
        try {
          const jsonString = payload.toString('utf-8');
          this.emit('data', jsonString);
        } catch (e) {
          console.error('Failed to decode payload:', e);
        }
        
        // Remove processed packet
        this.rxBuffer = this.rxBuffer.slice(totalPacketSize);
      } else {
        console.warn('Checksum mismatch, discarding header');
        this.rxBuffer = this.rxBuffer.slice(2);
      }
    }
  }
}

module.exports = SerialService;
