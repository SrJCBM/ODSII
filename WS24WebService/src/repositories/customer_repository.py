from typing import List, Optional
from bson import ObjectId
from config.database import DatabaseConfig
from src.models.customer import Customer


class CustomerRepository:
    
    def __init__(self):
        self.db_config = DatabaseConfig()
        self.collection = self.db_config.get_collection()
    
    def create(self, customer: Customer) -> bool:
        """
        Create a new customer in the database.
        
        Args:
            customer: Customer object to insert
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            customer_dict = customer.to_dict()
            result = self.collection.insert_one(customer_dict)
            return result.inserted_id is not None
        except Exception as e:
            print(f"Error creating customer: {e}")
            return False
    
    def find_by_id(self, customer_id: int) -> Optional[Customer]:
        """
        Find a customer by their ID.
        
        Args:
            customer_id: Customer ID to search for
            
        Returns:
            Customer object if found, None otherwise
        """
        try:
            result = self.collection.find_one({'id': customer_id})
            if result:
                return Customer.from_dict(result)
            return None
        except Exception as e:
            print(f"Error finding customer: {e}")
            return None
    
    def find_all(self) -> List[Customer]:
        """
        Get all customers from the database.
        
        Returns:
            List of Customer objects
        """
        try:
            results = self.collection.find()
            return [Customer.from_dict(doc) for doc in results]
        except Exception as e:
            print(f"Error finding customers: {e}")
            return []
    
    def update(self, customer_id: int, customer: Customer) -> bool:
        """
        Update an existing customer.
        
        Args:
            customer_id: ID of customer to update
            customer: Customer object with new data
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            customer_dict = customer.to_dict()
            result = self.collection.update_one(
                {'id': customer_id},
                {'$set': customer_dict}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating customer: {e}")
            return False
    
    def delete(self, customer_id: int) -> bool:
        """
        Delete a customer by ID.
        
        Args:
            customer_id: ID of customer to delete
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            result = self.collection.delete_one({'id': customer_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting customer: {e}")
            return False
    
    def exists(self, customer_id: int) -> bool:
        """
        Check if a customer ID already exists.
        
        Args:
            customer_id: Customer ID to check
            
        Returns:
            bool: True if exists, False otherwise
        """
        try:
            return self.collection.count_documents({'id': customer_id}) > 0
        except Exception as e:
            print(f"Error checking customer existence: {e}")
            return False
