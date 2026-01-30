/*==============================================================*/
/* DATOS DE PRUEBA - MÓDULO DE DEPÓSITOS                       */
/* Banco Pichincha - Sistema Bancario                          */
/* Grupo 2: Depósitos                                          */
/* Fecha: 28/01/2026                                           */
/*==============================================================*/

-- ============================================================
-- NOTA: Este script asume que ya existe la nueva estructura
-- de la tabla DEPOSITOS según el rediseño propuesto.
-- Ejecutar después de crear las tablas base y el DDL de DEPOSITOS
-- ============================================================

/*==============================================================*/
/* 1. DATOS BASE: PERSONAS (30 registros)                       */
/*==============================================================*/

INSERT INTO PERSONA (ID, CELULAR, CORREO, PATRIMONIO) VALUES
(1, '+593987654321', 'juan.perez@mail.com ', 25000.00),
(2, '+593976543210', 'maria.garcia@mail.com', 45000.00),
(3, '+593965432109', 'carlos.lopez@mail.com', 18000.00),
(4, '+593954321098', 'ana.martinez@mail.com', 32000.00),
(5, '+593943210987', 'pedro.sanchez@mail.com', 55000.00),
(6, '+593932109876', 'lucia.ramirez@mail.com', 28000.00),
(7, '+593921098765', 'diego.torres@mail.com', 42000.00),
(8, '+593910987654', 'carmen.flores@mail.com', 19000.00),
(9, '+593909876543', 'andres.ruiz@mail.com ', 67000.00),
(10, '+593998765432', 'sofia.morales@mail.com', 23000.00),
(11, '+593987654322', 'roberto.castro@mail.com', 38000.00),
(12, '+593976543211', 'patricia.vega@mail.com', 51000.00),
(13, '+593965432110', 'miguel.herrera@mail.com', 29000.00),
(14, '+593954321099', 'laura.jimenez@mail.com', 44000.00),
(15, '+593943210988', 'jorge.mendoza@mail.com', 36000.00),
(16, '+593932109877', 'elena.paredes@mail.com', 21000.00),
(17, '+593921098766', 'ricardo.silva@mail.com', 58000.00),
(18, '+593910987655', 'isabel.rojas@mail.com', 33000.00),
(19, '+593909876544', 'fernando.cruz@mail.com', 47000.00),
(20, '+593998765433', 'monica.reyes@mail.com', 26000.00),
(21, '+593987654323', 'alejandro.luna@mail.com', 39000.00),
(22, '+593976543212', 'gabriela.soto@mail.com', 52000.00),
(23, '+593965432111', 'daniel.vargas@mail.com', 31000.00),
(24, '+593954321100', 'veronica.pena@mail.com', 48000.00),
(25, '+593943210989', 'oscar.medina@mail.com', 22000.00),
(26, '+593932109878', 'natalia.campos@mail.com', 56000.00),
(27, '+593921098767', 'eduardo.rios@mail.com', 34000.00),
(28, '+593910987656', 'adriana.leon@mail.com', 41000.00),
(29, '+593909876545', 'victor.aguirre@mail.com', 27000.00),
(30, '+593998765434', 'diana.romero@mail.com', 49000.00);

/*==============================================================*/
/* 2. DATOS: PERSONA_NATURAL (30 registros)                     */
/*==============================================================*/

