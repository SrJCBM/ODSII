import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()


class DatabaseConfig:
    
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConfig, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.mongodb_uri = os.getenv('MONGODB_URI')
            self.database_name = os.getenv('DATABASE_NAME', 'oop')
            self.collection_name = os.getenv('COLLECTION_NAME', 'Customers')
            self.initialized = True
    
    def get_client(self):
        if self._client is None:
            try:
                self._client = MongoClient(self.mongodb_uri)
                self._client.admin.command('ping')
                print("Successfully connected to MongoDB!")
            except ConnectionFailure as e:
                print(f"Failed to connect to MongoDB: {e}")
                raise
        return self._client
    
    def get_database(self):
        if self._db is None:
            client = self.get_client()
            self._db = client[self.database_name]
        return self._db
    
    def get_collection(self, collection_name=None):
        db = self.get_database()
        col_name = collection_name or self.collection_name
        return db[col_name]
    
    def close_connection(self):
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            print("MongoDB connection closed.")
