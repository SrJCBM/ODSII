from flask import Blueprint, render_template
from src.services.customer_service import CustomerService

customer_bp = Blueprint('customer', __name__)
customer_service = CustomerService()


@customer_bp.route('/')
def index():
    customers = customer_service.get_all_customers()
    return render_template('index.html', customers=customers)
