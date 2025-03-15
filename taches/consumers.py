import json
from asyncio.log import logger

from channels.generic.websocket import AsyncWebsocketConsumer

class TacheConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.projet_id = self.scope["url_route"]["kwargs"]["projet_id"]
        self.room_group_name = f"taches_{self.projet_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        logger.info(f"✅ WebSocket connecté pour {self.room_group_name}")



    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        logger.info(f"❌ WebSocket déconnecté pour {self.room_group_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update_tache", "message": data}
        )

    async def update_tache(self, event):
        await self.send(text_data=json.dumps(event["message"]))

class ActivityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.projet_id = self.scope["url_route"]["kwargs"]["projet_id"]
        self.room_group_name = f"activites_{self.projet_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "update_activity", "message": data}
        )

    async def update_activity(self, event):
        await self.send(text_data=json.dumps(event["message"]))


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            "message": "Connexion WebSocket établie"
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        await self.send(text_data=json.dumps({
            "message": "Notification reçue"
        }))