INSERT INTO PERSONA_NATURAL (ID, CEDULA, CELULAR, CORREO, PATRIMONIO, NOMBRE, APELLIDO, FECHA_NACIMIENTO, GENERO, ESTADO_CIVIL, OCUPACION, NACIONALIDAD) VALUES
(1, '1712345678', '+593987654321', 'juan.perez@mail.com ', 25000.00, 'Juan', 'Pérez', '1985-03-15', 'Masculino', 'Casado', 'Ingeniero', 'Ecuatoriana'),
(2, '1723456789', '+593976543210', 'maria.garcia@mail.com', 45000.00, 'María', 'García', '1990-07-22', 'Femenino', 'Soltera', 'Médica', 'Ecuatoriana'),
(3, '1734567890', '+593965432109', 'carlos.lopez@mail.com', 18000.00, 'Carlos', 'López', '1988-11-08', 'Masculino', 'Soltero', 'Contador', 'Ecuatoriana'),
(4, '1745678901', '+593954321098', 'ana.martinez@mail.com', 32000.00, 'Ana', 'Martínez', '1992-05-30', 'Femenino', 'Casada', 'Abogada', 'Ecuatoriana'),
(5, '1756789012', '+593943210987', 'pedro.sanchez@mail.com', 55000.00, 'Pedro', 'Sánchez', '1980-01-12', 'Masculino', 'Divorciado', 'Empresario', 'Ecuatoriana'),
(6, '1767890123', '+593932109876', 'lucia.ramirez@mail.com', 28000.00, 'Lucía', 'Ramírez', '1995-09-18', 'Femenino', 'Soltera', 'Diseñadora', 'Ecuatoriana'),
(7, '1778901234', '+593921098765', 'diego.torres@mail.com', 42000.00, 'Diego', 'Torres', '1987-04-25', 'Masculino', 'Casado', 'Arquitecto', 'Ecuatoriana'),
(8, '1789012345', '+593910987654', 'carmen.flores@mail.com', 19000.00, 'Carmen', 'Flores', '1993-12-03', 'Femenino', 'Soltera', 'Profesora', 'Ecuatoriana'),
(9, '1790123456', '+593909876543', 'andres.ruiz@mail.com ', 67000.00, 'Andrés', 'Ruiz', '1978-06-14', 'Masculino', 'Casado', 'Gerente', 'Ecuatoriana'),
(10, '1701234567', '+593998765432', 'sofia.morales@mail.com', 23000.00, 'Sofía', 'Morales', '1991-10-27', 'Femenino', 'Soltera', 'Enfermera', 'Ecuatoriana'),
(11, '1712345679', '+593987654322', 'roberto.castro@mail.com', 38000.00, 'Roberto', 'Castro', '1984-02-19', 'Masculino', 'Casado', 'Economista', 'Ecuatoriana'),
(12, '1723456780', '+593976543211', 'patricia.vega@mail.com', 51000.00, 'Patricia', 'Vega', '1989-08-07', 'Femenino', 'Divorciada', 'Consultora', 'Ecuatoriana'),
(13, '1734567891', '+593965432110', 'miguel.herrera@mail.com', 29000.00, 'Miguel', 'Herrera', '1986-03-21', 'Masculino', 'Soltero', 'Programador', 'Ecuatoriana'),
(14, '1745678902', '+593954321099', 'laura.jimenez@mail.com', 44000.00, 'Laura', 'Jiménez', '1994-11-15', 'Femenino', 'Casada', 'Psicóloga', 'Ecuatoriana'),
(15, '1756789013', '+593943210988', 'jorge.mendoza@mail.com', 36000.00, 'Jorge', 'Mendoza', '1982-07-09', 'Masculino', 'Casado', 'Veterinario', 'Ecuatoriana'),
(16, '1767890124', '+593932109877', 'elena.paredes@mail.com', 21000.00, 'Elena', 'Paredes', '1996-01-28', 'Femenino', 'Soltera', 'Estudiante', 'Ecuatoriana'),
(17, '1778901235', '+593921098766', 'ricardo.silva@mail.com', 58000.00, 'Ricardo', 'Silva', '1979-05-04', 'Masculino', 'Casado', 'Director', 'Ecuatoriana'),
(18, '1789012346', '+593910987655', 'isabel.rojas@mail.com', 33000.00, 'Isabel', 'Rojas', '1990-09-12', 'Femenino', 'Soltera', 'Periodista', 'Ecuatoriana'),
(19, '1790123457', '+593909876544', 'fernando.cruz@mail.com', 47000.00, 'Fernando', 'Cruz', '1983-12-30', 'Masculino', 'Divorciado', 'Ingeniero', 'Ecuatoriana'),
(20, '1701234568', '+593998765433', 'monica.reyes@mail.com', 26000.00, 'Mónica', 'Reyes', '1992-04-17', 'Femenino', 'Casada', 'Química', 'Ecuatoriana'),
(21, '1712345680', '+593987654323', 'alejandro.luna@mail.com', 39000.00, 'Alejandro', 'Luna', '1985-08-23', 'Masculino', 'Soltero', 'Fotógrafo', 'Ecuatoriana'),
(22, '1723456781', '+593976543212', 'gabriela.soto@mail.com', 52000.00, 'Gabriela', 'Soto', '1988-02-11', 'Femenino', 'Casada', 'Dentista', 'Ecuatoriana'),
(23, '1734567892', '+593965432111', 'daniel.vargas@mail.com', 31000.00, 'Daniel', 'Vargas', '1991-06-05', 'Masculino', 'Soltero', 'Chef', 'Ecuatoriana'),
(24, '1745678903', '+593954321100', 'veronica.pena@mail.com', 48000.00, 'Verónica', 'Peña', '1987-10-19', 'Femenino', 'Casada', 'Farmacéutica', 'Ecuatoriana'),
(25, '1756789014', '+593943210989', 'oscar.medina@mail.com', 22000.00, 'Óscar', 'Medina', '1994-03-08', 'Masculino', 'Soltero', 'Músico', 'Ecuatoriana'),
(26, '1767890125', '+593932109878', 'natalia.campos@mail.com', 56000.00, 'Natalia', 'Campos', '1981-07-14', 'Femenino', 'Divorciada', 'Ejecutiva', 'Ecuatoriana'),
(27, '1778901236', '+593921098767', 'eduardo.rios@mail.com', 34000.00, 'Eduardo', 'Ríos', '1989-11-26', 'Masculino', 'Casado', 'Biólogo', 'Ecuatoriana'),
(28, '1789012347', '+593910987656', 'adriana.leon@mail.com', 41000.00, 'Adriana', 'León', '1986-05-02', 'Femenino', 'Soltera', 'Auditora', 'Ecuatoriana'),
(29, '1790123458', '+593909876545', 'victor.aguirre@mail.com', 27000.00, 'Víctor', 'Aguirre', '1993-09-20', 'Masculino', 'Soltero', 'Técnico', 'Ecuatoriana'),
(30, '1701234569', '+593998765434', 'diana.romero@mail.com', 49000.00, 'Diana', 'Romero', '1984-01-07', 'Femenino', 'Casada', 'Socióloga', 'Ecuatoriana');

