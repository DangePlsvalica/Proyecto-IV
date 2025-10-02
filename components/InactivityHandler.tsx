'use client'
// Importamos 'useCallback'
import { useEffect, useRef, useState, useCallback } from 'react' 
import { signOut } from 'next-auth/react'
import Button from "@/components/Button";

const MAX_MINUTES = 30
const WARNING_MINUTES = 1

const InactivityHandler = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [isWarningPhase, setIsWarningPhase] = useState(false)

  // Esta función debe ser definida para que useCallback pueda usarla
  const startTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)

    // Timer para cerrar sesión
    timeoutRef.current = setTimeout(() => {
      signOut()
    }, MAX_MINUTES * 60 * 1000)

    // Timer para mostrar advertencia
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true)
      setIsWarningPhase(true)
    }, (MAX_MINUTES - WARNING_MINUTES) * 60 * 1000)
  }
  
  // Usamos useCallback para memoizar la función y que solo cambie si cambia 'isWarningPhase'.
  // Al incluirla en el array de dependencias del useEffect, la advertencia desaparece.
  const handleUserActivity = useCallback(() => {
    // Solo se reinicia si NO está en la fase de advertencia
    if (!isWarningPhase) {
      startTimers()
    }
  }, [isWarningPhase]) // <-- Incluimos isWarningPhase como dependencia de useCallback

  // El botón sí reinicia todo
  const handleContinueSession = () => {
    setShowWarning(false)
    setIsWarningPhase(false)
    startTimers()
  }

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    
    // Aquí es donde se usa handleUserActivity, la cual ahora es una dependencia segura
    events.forEach((event) => window.addEventListener(event, handleUserActivity))
    startTimers()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
      events.forEach((event) => window.removeEventListener(event, handleUserActivity))
    }
  // Añadimos handleUserActivity al array de dependencias. 
  // Esto ahora es seguro gracias a useCallback.
  }, [handleUserActivity]) 

  return (
    showWarning && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
          <h2 className="text-lg font-semibold mb-4">Sesión a punto de expirar</h2>
          <p className="mb-4">Por cuestiones de seguridad tu sesión se cerrará en menos de 1 minuto por inactividad.</p>
          <Button onClick={handleContinueSession} title="Seguir conectado" />
        </div>
      </div>
    )
  )
}

export default InactivityHandler
