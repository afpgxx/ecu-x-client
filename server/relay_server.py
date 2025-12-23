import asyncio
import websockets
import json
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Store sessions: { room_id: { 'ecu': websocket, 'expert': websocket } }
sessions = {}

async def handler(websocket):
    try:
        # Initial handshake: Client sends { "type": "join", "room": "1234", "role": "ecu"|"expert" }
        message = await websocket.recv()
        data = json.loads(message)
        
        if data.get('type') != 'join':
            await websocket.close(code=1002, reason="Protocol Error: First message must be 'join'")
            return

        room_id = data.get('room')
        role = data.get('role')
        
        if not room_id or role not in ['ecu', 'expert']:
            await websocket.close(code=1002, reason="Invalid room or role")
            return

        # Create room if not exists
        if room_id not in sessions:
            sessions[room_id] = {'ecu': None, 'expert': None}
        
        # Check if role is already taken
        if sessions[room_id][role] is not None:
            await websocket.close(code=1008, reason=f"Role {role} already taken in room {room_id}")
            return

        # Register client
        sessions[room_id][role] = websocket
        logging.info(f"Client joined: Room={room_id}, Role={role}")
        
        # Notify peer if connected
        peer_role = 'expert' if role == 'ecu' else 'ecu'
        peer_ws = sessions[room_id][peer_role]
        
        if peer_ws:
            await peer_ws.send(json.dumps({"type": "system", "message": f"{role} joined"}))
            await websocket.send(json.dumps({"type": "system", "message": f"{peer_role} is present"}))
        else:
            await websocket.send(json.dumps({"type": "system", "message": f"Waiting for {peer_role}..."}))

        # Main loop: Forward messages to peer
        async for msg in websocket:
            # 输出接收到的数据
            logging.info(f"[Room {room_id}] {role.upper()} sent: {msg}")
            
            peer_ws = sessions[room_id][peer_role]
            if peer_ws:
                try:
                    await peer_ws.send(msg)
                    logging.info(f"[Room {room_id}] Forwarded to {peer_role.upper()}")
                except websockets.exceptions.ConnectionClosed:
                    logging.info(f"Peer {peer_role} disconnected during send")
                    sessions[room_id][peer_role] = None
            else:
                # Optionally buffer messages or notify sender
                logging.warning(f"[Room {room_id}] {peer_role.upper()} not connected, message dropped")

    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as e:
        logging.error(f"Error: {e}")
    finally:
        # Cleanup
        if 'room_id' in locals() and 'role' in locals() and room_id in sessions:
            if sessions[room_id][role] == websocket:
                sessions[room_id][role] = None
                logging.info(f"Client left: Room={room_id}, Role={role}")
                
                # Notify peer
                peer_role = 'expert' if role == 'ecu' else 'ecu'
                peer_ws = sessions[room_id][peer_role]
                if peer_ws:
                    try:
                        await peer_ws.send(json.dumps({"type": "system", "message": f"{role} disconnected"}))
                    except:
                        pass
                
                # Remove room if empty
                if sessions[room_id]['ecu'] is None and sessions[room_id]['expert'] is None:
                    del sessions[room_id]
                    logging.info(f"Room {room_id} deleted")

async def main():
    server = await websockets.serve(handler, "0.0.0.0", 8765)
    logging.info("Relay Server started on ws://0.0.0.0:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