/*==============================================================*/
/* 3. DATOS: CUENTAS (30 registros)                             */
/*==============================================================*/

INSERT INTO CUENTA (ID_CUENTA, ID, N_CUENTA, TIPO_CUENTA, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION, FECHA_CIERRE, SALDO_ACTUAL, COMISION_MENSUAL, LIMITE_OPERACIONES_DIARIAS) VALUES
(1, 1, 2200001001, 'AHORROS', 'Activa', '2023-01-15', '2026-01-28', '2099-12-31', 5200.50, 2.50, 10),
(2, 2, 2200001002, 'CORRIENTE', 'Activa', '2022-06-20', '2026-01-28', '2099-12-31', 12500.00, 5.00, 20),
(3, 3, 2200001003, 'AHORROS', 'Activa', '2023-03-10', '2026-01-28', '2099-12-31', 3800.75, 2.50, 10),
(4, 4, 2200001004, 'CORRIENTE', 'Activa', '2021-11-05', '2026-01-28', '2099-12-31', 8900.00, 5.00, 20),
(5, 5, 2200001005, 'AHORROS', 'Activa', '2022-08-18', '2026-01-28', '2099-12-31', 25000.00, 2.50, 10),
(6, 6, 2200001006, 'AHORROS', 'Activa', '2023-05-22', '2026-01-28', '2099-12-31', 4500.25, 2.50, 10),
(7, 7, 2200001007, 'CORRIENTE', 'Activa', '2022-02-14', '2026-01-28', '2099-12-31', 15800.00, 5.00, 20),
(8, 8, 2200001008, 'AHORROS', 'Activa', '2023-07-30', '2026-01-28', '2099-12-31', 2100.00, 2.50, 10),
(9, 9, 2200001009, 'CORRIENTE', 'Activa', '2021-04-12', '2026-01-28', '2099-12-31', 35000.00, 5.00, 20),
(10, 10, 2200001010, 'AHORROS', 'Activa', '2023-09-08', '2026-01-28', '2099-12-31', 6700.50, 2.50, 10),
(11, 11, 2200001011, 'AHORROS', 'Activa', '2022-12-01', '2026-01-28', '2099-12-31', 9200.00, 2.50, 10),
(12, 12, 2200001012, 'CORRIENTE', 'Activa', '2021-09-25', '2026-01-28', '2099-12-31', 18500.75, 5.00, 20),
(13, 13, 2200001013, 'AHORROS', 'Activa', '2023-02-17', '2026-01-28', '2099-12-31', 4100.00, 2.50, 10),
(14, 14, 2200001014, 'CORRIENTE', 'Activa', '2022-07-09', '2026-01-28', '2099-12-31', 22000.00, 5.00, 20),
(15, 15, 2200001015, 'AHORROS', 'Activa', '2023-04-28', '2026-01-28', '2099-12-31', 7800.25, 2.50, 10),
(16, 16, 2200001016, 'AHORROS', 'Activa', '2023-11-11', '2026-01-28', '2099-12-31', 1500.00, 2.50, 10),
(17, 17, 2200001017, 'CORRIENTE', 'Activa', '2021-06-03', '2026-01-28', '2099-12-31', 42000.00, 5.00, 20),
(18, 18, 2200001018, 'AHORROS', 'Activa', '2022-10-19', '2026-01-28', '2099-12-31', 5600.50, 2.50, 10),
(19, 19, 2200001019, 'CORRIENTE', 'Activa', '2022-01-07', '2026-01-28', '2099-12-31', 19800.00, 5.00, 20),
(20, 20, 2200001020, 'AHORROS', 'Activa', '2023-08-14', '2026-01-28', '2099-12-31', 3200.75, 2.50, 10),
(21, 21, 2200001021, 'AHORROS', 'Activa', '2022-04-26', '2026-01-28', '2099-12-31', 8100.00, 2.50, 10),
(22, 22, 2200001022, 'CORRIENTE', 'Activa', '2021-12-15', '2026-01-28', '2099-12-31', 28500.00, 5.00, 20),
(23, 23, 2200001023, 'AHORROS', 'Activa', '2023-06-21', '2026-01-28', '2099-12-31', 4900.25, 2.50, 10),
(24, 24, 2200001024, 'CORRIENTE', 'Activa', '2022-03-08', '2026-01-28', '2099-12-31', 16200.00, 5.00, 20),
(25, 25, 2200001025, 'AHORROS', 'Activa', '2023-10-03', '2026-01-28', '2099-12-31', 2800.00, 2.50, 10),
(26, 26, 2200001026, 'CORRIENTE', 'Activa', '2021-08-20', '2026-01-28', '2099-12-31', 31000.50, 5.00, 20),
(27, 27, 2200001027, 'AHORROS', 'Activa', '2022-11-12', '2026-01-28', '2099-12-31', 6100.00, 2.50, 10),
(28, 28, 2200001028, 'CORRIENTE', 'Activa', '2022-05-30', '2026-01-28', '2099-12-31', 14700.75, 5.00, 20),
(29, 29, 2200001029, 'AHORROS', 'Activa', '2023-01-25', '2026-01-28', '2099-12-31', 3500.50, 2.50, 10),
(30, 30, 2200001030, 'CORRIENTE', 'Activa', '2021-10-08', '2026-01-28', '2099-12-31', 21500.00, 5.00, 20);

