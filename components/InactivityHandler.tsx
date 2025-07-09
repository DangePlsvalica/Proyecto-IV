'use client'
import Button from "@/components/Button";
import { useEffect, useRef, useState } from 'react'
import { signOut } from 'next-auth/react'

const MAX_MINUTES = 30
const WARNING_MINUTES = 1

const InactivityHandler = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [isWarningPhase, setIsWarningPhase] = useState(false)

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

  // Solo se reinicia si NO está en la fase de advertencia
  const handleUserActivity = () => {
    if (!isWarningPhase) {
      startTimers()
    }
  }

  // El botón sí reinicia todo
  const handleContinueSession = () => {
    setShowWarning(false)
    setIsWarningPhase(false)
    startTimers()
  }

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, handleUserActivity))
    startTimers()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
      events.forEach((event) => window.removeEventListener(event, handleUserActivity))
    }
  }, [])

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
