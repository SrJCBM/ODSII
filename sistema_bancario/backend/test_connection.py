import psycopg
import sys
from urllib.parse import quote_plus

print("Intentando conectar a Supabase Session Pooler (IPv4)...")
print("=" * 60)

# Intentar con la contraseña original
password = "TbFk9AiP85n7A1Zo"

connection_string = f"postgresql://postgres.jvwcivzmhyxbcelkziwe:{password}@aws-1-us-east-1.pooler.supabase.com:6543/postgres"

print(f"Probando con contraseña original...")
print()

try:
    # Intentar conexión con timeout
    conn = psycopg.connect(
        connection_string,
        connect_timeout=10
    )
    print("✅ CONEXIÓN EXITOSA!")
    print(f"Estado de la conexión: {conn.info.status}")
    
    # Probar una consulta simple
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"Versión de PostgreSQL: {version[0]}")
    
    cursor.close()
    conn.close()
    print("✅ Conexión cerrada correctamente")
    
except psycopg.OperationalError as e:
    print(f"❌ ERROR DE CONEXIÓN:")
    print(f"   {str(e)}")
    print("\nPosibles causas:")
    print("   1. No hay conexión a internet")
    print("   2. Problemas con IPv6")
    print("   3. Firewall bloqueando la conexión")
    print("   4. Credenciales incorrectas")
    sys.exit(1)
    
except Exception as e:
    print(f"❌ ERROR INESPERADO:")
    print(f"   {type(e).__name__}: {str(e)}")
    sys.exit(1)