/*==============================================================*/
/* 4. DATOS: CAJEROS (30 registros)                             */
/*==============================================================*/

INSERT INTO CAJERO (ID_CAJERO, LATITUD, LONGITUD, ACTIVO, SALDO, DEPOSITOS, NOMBRE, CIUDAD, PROVINCIA, DIRECCION, HORA_APERTURA, HORA_CIERRE, DIAS) VALUES
(1, -0.18, -78.47, true, 50000.00, true, 'ATM-QUI-001', 'Quito', 'Pichincha', 'Av. Amazonas N23-45 y Veintimilla', '00:00:00', '23:59:59', 'L'),
(2, -0.22, -78.51, true, 45000.00, true, 'ATM-QUI-002', 'Quito', 'Pichincha', 'Av. República E5-12 y Eloy Alfaro', '06:00:00', '22:00:00', 'L'),
(3, -0.17, -78.48, true, 55000.00, true, 'ATM-QUI-003', 'Quito', 'Pichincha', 'Av. 6 de Diciembre N34-78', '00:00:00', '23:59:59', 'L'),
(4, -2.19, -79.88, true, 48000.00, true, 'ATM-GYE-001', 'Guayaquil', 'Guayas', 'Av. 9 de Octubre 456 y Chile', '00:00:00', '23:59:59', 'L'),
(5, -2.17, -79.90, true, 52000.00, true, 'ATM-GYE-002', 'Guayaquil', 'Guayas', 'Mall del Sol, Local 123', '10:00:00', '21:00:00', 'L'),
(6, -2.20, -79.89, true, 47000.00, true, 'ATM-GYE-003', 'Guayaquil', 'Guayas', 'Av. Francisco de Orellana 234', '06:00:00', '22:00:00', 'L'),
(7, -2.90, -79.00, true, 35000.00, true, 'ATM-CUE-001', 'Cuenca', 'Azuay', 'Av. Solano 5-67 y 12 de Abril', '00:00:00', '23:59:59', 'L'),
(8, -2.89, -79.01, true, 32000.00, true, 'ATM-CUE-002', 'Cuenca', 'Azuay', 'Gran Colombia 8-90 y Benigno Malo', '06:00:00', '20:00:00', 'L'),
(9, -0.93, -78.62, true, 28000.00, true, 'ATM-AMB-001', 'Ambato', 'Tungurahua', 'Av. Cevallos 456 y Lalama', '06:00:00', '21:00:00', 'L'),
(10, -1.25, -78.62, true, 30000.00, true, 'ATM-RIO-001', 'Riobamba', 'Chimborazo', 'Av. Daniel León Borja 34-56', '06:00:00', '20:00:00', 'L'),
(11, -0.21, -78.49, true, 42000.00, true, 'ATM-QUI-004', 'Quito', 'Pichincha', 'CC El Jardín, Nivel 2', '09:00:00', '21:00:00', 'L'),
(12, -0.19, -78.50, true, 38000.00, false, 'ATM-QUI-005', 'Quito', 'Pichincha', 'Av. Naciones Unidas E4-45', '00:00:00', '23:59:59', 'L'),
(13, -2.15, -79.91, true, 51000.00, true, 'ATM-GYE-004', 'Guayaquil', 'Guayas', 'CC San Marino, Planta Baja', '10:00:00', '21:00:00', 'L'),
(14, -2.18, -79.87, true, 44000.00, true, 'ATM-GYE-005', 'Guayaquil', 'Guayas', 'Av. Plaza Dañín 456', '06:00:00', '22:00:00', 'L'),
(15, -0.25, -79.17, true, 25000.00, true, 'ATM-SDO-001', 'Santo Domingo', 'Santo Domingo', 'Av. Quito 345 y Tulcán', '06:00:00', '20:00:00', 'L'),
(16, 0.35, -78.12, true, 22000.00, true, 'ATM-IBA-001', 'Ibarra', 'Imbabura', 'Av. Mariano Acosta 12-34', '06:00:00', '20:00:00', 'L'),
(17, -1.01, -79.47, true, 26000.00, true, 'ATM-BAB-001', 'Babahoyo', 'Los Ríos', 'Av. Universitaria 567', '06:00:00', '19:00:00', 'L'),
(18, -2.22, -80.95, true, 33000.00, true, 'ATM-SAL-001', 'Salinas', 'Santa Elena', 'Malecón 456 y Calle 23', '07:00:00', '21:00:00', 'L'),
(19, -0.95, -80.72, true, 29000.00, true, 'ATM-MAN-001', 'Manta', 'Manabí', 'Av. 4 de Noviembre 789', '06:00:00', '21:00:00', 'L'),
(20, -1.05, -80.45, true, 31000.00, true, 'ATM-POR-001', 'Portoviejo', 'Manabí', 'Av. Manabí 234 y Chile', '06:00:00', '20:00:00', 'L'),
(21, -3.99, -79.20, true, 27000.00, true, 'ATM-LOJ-001', 'Loja', 'Loja', 'Av. Universitaria 456', '06:00:00', '20:00:00', 'L'),
(22, -0.20, -78.46, true, 49000.00, true, 'ATM-QUI-006', 'Quito', 'Pichincha', 'CC Quicentro Norte, PB', '09:00:00', '21:00:00', 'L'),
(23, -2.16, -79.92, true, 46000.00, true, 'ATM-GYE-006', 'Guayaquil', 'Guayas', 'CC Mall del Sur, Nivel 1', '10:00:00', '21:00:00', 'L'),
(24, -0.18, -78.52, true, 41000.00, true, 'ATM-QUI-007', 'Quito', 'Pichincha', 'Av. 10 de Agosto N45-67', '00:00:00', '23:59:59', 'L'),
(25, -2.91, -78.99, true, 34000.00, true, 'ATM-CUE-003', 'Cuenca', 'Azuay', 'CC Mall del Río, Local 45', '10:00:00', '21:00:00', 'L'),
(26, -0.23, -78.53, true, 39000.00, true, 'ATM-QUI-008', 'Quito', 'Pichincha', 'Aeropuerto Mariscal Sucre', '04:00:00', '23:00:00', 'L'),
(27, -2.21, -79.86, true, 43000.00, true, 'ATM-GYE-007', 'Guayaquil', 'Guayas', 'Aeropuerto José Joaquín', '04:00:00', '23:00:00', 'L'),
(28, -0.94, -78.61, true, 24000.00, true, 'ATM-AMB-002', 'Ambato', 'Tungurahua', 'CC Mall de los Andes', '09:00:00', '21:00:00', 'L'),
(29, -1.24, -78.63, true, 23000.00, true, 'ATM-RIO-002', 'Riobamba', 'Chimborazo', 'CC Paseo Shopping', '09:00:00', '20:00:00', 'L'),
(30, -0.17, -78.49, false, 15000.00, true, 'ATM-QUI-009', 'Quito', 'Pichincha', 'Av. Colón E5-34 (Mantenimiento)', '00:00:00', '00:00:00', 'L');

