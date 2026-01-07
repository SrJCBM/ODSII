import os
from flask import Flask
from dotenv import load_dotenv
from src.routes.customer_routes import customer_bp

# Load environment variables
load_dotenv()


def create_app():
    """
    Application factory pattern.
    Creates and configures the Flask application.
    
    Returns:
        Flask: Configured Flask application instance
    """
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key-change-in-production')
    app.config['WTF_CSRF_ENABLED'] = True
    
    # Register blueprints
    app.register_blueprint(customer_bp)
    
    return app


app = create_app()

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    print("Starting Customer Management Web Service...")
    
    app.run(host=host, port=port, debug=debug_mode)
