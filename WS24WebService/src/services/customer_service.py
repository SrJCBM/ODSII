"""
Customer service.
Contains business logic for customer operations.
"""
from typing import List, Optional
from src.models.customer import Customer
from src.repositories.customer_repository import CustomerRepository


class CustomerService:
    """Service layer for customer business logic."""
    
    def __init__(self):
        """Initialize service with repository."""
        self.repository = CustomerRepository()
    
    def create_customer(
        self,
        id: int,
        full_name: str,
        email: str,
        type: str,
        discount: float,
        total_sale: float
    ) -> tuple[bool, str]:
        """
        Create a new customer with validation.
        
        Args:
            id: Customer ID
            full_name: Customer's full name
            email: Customer's email
            type: Customer type
            discount: Discount percentage
            total_sale: Total sales amount
            
        Returns:
            tuple: (success: bool, message: str)
        """
        # Validate that ID doesn't exist
        if self.repository.exists(id):
            return False, f"Customer with ID {id} already exists"
        
        # Create customer object
        customer = Customer(
            id=id,
            full_name=full_name,
            email=email,
            type=type,
            discount=discount,
            total_sale=total_sale
        )
        
        # Save to database
        success = self.repository.create(customer)
        
        if success:
            return True, "Customer created successfully"
        else:
            return False, "Error creating customer in database"
    
    def get_customer(self, customer_id: int) -> Optional[Customer]:
        """
        Get a customer by ID.
        
        Args:
            customer_id: Customer ID to retrieve
            
        Returns:
            Customer object if found, None otherwise
        """
        return self.repository.find_by_id(customer_id)
    
    def get_all_customers(self) -> List[Customer]:
        """
        Get all customers.
        
        Returns:
            List of all customers
        """
        return self.repository.find_all()
    
    def update_customer(
        self,
        customer_id: int,
        full_name: str,
        email: str,
        type: str,
        discount: float,
        total_sale: float
    ) -> tuple[bool, str]:
        """
        Update an existing customer.
        
        Args:
            customer_id: ID of customer to update
            full_name: Updated full name
            email: Updated email
            type: Updated type
            discount: Updated discount
            total_sale: Updated total sale
            
        Returns:
            tuple: (success: bool, message: str)
        """
        # Check if customer exists
        if not self.repository.exists(customer_id):
            return False, f"Customer with ID {customer_id} not found"
        
        # Create updated customer object
        customer = Customer(
            id=customer_id,
            full_name=full_name,
            email=email,
            type=type,
            discount=discount,
            total_sale=total_sale
        )
        
        # Update in database
        success = self.repository.update(customer_id, customer)
        
        if success:
            return True, "Customer updated successfully"
        else:
            return False, "Error updating customer"
    
    def delete_customer(self, customer_id: int) -> tuple[bool, str]:
        """
        Delete a customer by ID.
        
        Args:
            customer_id: ID of customer to delete
            
        Returns:
            tuple: (success: bool, message: str)
        """
        if not self.repository.exists(customer_id):
            return False, f"Customer with ID {customer_id} not found"
        
        success = self.repository.delete(customer_id)
        
        if success:
            return True, "Customer deleted successfully"
        else:
            return False, "Error deleting customer"
