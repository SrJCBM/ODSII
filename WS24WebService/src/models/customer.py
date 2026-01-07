from typing import Optional


class Customer:
    
    def __init__(
        self,
        id: int,
        full_name: str,
        email: str,
        type: str,
        discount: float,
        total_sale: float,
        _id: Optional[str] = None
    ):
        self._id = _id
        self.id = id
        self.full_name = full_name
        self.email = email
        self.type = type
        self.discount = discount
        self.total_sale = total_sale
    
    def to_dict(self):
        data = {
            'id': self.id,
            'fullName': self.full_name,
            'email': self.email,
            'type': self.type,
            'discount': self.discount,
            'totalSale': self.total_sale
        }
        if self._id:
            data['_id'] = self._id
        return data
    
    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            id=data.get('id'),
            full_name=data.get('fullName'),
            email=data.get('email'),
            type=data.get('type'),
            discount=data.get('discount'),
            total_sale=data.get('totalSale'),
            _id=str(data.get('_id')) if data.get('_id') else None
        )
    
    def __repr__(self):
        return f"Customer(id={self.id}, name={self.full_name}, email={self.email})"