/*==============================================================*/
/* 5. DATOS: DEPOSITOS (30 registros)                           */
/* NOTA: Usa la nueva estructura de tabla DEPOSITOS             */
/* La secuencia seq_depositos ya está creada en el DDL principal*/
/*==============================================================*/

INSERT INTO DEPOSITOS (ID_CUENTA_DESTINO, ID_CAJERO, ID_PERSONA_DEPOSITA, MONTO, MONEDA, CANAL_DEPOSITO, TIPO_DEPOSITO, FECHA_DEPOSITO, FECHA_PROCESAMIENTO, ESTADO, REFERENCIA, NUMERO_COMPROBANTE, BANCO_ORIGEN, NUMERO_CHEQUE, OBSERVACIONES, USUARIO_REGISTRO, IP_ORIGEN) VALUES
-- Depósitos en efectivo por cajero automático
(1, 1, 1, 500.00, 'USD', 'CAJERO', 'EFECTIVO', '2026-01-15 09:30:00', '2026-01-15 09:30:05', 'PROCESADO', NULL, 'DEP-20260115-000001', NULL, NULL, 'Depósito mensual', 'SISTEMA', '192.168.1.100'),
(3, 4, 3, 1200.00, 'USD', 'CAJERO', 'EFECTIVO', '2026-01-15 10:15:00', '2026-01-15 10:15:03', 'PROCESADO', NULL, 'DEP-20260115-000002', NULL, NULL, NULL, 'SISTEMA', '192.168.1.101'),
(5, 7, 5, 3500.00, 'USD', 'CAJERO', 'EFECTIVO', '2026-01-16 08:45:00', '2026-01-16 08:45:02', 'PROCESADO', NULL, 'DEP-20260116-000001', NULL, NULL, 'Pago de cliente', 'SISTEMA', '192.168.1.102'),
(8, 9, 8, 250.00, 'USD', 'CAJERO', 'EFECTIVO', '2026-01-16 14:20:00', '2026-01-16 14:20:04', 'PROCESADO', NULL, 'DEP-20260116-000002', NULL, NULL, NULL, 'SISTEMA', '192.168.1.103'),
(10, 11, 10, 800.00, 'USD', 'CAJERO', 'EFECTIVO', '2026-01-17 11:00:00', '2026-01-17 11:00:03', 'PROCESADO', NULL, 'DEP-20260117-000001', NULL, NULL, 'Ahorro quincenal', 'SISTEMA', '192.168.1.104'),

