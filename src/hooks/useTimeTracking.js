import { useState, useEffect, useRef } from 'react';

// Hook pentru tracking-ul timpului petrecut în cursuri
export const useTimeTracking = (userId, courseId, isActive = true) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // Începe tracking-ul
  const startTracking = () => {
    if (!isActive || isTracking) return;
    
    startTimeRef.current = Date.now();
    setIsTracking(true);
    
    // Actualizează timpul la fiecare minut
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // în minute
        setTimeSpent(prev => prev + 1); // Adaugă 1 minut
      }
    }, 60000); // La fiecare minut
    
    console.log('⏱️ Tracking început pentru cursul:', courseId);
  };

  // Oprește tracking-ul
  const stopTracking = () => {
    if (!isTracking) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // în minute
      setTimeSpent(prev => prev + Math.round(elapsed));
      startTimeRef.current = null;
    }
    
    setIsTracking(false);
    console.log('⏱️ Tracking oprit pentru cursul:', courseId, 'Timp total:', timeSpent, 'minute');
  };

  // Pause tracking-ul
  const pauseTracking = () => {
    if (!isTracking) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (startTimeRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // în minute
      setTimeSpent(prev => prev + Math.round(elapsed));
      startTimeRef.current = null;
    }
    
    setIsTracking(false);
    console.log('⏸️ Tracking pus pe pauză pentru cursul:', courseId);
  };

  // Resume tracking-ul
  const resumeTracking = () => {
    if (!isActive || isTracking) return;
    startTracking();
  };

  // Cleanup la unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start tracking când componenta devine activă
  useEffect(() => {
    if (isActive && !isTracking) {
      startTracking();
    } else if (!isActive && isTracking) {
      stopTracking();
    }
  }, [isActive]);

  // Auto-stop tracking când utilizatorul părăsește pagina
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTracking) {
        stopTracking();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isTracking) {
        pauseTracking();
      } else if (!document.hidden && !isTracking && isActive) {
        resumeTracking();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTracking, isActive]);

  return {
    timeSpent,
    isTracking,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking
  };
};
