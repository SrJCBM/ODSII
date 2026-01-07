from flask import Blueprint, render_template, jsonify
from src.services.customer_service import CustomerService

customer_bp = Blueprint('customer', __name__)
customer_service = CustomerService()


@customer_bp.route('/')
def index():
    customers = customer_service.get_all_customers()
    return render_template('index.html', customers=customers)


@customer_bp.route('/customers', methods=['GET'])
def get_customers():
    customers = customer_service.get_all_customers()
    customers_list = [customer.to_dict() for customer in customers]
    return jsonify(customers_list), 200