-- Depósitos en ventanilla
(2, NULL, 2, 5000.00, 'USD', 'VENTANILLA', 'EFECTIVO', '2026-01-17 09:00:00', '2026-01-17 09:05:00', 'PROCESADO', 'VEN-001234', 'DEP-20260117-000002', NULL, NULL, 'Ingreso por ventas', 'CAJERO01', '10.0.0.50'),
(4, NULL, 4, 2500.00, 'USD', 'VENTANILLA', 'EFECTIVO', '2026-01-18 10:30:00', '2026-01-18 10:35:00', 'PROCESADO', 'VEN-001235', 'DEP-20260118-000001', NULL, NULL, NULL, 'CAJERO02', '10.0.0.51'),
(9, NULL, 9, 15000.00, 'USD', 'VENTANILLA', 'EFECTIVO', '2026-01-18 11:45:00', '2026-01-18 11:50:00', 'PROCESADO', 'VEN-001236', 'DEP-20260118-000002', NULL, NULL, 'Liquidación contrato', 'CAJERO01', '10.0.0.50'),
(12, NULL, 12, 8500.00, 'USD', 'VENTANILLA', 'EFECTIVO', '2026-01-19 09:15:00', '2026-01-19 09:20:00', 'PROCESADO', 'VEN-001237', 'DEP-20260119-000001', NULL, NULL, NULL, 'CAJERO03', '10.0.0.52'),
(17, NULL, 17, 20000.00, 'USD', 'VENTANILLA', 'EFECTIVO', '2026-01-19 15:00:00', '2026-01-19 15:10:00', 'PROCESADO', 'VEN-001238', 'DEP-20260119-000002', NULL, NULL, 'Capital de trabajo', 'CAJERO02', '10.0.0.51'),

