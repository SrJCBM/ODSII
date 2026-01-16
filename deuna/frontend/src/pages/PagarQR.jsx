import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { usuarioAPI } from '../services/api';

export default function PagarQR() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const controlsRef = useRef(null);

  const stopScanning = useCallback(() => {
    // Ignorar errores al detener
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } finally {
        controlsRef.current = null;
      }
    }
    // También detener el video si existe
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleScan = useCallback(async (qrContent) => {
    setScanning(false);
    stopScanning();
    
    try {
      // Parsear QR: puede ser "CODIGO_QR" o "CODIGO_QR|MONTO"
      let qrCode = qrContent;
      let montoPreset = null;
      
      if (qrContent.includes('|')) {
        const parts = qrContent.split('|');
        qrCode = parts[0];
        montoPreset = parseFloat(parts[1]) || null;
      }
      
      const { data } = await usuarioAPI.getByQR(qrCode);
      navigate('/confirmar-pago', { 
        state: { 
          receptor: data, 
          qrCode,
          montoPreset // Pasar monto si viene en el QR
        } 
      });
    } catch {
      setError('QR no válido o usuario no encontrado');
      setTimeout(() => {
        setError('');
        setScanning(true);
      }, 2000);
    }
  }, [navigate, stopScanning]);

  const startScanning = useCallback(async (mountedRef) => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        if (mountedRef.current) {
          setError('No se encontró cámara disponible');
          setShowManual(true);
        }
        return;
      }

      // Preferir cámara trasera
      const selectedDevice = videoInputDevices.find(d => 
        d.label.toLowerCase().includes('back') || 
        d.label.toLowerCase().includes('trasera') ||
        d.label.toLowerCase().includes('rear') ||
        d.label.toLowerCase().includes('environment')
      ) || videoInputDevices[0];

      const controls = await codeReader.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoRef.current,
        (result) => {
          if (result && mountedRef.current) {
            handleScan(result.getText());
          }
        }
      );
      
      controlsRef.current = controls;
    } catch (err) {
      console.error('Error al iniciar cámara:', err);
      if (mountedRef.current) {
        setError('No se pudo acceder a la cámara');
        setShowManual(true);
      }
    }
  }, [handleScan]);

  useEffect(() => {
    const mountedRef = { current: true };
    
    if (scanning && !showManual) {
      startScanning(mountedRef);
    }
    
    return () => {
      mountedRef.current = false;
      stopScanning();
    };
  }, [scanning, showManual, startScanning, stopScanning]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScan(manualCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-black/30 backdrop-blur rounded-full text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white font-semibold text-lg">Escanear QR</h1>
        <button 
          onClick={() => navigate(-1)}
          className="text-white font-medium"
        >
          Salir
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {!showManual ? (
          <>
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              playsInline
            />
            
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 relative">
                {/* Corners */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg" />
                
                {/* Scanning line */}
                {scanning && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 animate-pulse" 
                    style={{ animation: 'scan 2s linear infinite' }}
                  />
                )}
              </div>
            </div>

            {/* Dark overlay outside scan area */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/60" 
                style={{ 
                  clipPath: 'polygon(0% 0%, 0% 100%, calc(50% - 128px) 100%, calc(50% - 128px) calc(50% - 128px), calc(50% + 128px) calc(50% - 128px), calc(50% + 128px) calc(50% + 128px), calc(50% - 128px) calc(50% + 128px), calc(50% - 128px) 100%, 100% 100%, 100% 0%)' 
                }} 
              />
            </div>
          </>
        ) : (
          <div className="w-full px-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ingresar código QR</h2>
              <form onSubmit={handleManualSubmit}>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Código del QR"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700 text-white rounded-xl font-semibold"
                >
                  Buscar
                </button>
              </form>
              <button
                onClick={() => {
                  setShowManual(false);
                  setScanning(true);
                }}
                className="w-full mt-3 py-3 text-purple-700 font-medium"
              >
                Volver a escanear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-24 left-4 right-4 bg-red-500 text-white p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Bottom options */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <p className="text-white text-center mb-4">
          Apunta la cámara al código QR
        </p>
        {!showManual && (
          <button
            onClick={() => setShowManual(true)}
            className="w-full py-3 bg-white/20 backdrop-blur text-white rounded-xl font-medium"
          >
            Ingresar código manualmente
          </button>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: calc(100% - 4px); }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}
