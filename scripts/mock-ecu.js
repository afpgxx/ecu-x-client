const { SerialPort } = require('serialport');

const targetPort = process.argv[2];

async function main() {
  console.log('Checking available ports...');
  let ports = [];
  try {
    ports = await SerialPort.list();
  } catch (e) {
    console.error('Failed to list ports:', e.message);
  }

  if (ports.length === 0) {
    console.log('Warning: No serial ports detected by Node.js.');
  } else {
    console.log('Available ports:');
    ports.forEach(p => console.log(` - ${p.path} (${p.manufacturer || 'Unknown'})`));
  }

  if (!targetPort) {
    console.error('\nPlease provide a port name (e.g., COM2) as an argument.');
    console.error('Usage: node scripts/mock-ecu.js COM2');
    process.exit(1);
  }

  console.log(`\nAttempting to open ${targetPort}...`);

  const port = new SerialPort({
    path: targetPort,
    baudRate: 115200,
    autoOpen: false
  });

  port.open((err) => {
    if (err) {
      console.error(`Error opening ${targetPort}:`, err.message);
      if (err.message.includes('File not found')) {
        console.error('Hint: Make sure the virtual serial port pair is created and the name is correct.');
      }
      if (err.message.includes('Access denied')) {
        console.error('Hint: The port might be already open in another program (e.g. the App).');
      }
      process.exit(1);
    }

    console.log(`✅ Mock ECU connected to ${targetPort}`);
    console.log('Sending simulated engine data...');
    
    // Simulate engine data
    setInterval(() => {
      const data = {
        rpm: Math.floor(Math.random() * 8000),
        tps: Math.floor(Math.random() * 100),
        map: Math.floor(Math.random() * 200),
        iat: Math.floor(Math.random() * 50) + 20,
        ect: Math.floor(Math.random() * 100),
        ign: Math.floor(Math.random() * 30),
        inj: Number((Math.random() * 10).toFixed(2)),
        afr: Number((10 + Math.random() * 5).toFixed(2)),
        battery: Number((12 + Math.random() * 2).toFixed(1))
      };
      
      const json = JSON.stringify(data);
      port.write(json + '\r\n');
    }, 100);
  });

  port.on('data', (data) => {
    console.log('Received from App:', data.toString().trim());
  });

  port.on('error', (err) => {
    console.error('Port Error:', err.message);
  });
}

main();
