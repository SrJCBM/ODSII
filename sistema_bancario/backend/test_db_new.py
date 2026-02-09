from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text

# Cargar variables de entorno
load_dotenv()

try:
    database_url = os.getenv('DATABASE_URL')
    print(f"🔗 Conectando a: {database_url.split('@')[1].split('/')[0]}")
    
    engine = create_engine(database_url)
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version()'))
        version = result.scalar()
        print('✅ CONEXIÓN EXITOSA')
        print(f'PostgreSQL: {version}\n')
        
        # Verificar depositos
        result = conn.execute(text('SELECT COUNT(*) FROM depositos'))
        count = result.scalar()
        print(f'📊 Depósitos en la base de datos: {count}')
        
        if count > 0:
            result = conn.execute(text('SELECT SUM(monto) FROM depositos'))
            total = result.scalar()
            print(f'💰 Total depositado: ${total:,.2f}')
        
except Exception as e:
    print(f'❌ ERROR: {e}')