-- Depósitos con cheque
(6, NULL, 6, 1800.00, 'USD', 'VENTANILLA', 'CHEQUE', '2026-01-20 10:00:00', '2026-01-22 09:00:00', 'PROCESADO', 'CHQ-78901', 'DEP-20260120-000001', 'Banco Guayaquil', '0012345678', 'Cheque certificado', 'CAJERO01', '10.0.0.50'),
(14, NULL, 14, 4500.00, 'USD', 'VENTANILLA', 'CHEQUE', '2026-01-20 11:30:00', '2026-01-22 10:00:00', 'PROCESADO', 'CHQ-78902', 'DEP-20260120-000002', 'Produbanco', '0098765432', NULL, 'CAJERO02', '10.0.0.51'),
(19, NULL, 19, 7200.00, 'USD', 'VENTANILLA', 'CHEQUE', '2026-01-21 09:45:00', '2026-01-23 09:00:00', 'PROCESADO', 'CHQ-78903', 'DEP-20260121-000001', 'Banco del Pacífico', '0055667788', 'Pago proveedor', 'CAJERO03', '10.0.0.52'),
(22, NULL, 22, 12000.00, 'USD', 'VENTANILLA', 'CHEQUE', '2026-01-21 14:00:00', NULL, 'PENDIENTE', 'CHQ-78904', 'DEP-20260121-000002', 'Banco Internacional', '0011223344', 'En proceso de verificación', 'CAJERO01', '10.0.0.50'),
(26, NULL, 26, 9800.00, 'USD', 'VENTANILLA', 'CHEQUE', '2026-01-22 10:20:00', NULL, 'RECHAZADO', 'CHQ-78905', 'DEP-20260122-000001', 'Banco Bolivariano', '0099887766', 'Cheque sin fondos', 'CAJERO02', '10.0.0.51'),

-- Depósitos por transferencia
(7, NULL, 7, 3200.00, 'USD', 'TRANSFERENCIA', 'TRANSFERENCIA', '2026-01-22 08:00:00', '2026-01-22 08:00:05', 'PROCESADO', 'TRF-2026012200001', 'DEP-20260122-000002', 'Banco Guayaquil', NULL, 'Transferencia interbancaria', 'SISTEMA', NULL),
(11, NULL, 11, 1500.00, 'USD', 'TRANSFERENCIA', 'TRANSFERENCIA', '2026-01-22 12:30:00', '2026-01-22 12:30:03', 'PROCESADO', 'TRF-2026012200002', 'DEP-20260122-000003', 'Produbanco', NULL, NULL, 'SISTEMA', NULL),
(15, NULL, 15, 2800.00, 'USD', 'TRANSFERENCIA', 'TRANSFERENCIA', '2026-01-23 09:15:00', '2026-01-23 09:15:02', 'PROCESADO', 'TRF-2026012300001', 'DEP-20260123-000001', 'Banco del Pacífico', NULL, 'Pago nómina', 'SISTEMA', NULL),
(20, NULL, 20, 950.00, 'USD', 'TRANSFERENCIA', 'TRANSFERENCIA', '2026-01-23 14:45:00', '2026-01-23 14:45:04', 'PROCESADO', 'TRF-2026012300002', 'DEP-20260123-000002', 'Banco Internacional', NULL, NULL, 'SISTEMA', NULL),
(24, NULL, 24, 6500.00, 'USD', 'TRANSFERENCIA', 'TRANSFERENCIA', '2026-01-24 10:00:00', '2026-01-24 10:00:03', 'PROCESADO', 'TRF-2026012400001', 'DEP-20260124-000001', 'Banco Bolivariano', NULL, 'Comisión ventas', 'SISTEMA', NULL),

-- Depósitos por App Móvil
(13, 3, 13, 400.00, 'USD', 'APP_MOVIL', 'EFECTIVO', '2026-01-24 18:30:00', '2026-01-24 18:30:02', 'PROCESADO', 'APP-20260124-001', 'DEP-20260124-000002', NULL, NULL, 'Depósito desde app', 'APP_MOVIL', '181.199.45.123'),
(16, 5, 16, 200.00, 'USD', 'APP_MOVIL', 'EFECTIVO', '2026-01-25 08:15:00', '2026-01-25 08:15:03', 'PROCESADO', 'APP-20260125-001', 'DEP-20260125-000001', NULL, NULL, NULL, 'APP_MOVIL', '186.47.123.45'),
(21, 13, 21, 750.00, 'USD', 'APP_MOVIL', 'EFECTIVO', '2026-01-25 12:00:00', '2026-01-25 12:00:02', 'PROCESADO', 'APP-20260125-002', 'DEP-20260125-000002', NULL, NULL, 'Ahorro semanal', 'APP_MOVIL', '190.95.67.89'),
(25, 22, 25, 350.00, 'USD', 'APP_MOVIL', 'EFECTIVO', '2026-01-26 09:45:00', '2026-01-26 09:45:04', 'PROCESADO', 'APP-20260126-001', 'DEP-20260126-000001', NULL, NULL, NULL, 'APP_MOVIL', '200.110.34.56'),
(29, 24, 29, 600.00, 'USD', 'APP_MOVIL', 'EFECTIVO', '2026-01-26 16:20:00', '2026-01-26 16:20:03', 'PROCESADO', 'APP-20260126-002', 'DEP-20260126-000002', NULL, NULL, 'Reserva viaje', 'APP_MOVIL', '201.218.78.90'),

-- Depósitos por Banca Web
(18, NULL, 18, 1100.00, 'USD', 'BANCA_WEB', 'TRANSFERENCIA', '2026-01-27 07:30:00', '2026-01-27 07:30:05', 'PROCESADO', 'WEB-20260127-001', 'DEP-20260127-000001', 'Mismo banco', NULL, 'Transferencia propia', 'BANCA_WEB', '192.168.100.50'),
(23, NULL, 23, 2200.00, 'USD', 'BANCA_WEB', 'TRANSFERENCIA', '2026-01-27 11:00:00', '2026-01-27 11:00:03', 'PROCESADO', 'WEB-20260127-002', 'DEP-20260127-000002', 'Mismo banco', NULL, NULL, 'BANCA_WEB', '192.168.100.51'),
(27, NULL, 27, 1750.00, 'USD', 'BANCA_WEB', 'TRANSFERENCIA', '2026-01-28 08:00:00', '2026-01-28 08:00:02', 'PROCESADO', 'WEB-20260128-001', 'DEP-20260128-000001', 'Produbanco', NULL, 'Pago freelance', 'BANCA_WEB', '186.42.89.120'),
(28, NULL, 28, 4300.00, 'USD', 'BANCA_WEB', 'TRANSFERENCIA', '2026-01-28 10:30:00', '2026-01-28 10:30:04', 'PROCESADO', 'WEB-20260128-002', 'DEP-20260128-000002', 'Banco Guayaquil', NULL, NULL, 'BANCA_WEB', '200.93.45.67'),
(30, NULL, 30, 5500.00, 'USD', 'BANCA_WEB', 'TRANSFERENCIA', '2026-01-28 14:15:00', NULL, 'PENDIENTE', 'WEB-20260128-003', 'DEP-20260128-000003', 'Banco del Austro', NULL, 'Pendiente confirmación banco origen', 'BANCA_WEB', '181.211.56.78');

/*==============================================================*/
/* 6. RESUMEN DE DATOS INSERTADOS                               */
/*==============================================================*/
/*
   TABLA               | REGISTROS
   --------------------|----------
   PERSONA             | 30
   PERSONA_NATURAL     | 30
   CUENTA              | 30
   CAJERO              | 30
   DEPOSITOS           | 30
   --------------------|----------
   TOTAL               | 150 registros

   DISTRIBUCIÓN DE DEPÓSITOS POR CANAL:
   - CAJERO:        5 registros
   - VENTANILLA:    5 registros  
   - CHEQUE:        5 registros
   - TRANSFERENCIA: 5 registros
   - APP_MOVIL:     5 registros
   - BANCA_WEB:     5 registros
   
   DISTRIBUCIÓN POR ESTADO:
   - PROCESADO:  26 registros
   - PENDIENTE:   2 registros
   - RECHAZADO:   2 registros
*/
