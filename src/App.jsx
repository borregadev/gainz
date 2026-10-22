import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "demo-app.firebaseapp.com",
    projectId: "demo-app",
    storageBucket: "demo-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:123456789"
};

// Initialize Firebase safely
let app;
let auth;
let db;

try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (e) {
    console.warn("Firebase initialization skipped or failed, using local storage fallback:", e);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'gainz-tracker-app';

const ChevronUp = () => (
    <svg className="w-6 h-6 text-pink-500 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const ChevronDown = () => (
    <svg className="w-6 h-6 text-gray-500 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const DumbbellIcon = () => (
    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 5a1 1 0 011 1v3h10V6a1 1 0 112 0v12a1 1 0 11-2 0v-3H7v3a1 1 0 11-2 0V6a1 1 0 011-1zM3 8a1 1 0 011-1h1v10H4a1 1 0 01-1-1V8zm17-1a1 1 0 011 1v8a1 1 0 01-1 1h-1V7h1z" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const MinusIcon = () => (
    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PlayIcon = () => (
    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const TrophyIcon = () => (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4a5 5 0 005 5h4a5 5 0 005-5V3M5 3h14M5 3H3v4a7 7 0 007 7h0a7 7 0 007-7V3h-2M12 12v9m-4 0h8" />
    </svg>
);

const ActivityIcon = () => (
    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const FireIcon = () => (
    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
);

const routineData = [
    {
        id: "day1",
        title: "Day 1: Push & Quads Focus",
        exercises: [
            { id: "d1_e1", name: "Flat Barbell or DB Press", sets: 3, reps: "5-8", type: "Strength", defaultTimerSec: 150, note: "Go heavy. Leave 1-2 reps in the tank." },
            { id: "d1_e2", name: "Leg Press or Hack Squat", sets: 3, reps: "6-8", type: "Strength", defaultTimerSec: 150, note: "Deep range of motion." },
            { id: "d1_e3", name: "Cable Crossovers", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 75, note: "Constant tension. Drop set on the final set." },
            { id: "d1_e4", name: "Overhead Triceps Extensions", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 75, note: "Focus on the stretch at the bottom." },
            { id: "d1_e5", name: "Triceps Rope Pushdowns", sets: 2, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 60, note: "Rest-pause on the final set." }
        ]
    },
    {
        id: "day2",
        title: "Day 2: Pull & Posterior Focus",
        exercises: [
            { id: "d2_e1", name: "Romanian Deadlifts (RDLs)", sets: 3, reps: "5-8", type: "Strength", defaultTimerSec: 150, note: "Heavy load. Push hips back." },
            { id: "d2_e2", name: "Weighted Pull-ups or Lat Pulldowns", sets: 3, reps: "6-8", type: "Strength", defaultTimerSec: 120, note: "Control the eccentric phase." },
            { id: "d2_e3", name: "Seated Cable Rows", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 75, note: "Squeeze the shoulder blades. Drop set on final set." },
            { id: "d2_e4", name: "Incline Dumbbell Bicep Curls", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 75, note: "Keep elbows pinned back." },
            { id: "d2_e5", name: "Cable Hammer Curls", sets: 2, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 60, note: "Rest-pause on the final set." }
        ]
    },
    {
        id: "day3",
        title: "Day 3: Full Body Blend Focus",
        exercises: [
            { id: "d3_e1", name: "Heavy Goblet Squats", sets: 3, reps: "6-8", type: "Strength", defaultTimerSec: 150, note: "Hold a heavy dumbbell vertically against your chest. Sink deep." },
            { id: "d3_e2", name: "Incline Dumbbell Press", sets: 3, reps: "6-8", type: "Strength", defaultTimerSec: 120, note: "Heavy pressing for the upper chest." },
            { id: "d3_e3", name: "Straight-Arm Pulldowns", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 75, note: "Isolate the lats. Rest-pause on final set." },
            { id: "d3_e4", name: "Cable Pull-Throughs", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 75, note: "Face away from low cable, hinge at hips." },
            { id: "d3_e5", name: "Biceps/Triceps Superset", sets: 3, reps: "12-15", type: "Hypertrophy", defaultTimerSec: 90, note: "EZ-Bar Curls paired with Skull Crushers." }
        ]
    }
];

const routinesList = [
    {
        id: "routine_split_3day",
        name: "3-Day Hypertrophy & Strength Split",
        tagline: "Full push/pull & body blend frequency",
        days: routineData
    }
];

export default function App() {
    const [user, setUser] = useState(null);
    const [mainTab, setMainTab] = useState("workout"); // "workout" | "insights"
    const [selectedRoutineId] = useState("routine_split_3day");
    const [activeTab, setActiveTab] = useState("day1");
    const [isRoutineVisible, setIsRoutineVisible] = useState(true);
    const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
    
    // Custom timer durations per exercise ID (in seconds)
    const [customExerciseTimers, setCustomExerciseTimers] = useState({});
    const [editingTimerExId, setEditingTimerExId] = useState(null);
    const [editMin, setEditMin] = useState(0);
    const [editSec, setEditSec] = useState(0);

    // Weight & Reps tracking per set
    const [setWeights, setSetWeights] = useState({});
    const [setReps, setSetReps] = useState({});
    const [completedSets, setCompletedSets] = useState({});

    // Session Workout Tracking State
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workoutSummaries, setWorkoutSummaries] = useState({});
    
    // Calendar Completed Logs History
    const [completedWorkoutLogs, setCompletedWorkoutLogs] = useState({});
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

    const workoutTimerRef = useRef(null);

    const [timerState, setTimerState] = useState({
        active: false,
        exerciseName: "",
        targetEndTime: null,
        pausedTimeRemaining: null,
        durationTotal: 90,
        isRunning: false,
        isFinished: false
    });

    const [currentDisplaySec, setCurrentDisplaySec] = useState(0);
    const timerIntervalRef = useRef(null);

    useEffect(() => {
        document.title = "Gainz";
    }, []);

    const playTimerFinishedSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const playBeep = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(ctx.currentTime + startTime);
                osc.stop(ctx.currentTime + startTime + duration);
            };

            playBeep(880, 0, 0.15);     // A5
            playBeep(1046.5, 0.2, 0.35); // C6
        } catch (e) {
            console.error("Audio playback error:", e);
        }
    };

    const [userNotes, setUserNotes] = useState(() => {
        const initial = {};
        routineData.forEach(day => {
            day.exercises.forEach(ex => {
                initial[ex.id] = ex.note;
            });
        });
        return initial;
    });

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('gainz_tracker_local_data');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.completedWorkoutLogs) setCompletedWorkoutLogs(parsed.completedWorkoutLogs);
                if (parsed.setWeights) setSetWeights(parsed.setWeights);
                if (parsed.setReps) setSetReps(parsed.setReps);
                if (parsed.completedSets) setCompletedSets(parsed.completedSets);
                if (parsed.workoutSummaries) setWorkoutSummaries(parsed.workoutSummaries);
                if (parsed.userNotes) setUserNotes(parsed.userNotes);
                if (parsed.customExerciseTimers) setCustomExerciseTimers(parsed.customExerciseTimers);
            }
        } catch (e) {
            console.error("Error reading local storage:", e);
        }

        const initAuth = async () => {
            if (!auth) return;
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "demo-api-key") {
                    await signInAnonymously(auth);
                }
            } catch (err) {
                console.warn("Firebase auth not configured. App running in local mode:", err.message);
            }
        };
        
        initAuth();
        let unsubscribe = () => {};
        if (auth) {
            unsubscribe = onAuthStateChanged(auth, (u) => {
                setUser(u);
            });
        }

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user || !db) return;

        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workout_tracker', 'data');

        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    if (data.completedWorkoutLogs) setCompletedWorkoutLogs(data.completedWorkoutLogs);
                    if (data.setWeights) setSetWeights(data.setWeights);
                    if (data.setReps) setSetReps(data.setReps);
                    if (data.completedSets) setCompletedSets(data.completedSets);
                    if (data.workoutSummaries) setWorkoutSummaries(data.workoutSummaries);
                    if (data.userNotes) setUserNotes(data.userNotes);
                    if (data.customExerciseTimers) setCustomExerciseTimers(data.customExerciseTimers);
                }
            },
            (error) => {
                console.warn("Firestore listener warning (using local fallback):", error.message);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const syncDataToCloud = async (updatedFields) => {
        try {
            const currentLocal = JSON.parse(localStorage.getItem('gainz_tracker_local_data') || '{}');
            const merged = { ...currentLocal, ...updatedFields };
            localStorage.setItem('gainz_tracker_local_data', JSON.stringify(merged));
        } catch (e) {
            console.error("LocalStorage save error:", e);
        }

        if (!user || !db) return;
        try {
            const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workout_tracker', 'data');
            await setDoc(docRef, updatedFields, { merge: true });
        } catch (err) {
            console.warn("Failed to sync data to Firestore (saved locally instead):", err.message);
        }
    };

    const handleClearAllData = async () => {
        setCompletedWorkoutLogs({});
        setSetWeights({});
        setSetReps({});
        setCompletedSets({});
        setWorkoutSummaries({});
        setCustomExerciseTimers({});
        
        const resetNotes = {};
        routineData.forEach(day => {
            day.exercises.forEach(ex => {
                resetNotes[ex.id] = ex.note;
            });
        });
        setUserNotes(resetNotes);

        try {
            localStorage.removeItem('gainz_tracker_local_data');
        } catch (e) {
            console.error("Error clearing local storage:", e);
        }

        if (user && db) {
            try {
                const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workout_tracker', 'data');
                await setDoc(docRef, {
                    completedWorkoutLogs: {},
                    setWeights: {},
                    setReps: {},
                    completedSets: {},
                    workoutSummaries: {},
                    userNotes: resetNotes,
                    customExerciseTimers: {}
                });
            } catch (err) {
                console.warn("Error clearing Firestore data:", err);
            }
        }

        setShowClearConfirmModal(false);
    };

    const handleStartEditingTimer = (ex) => {
        const totalSec = getExerciseTimerSec(ex);
        setEditMin(Math.floor(totalSec / 60));
        setEditSec(totalSec % 60);
        setEditingTimerExId(ex.id);
    };

    const handleSaveEditingTimer = (exerciseId) => {
        const m = Math.max(0, parseInt(editMin, 10) || 0);
        const s = Math.max(0, Math.min(59, parseInt(editSec, 10) || 0));
        const total = Math.max(5, m * 60 + s);
        const updated = { ...customExerciseTimers, [exerciseId]: total };
        setCustomExerciseTimers(updated);
        syncDataToCloud({ customExerciseTimers: updated });
        setEditingTimerExId(null);
    };

    const getExerciseTimerSec = (ex) => {
        return customExerciseTimers[ex.id] || ex.defaultTimerSec;
    };

    const formatTimerLabel = (totalSec) => {
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        if (m > 0 && s > 0) return `${m}m ${s}s`;
        if (m > 0) return `${m}m`;
        return `${s}s`;
    };

    useEffect(() => {
        if (activeWorkout && !activeWorkout.isPaused) {
            workoutTimerRef.current = setInterval(() => {
                setActiveWorkout(prev => prev ? ({
                    ...prev,
                    durationSec: prev.durationSec + 1
                }) : null);
            }, 1000);
        } else {
            clearInterval(workoutTimerRef.current);
        }
        return () => clearInterval(workoutTimerRef.current);
    }, [activeWorkout?.dayId, activeWorkout?.isPaused]);

    useEffect(() => {
        const updateTimerDisplay = () => {
            if (!timerState.active) return;

            if (timerState.isRunning && timerState.targetEndTime) {
                const now = Date.now();
                const diffMs = timerState.targetEndTime - now;
                const remainingSec = Math.max(0, Math.ceil(diffMs / 1000));

                setCurrentDisplaySec(remainingSec);

                if (remainingSec <= 0 && !timerState.isFinished) {
                    setTimerState(prev => ({ ...prev, isRunning: false, isFinished: true }));
                    playTimerFinishedSound();
                }
            } else if (!timerState.isRunning && timerState.pausedTimeRemaining !== null) {
                setCurrentDisplaySec(Math.ceil(timerState.pausedTimeRemaining / 1000));
            }
        };

        updateTimerDisplay();

        if (timerState.active && timerState.isRunning) {
            timerIntervalRef.current = setInterval(updateTimerDisplay, 250);
        } else {
            clearInterval(timerIntervalRef.current);
        }

        return () => clearInterval(timerIntervalRef.current);
    }, [timerState.active, timerState.isRunning, timerState.targetEndTime, timerState.pausedTimeRemaining, timerState.isFinished]);

    const startWorkoutDay = (dayId) => {
        setActiveWorkout({
            dayId,
            startTime: Date.now(),
            durationSec: 0,
            isPaused: false
        });
    };

    const finishWorkoutDay = (dayId) => {
        if (activeWorkout && activeWorkout.dayId === dayId) {
            const today = new Date();
            const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const timeFormatted = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const dayObj = routineData.find(d => d.id === dayId);
            const dayTitle = dayObj ? dayObj.title : dayId;

            let completedCount = 0;
            if (dayObj) {
                dayObj.exercises.forEach(ex => {
                    for (let i = 0; i < ex.sets; i++) {
                        if (completedSets[`${ex.id}_set_${i}`]) {
                            completedCount++;
                        }
                    }
                });
            }

            const newLogEntry = {
                id: Date.now().toString(),
                dayId,
                dayTitle,
                finishedAt: timeFormatted,
                durationSec: activeWorkout.durationSec,
                setsCompleted: completedCount,
                dateKey
            };

            const updatedSummaries = {
                ...workoutSummaries,
                [dayId]: {
                    durationSec: activeWorkout.durationSec,
                    finishedAt: timeFormatted
                }
            };

            const updatedLogs = {
                ...completedWorkoutLogs,
                [dateKey]: [...(completedWorkoutLogs[dateKey] || []), newLogEntry]
            };

            setWorkoutSummaries(updatedSummaries);
            setCompletedWorkoutLogs(updatedLogs);

            syncDataToCloud({
                workoutSummaries: updatedSummaries,
                completedWorkoutLogs: updatedLogs,
                completedSets,
                setWeights,
                setReps,
                userNotes
            });

            setSelectedCalendarDay(dateKey);
            setActiveWorkout(null);
        }
    };

    const formatWorkoutDuration = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}m ${s < 10 ? '0' : ''}${s}s`;
    };

    const startRestTimer = (exerciseName, seconds = 90) => {
        const targetEndTime = Date.now() + seconds * 1000;
        setTimerState({
            active: true,
            exerciseName,
            targetEndTime,
            pausedTimeRemaining: null,
            durationTotal: seconds,
            isRunning: true,
            isFinished: false
        });
        setCurrentDisplaySec(seconds);
    };

    const togglePauseTimer = () => {
        if (timerState.isRunning) {
            const remainingMs = Math.max(0, timerState.targetEndTime - Date.now());
            setTimerState(prev => ({
                ...prev,
                isRunning: false,
                pausedTimeRemaining: remainingMs,
                targetEndTime: null
            }));
        } else {
            const remainingMs = timerState.pausedTimeRemaining || (currentDisplaySec * 1000);
            const newTargetEndTime = Date.now() + remainingMs;
            setTimerState(prev => ({
                ...prev,
                isRunning: true,
                targetEndTime: newTargetEndTime,
                pausedTimeRemaining: null
            }));
        }
    };

    const resetTimer = () => {
        const newTargetEndTime = Date.now() + timerState.durationTotal * 1000;
        setTimerState(prev => ({
            ...prev,
            targetEndTime: newTargetEndTime,
            pausedTimeRemaining: null,
            isRunning: true,
            isFinished: false
        }));
        setCurrentDisplaySec(timerState.durationTotal);
    };

    const dismissTimer = () => {
        setTimerState(prev => ({ ...prev, active: false, isRunning: false }));
    };

    const addTimerSeconds = (sec) => {
        if (timerState.isRunning && timerState.targetEndTime) {
            const updatedTarget = timerState.targetEndTime + sec * 1000;
            setTimerState(prev => ({ ...prev, targetEndTime: updatedTarget }));
            setCurrentDisplaySec(prev => prev + sec);
        } else if (timerState.pausedTimeRemaining !== null) {
            const updatedRemaining = timerState.pausedTimeRemaining + sec * 1000;
            setTimerState(prev => ({ ...prev, pausedTimeRemaining: updatedRemaining }));
            setCurrentDisplaySec(Math.ceil(updatedRemaining / 1000));
        }
    };

    const formatTimerDisplay = (totalSec) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNoteChange = (id, text) => {
        const updated = { ...userNotes, [id]: text };
        setUserNotes(updated);
        syncDataToCloud({ userNotes: updated });
    };

    const handleSetWeightChange = (exerciseId, setIndex, weight) => {
        const key = `${exerciseId}_set_${setIndex}`;
        const updated = { ...setWeights, [key]: weight };
        setSetWeights(updated);
        syncDataToCloud({ setWeights: updated });
    };

    const handleSetRepsChange = (exerciseId, setIndex, reps) => {
        const key = `${exerciseId}_set_${setIndex}`;
        const updated = { ...setReps, [key]: reps };
        setSetReps(updated);
        syncDataToCloud({ setReps: updated });
    };

    const adjustWeight = (exerciseId, setIndex, delta) => {
        const key = `${exerciseId}_set_${setIndex}`;
        const current = parseFloat(setWeights[key]) || 0;
        const value = Math.max(0, current + delta);
        const updatedVal = Number(value.toFixed(1)).toString();
        const updatedMap = { ...setWeights, [key]: updatedVal };
        setSetWeights(updatedMap);
        syncDataToCloud({ setSetWeights: updatedMap });
    };

    const adjustReps = (exerciseId, setIndex, delta) => {
        const key = `${exerciseId}_set_${setIndex}`;
        const current = parseInt(setReps[key], 10) || 0;
        const value = Math.max(0, current + delta);
        const updatedVal = value.toString();
        const updatedMap = { ...setReps, [key]: updatedVal };
        setSetReps(updatedMap);
        syncDataToCloud({ setSetReps: updatedMap });
    };

    const toggleSetComplete = (exerciseId, setIndex, exName, defaultSec) => {
        const key = `${exerciseId}_set_${setIndex}`;
        const nextState = !completedSets[key];
        
        const updated = {
            ...completedSets,
            [key]: nextState
        };

        setCompletedSets(updated);
        syncDataToCloud({ completedSets: updated });

        if (nextState) {
            startRestTimer(exName, defaultSec);
        }
    };

    const activeRoutine = routinesList.find(r => r.id === selectedRoutineId) || routinesList[0];
    const totalCompletedSetsCount = Object.values(completedSets).filter(Boolean).length;
    
    let totalVolumeKg = 0;
    let maxWeightLifted = 0;
    let maxWeightExercise = "N/A";

    routineData.forEach(day => {
        day.exercises.forEach(ex => {
            for (let i = 0; i < ex.sets; i++) {
                const key = `${ex.id}_set_${i}`;
                if (completedSets[key]) {
                    const w = parseFloat(setWeights[key]) || 0;
                    const r = parseInt(setReps[key], 10) || 0;
                    totalVolumeKg += w * r;

                    if (w > maxWeightLifted) {
                        maxWeightLifted = w;
                        maxWeightExercise = ex.name;
                    }
                }
            }
        });
    });

    const totalPossibleSets = routineData.reduce((acc, day) => {
        return acc + day.exercises.reduce((exAcc, ex) => exAcc + ex.sets, 0);
    }, 0);

    const completionRatePercent = totalPossibleSets > 0 
        ? Math.round((totalCompletedSetsCount / totalPossibleSets) * 100) 
        : 0;

    // Calculate Workouts This Week (starting from Monday of current week)
    const getWorkoutsThisWeekCount = () => {
        const now = new Date();
        const currentDayOfWeek = now.getDay(); // 0 is Sunday
        const distanceToMonday = (currentDayOfWeek + 6) % 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - distanceToMonday);
        monday.setHours(0, 0, 0, 0);

        let count = 0;
        Object.entries(completedWorkoutLogs).forEach(([dateStr, logs]) => {
            const [y, m, d] = dateStr.split('-').map(Number);
            const logDate = new Date(y, m - 1, d);
            if (logDate >= monday && logDate <= now) {
                count += logs.length;
            }
        });
        return count;
    };

    const workoutsThisWeek = getWorkoutsThisWeekCount();

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const prevMonth = () => {
        setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const monthName = calendarDate.toLocaleString('default', { month: 'long' });

    const totalWorkoutsLoggedCount = Object.values(completedWorkoutLogs).reduce((acc, list) => acc + list.length, 0);

    return (
        <div className="min-h-screen bg-[#0f0f13] text-gray-200 font-sans pb-28 selection:bg-pink-500 selection:text-white">
            <header className="pt-8 pb-4 px-4 sticky top-0 bg-[#0f0f13]/90 backdrop-blur-md z-20 border-b border-gray-800">
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center">
                        Gainz
                    </h1>

                    {/* Navigation Tabs Bar */}
                    <div className="flex items-center gap-2 bg-[#181822] p-1.5 rounded-xl border border-gray-800/80 w-full max-w-xs shadow-inner">
                        <button
                            type="button"
                            onClick={() => setMainTab("workout")}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                mainTab === "workout"
                                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                            }`}
                        >
                            <DumbbellIcon />
                            <span>Workout</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMainTab("insights")}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                mainTab === "insights"
                                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                            }`}
                        >
                            <TrendingUpIcon />
                            <span>Insights</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
                {mainTab === "insights" ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Summary Overview Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="bg-[#181820] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-start">
                                <div className="p-2 bg-orange-500/10 rounded-lg mb-2">
                                    <FireIcon />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">This Week</span>
                                <span className="text-xl font-black text-orange-400 mt-0.5">{workoutsThisWeek} <span className="text-xs text-gray-400 font-normal">session{workoutsThisWeek === 1 ? '' : 's'}</span></span>
                            </div>

                            <div className="bg-[#181820] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-start">
                                <div className="p-2 bg-pink-500/10 rounded-lg mb-2">
                                    <ActivityIcon />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Volume</span>
                                <span className="text-xl font-black text-white mt-0.5">{totalVolumeKg.toLocaleString()} <span className="text-xs text-gray-400 font-normal">kg</span></span>
                            </div>

                            <div className="bg-[#181820] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-start">
                                <div className="p-2 bg-purple-500/10 rounded-lg mb-2">
                                    <CheckCircleIcon />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">All Sessions</span>
                                <span className="text-xl font-black text-emerald-400 mt-0.5">{totalWorkoutsLoggedCount}</span>
                            </div>

                            <div className="bg-[#181820] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-start">
                                <div className="p-2 bg-amber-500/10 rounded-lg mb-2">
                                    <TrophyIcon />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Top Lift</span>
                                <span className="text-xl font-black text-white mt-0.5">{maxWeightLifted} <span className="text-xs text-gray-400 font-normal">kg</span></span>
                            </div>

                            <div className="bg-[#181820] border border-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-start col-span-2 sm:col-span-1">
                                <div className="p-2 bg-indigo-500/10 rounded-lg mb-2">
                                    <CalendarIcon />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Completion</span>
                                <span className="text-xl font-black text-white mt-0.5">{completionRatePercent}%</span>
                            </div>
                        </div>

                        {/* Calendar Component */}
                        <div className="bg-[#1c1c24] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400">
                                        <CalendarIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-white">Workout Log Calendar</h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button" 
                                        onClick={prevMonth}
                                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                                    >
                                        <ChevronLeftIcon />
                                    </button>
                                    <span className="text-xs font-bold text-gray-200 min-w-[100px] text-center">
                                        {monthName} {year}
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={nextMonth}
                                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                                    >
                                        <ChevronRightIcon />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Days Header */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                    <span key={i} className="text-[10px] font-bold uppercase text-gray-500 py-1">
                                        {d}
                                    </span>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1.5">
                                {Array.from({ length: firstDayIndex }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent"></div>
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const formattedDateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                    const dayLogs = completedWorkoutLogs[formattedDateKey] || [];
                                    const hasWorkout = dayLogs.length > 0;
                                    const isSelected = selectedCalendarDay === formattedDateKey;

                                    const today = new Date();
                                    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNum;

                                    return (
                                        <button
                                            key={dayNum}
                                            type="button"
                                            onClick={() => setSelectedCalendarDay(isSelected ? null : formattedDateKey)}
                                            className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all relative ${
                                                hasWorkout
                                                    ? 'bg-gradient-to-b from-pink-500/20 to-purple-500/20 border-pink-500/50 hover:border-pink-400 text-white shadow-md'
                                                    : isToday
                                                    ? 'bg-gray-800/80 border-purple-500/50 text-purple-300'
                                                    : 'bg-[#141419] border-gray-800/80 text-gray-400 hover:border-gray-700'
                                            } ${isSelected ? 'ring-2 ring-pink-500 shadow-lg scale-105 z-10' : ''}`}
                                        >
                                            <span className={`text-xs font-bold ${hasWorkout ? 'text-white' : ''}`}>
                                                {dayNum}
                                            </span>

                                            {hasWorkout && (
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                    <span className="text-[9px] font-extrabold text-pink-300 hidden sm:inline">
                                                        {dayLogs.length} {dayLogs.length === 1 ? 'log' : 'logs'}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Details Panel for Selected Calendar Date */}
                            {selectedCalendarDay && (
                                <div className="mt-4 p-4 bg-[#141419] rounded-xl border border-pink-500/30 space-y-3 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                                            Saved Logs for {selectedCalendarDay}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCalendarDay(null)}
                                            className="text-gray-500 hover:text-white text-xs"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    {(completedWorkoutLogs[selectedCalendarDay] || []).length > 0 ? (
                                        <div className="space-y-2">
                                            {completedWorkoutLogs[selectedCalendarDay].map((log) => (
                                                <div key={log.id} className="bg-[#181822] p-3 rounded-lg border border-gray-800 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{log.dayTitle}</div>
                                                        <div className="text-[11px] text-gray-400 mt-0.5">
                                                            Completed at {log.finishedAt} • {log.setsCompleted} sets logged
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                                                        {formatWorkoutDuration(log.durationSec)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500 italic text-center py-2">
                                            No workouts logged on this day.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Routine Progress Card */}
                        <div className="bg-[#1c1c24] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                                <div>
                                    <h3 className="text-lg font-extrabold text-white">Routine Progress</h3>
                                    <p className="text-xs text-gray-400">{activeRoutine.name}</p>
                                </div>
                                <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                                    {completionRatePercent}% Overall
                                </span>
                            </div>

                            <div className="w-full bg-gray-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-gray-700/50">
                                <div 
                                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${completionRatePercent}%` }}
                                ></div>
                            </div>

                            <div className="space-y-3 pt-2">
                                {routineData.map(day => {
                                    let daySetsCount = 0;
                                    let daySetsCompleted = 0;

                                    day.exercises.forEach(ex => {
                                        daySetsCount += ex.sets;
                                        for (let i = 0; i < ex.sets; i++) {
                                            if (completedSets[`${ex.id}_set_${i}`]) {
                                                daySetsCompleted++;
                                            }
                                        }
                                    });

                                    const dayPercent = daySetsCount > 0 ? Math.round((daySetsCompleted / daySetsCount) * 100) : 0;

                                    return (
                                        <div key={day.id} className="bg-[#141419] p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-gray-200 truncate">{day.title}</div>
                                                <div className="text-[11px] text-gray-500 mt-0.5">{daySetsCompleted} of {daySetsCount} sets completed</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 bg-gray-800 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-pink-500 h-full rounded-full"
                                                        style={{ width: `${dayPercent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-300 w-8 text-right">{dayPercent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Personal Record Highlight Card */}
                        <div className="bg-[#1c1c24] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                <TrophyIcon />
                                <span>Personal Record Highlight</span>
                            </h3>
                            
                            <div className="bg-[#141419] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-gray-400">Heaviest Lift Logged</div>
                                    <div className="text-base font-bold text-gray-100 mt-1">{maxWeightExercise}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-pink-500">{maxWeightLifted} <span className="text-xs font-normal text-gray-400">kg</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Clear Stored Data Action in Insights Tab */}
                        <div className="pt-6 pb-2 flex flex-col items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setShowClearConfirmModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                            >
                                <TrashIcon />
                                <span>Clear All Stored Data</span>
                            </button>
                            <span className="text-[10px] text-gray-600 mt-2">Resets all logged sets, weight history, and custom rest timers</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Active Routine Toggle Card */}
                        <button
                            type="button"
                            onClick={() => setIsRoutineVisible(!isRoutineVisible)}
                            className="w-full bg-[#181820] hover:bg-[#1f1f2a] border border-gray-800 hover:border-pink-500/40 rounded-2xl p-6 shadow-lg text-center flex flex-col items-center gap-2 transition-all cursor-pointer group"
                        >
                            <span className="text-xs uppercase tracking-widest text-pink-500 font-extrabold">Active Routine</span>
                            <div className="flex items-center justify-center gap-3 w-full">
                                <h2 className="text-2xl sm:text-3xl font-black text-white">{activeRoutine.name}</h2>
                                {isRoutineVisible ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{activeRoutine.tagline}</p>
                        </button>

                        {/* Routine Days List */}
                        {isRoutineVisible && activeRoutine.days.map((day) => {
                            const isSessionActive = activeWorkout?.dayId === day.id;
                            const summary = workoutSummaries[day.id];

                            return (
                                <div key={day.id} className="bg-[#1c1c24] border border-gray-800/60 rounded-2xl overflow-hidden shadow-xl">
                                    {/* Day Header Bar */}
                                    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/40">
                                        <button 
                                            type="button"
                                            onClick={() => setActiveTab(activeTab === day.id ? null : day.id)}
                                            className="flex items-center justify-between sm:justify-start gap-3 text-left focus:outline-none hover:opacity-80 transition-opacity w-full sm:w-auto"
                                        >
                                            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 sm:gap-3">
                                                {day.id === "day1" && <span className="text-pink-500 font-extrabold">I</span>}
                                                {day.id === "day2" && <span className="text-purple-500 font-extrabold">II</span>}
                                                {day.id === "day3" && <span className="text-indigo-500 font-extrabold">III</span>}
                                                <span>{day.title.split(':')[1]}</span>
                                            </h2>
                                            {activeTab === day.id ? <ChevronUp /> : <ChevronDown />}
                                        </button>

                                        {/* Start / Finish Workout Actions */}
                                        <div className="flex items-center justify-end w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t border-gray-800/40 sm:border-t-0">
                                            {!isSessionActive ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveTab(day.id);
                                                        startWorkoutDay(day.id);
                                                    }}
                                                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
                                                >
                                                    <PlayIcon />
                                                    <span>Start Workout</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => finishWorkoutDay(day.id)}
                                                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-pink-500/20 cursor-pointer"
                                                >
                                                    <CheckCircleIcon />
                                                    <span>Finish Workout</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Session Progress Banner */}
                                    {isSessionActive && (
                                        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-emerald-400">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                                Workout Session In Progress
                                            </span>
                                            <span>Time: {formatWorkoutDuration(activeWorkout.durationSec)}</span>
                                        </div>
                                    )}

                                    {/* Finished Workout Banner */}
                                    {!isSessionActive && summary && (
                                        <div className="bg-gray-800/40 border-b border-gray-800/60 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-gray-400">
                                            <span>Last Workout Completed at {summary.finishedAt}</span>
                                            <span>Duration: {formatWorkoutDuration(summary.durationSec)}</span>
                                        </div>
                                    )}

                                    {/* Exercise Details Card */}
                                    {activeTab === day.id && (
                                        <div className="px-3 sm:px-6 pb-6 space-y-5 pt-4">
                                            {day.exercises.map((ex) => {
                                                return (
                                                    <div key={ex.id} className="bg-[#141419] p-4 sm:p-5 rounded-xl border border-gray-800/80 shadow-inner relative overflow-hidden">
                                                        <div className={`absolute top-0 left-0 w-1 h-full ${ex.type === 'Strength' ? 'bg-purple-500' : 'bg-pink-500'}`}></div>
                                                        
                                                        <div className="pl-1 sm:pl-2">
                                                            {/* Exercise Header */}
                                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                                <div className="flex-1 min-w-[180px]">
                                                                    <h3 className="font-bold text-base sm:text-lg text-gray-100 leading-tight">{ex.name}</h3>
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-2">
                                                                    {/* Rest Duration Controls */}
                                                                    {editingTimerExId === ex.id ? (
                                                                        <div className="flex items-center gap-1.5 bg-[#181822] p-1.5 rounded-lg border border-indigo-500/50 shadow-md">
                                                                            <ClockIcon />
                                                                            <div className="flex items-center justify-center gap-0.5 bg-[#0f0f13] px-1 py-0.5 rounded border border-gray-700">
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    max="59"
                                                                                    value={editMin}
                                                                                    onChange={(e) => setEditMin(e.target.value)}
                                                                                    className="w-7 bg-transparent text-xs font-bold text-indigo-300 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                                    placeholder="0"
                                                                                    autoFocus
                                                                                />
                                                                                <span className="text-[10px] text-gray-400 font-bold">m</span>
                                                                            </div>
                                                                            <span className="text-gray-500 font-bold text-xs">:</span>
                                                                            <div className="flex items-center justify-center gap-0.5 bg-[#0f0f13] px-1 py-0.5 rounded border border-gray-700">
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    max="59"
                                                                                    value={editSec}
                                                                                    onChange={(e) => setEditSec(e.target.value)}
                                                                                    className="w-7 bg-transparent text-xs font-bold text-indigo-300 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                                    placeholder="0"
                                                                                />
                                                                                <span className="text-[10px] text-gray-400 font-bold">s</span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleSaveEditingTimer(ex.id)}
                                                                                className="ml-1 px-2 py-0.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold rounded transition-colors"
                                                                            >
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleStartEditingTimer(ex)}
                                                                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-all active:scale-95 shrink-0 cursor-pointer"
                                                                            title="Click to adjust rest time"
                                                                        >
                                                                            <ClockIcon />
                                                                            <span>Rest: {formatTimerLabel(getExerciseTimerSec(ex))}</span>
                                                                        </button>
                                                                    )}

                                                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm border whitespace-nowrap ${
                                                                        ex.type === 'Strength' 
                                                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
                                                                        : 'bg-pink-500/10 text-pink-400 border-pink-500/30'
                                                                    }`}>
                                                                        {ex.type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2 text-gray-400 font-medium text-xs sm:text-sm mb-3">
                                                                <DumbbellIcon />
                                                                <span>Target: <strong className="text-gray-200">{ex.sets} Sets × {ex.reps} Reps</strong></span>
                                                            </div>

                                                            {/* Set Logging Area */}
                                                            <div className="bg-[#181822] rounded-xl p-3 sm:p-3.5 mb-4 border border-gray-800/70 space-y-2.5">
                                                                <div className="text-xs uppercase font-bold tracking-wider text-gray-400 pb-1 border-b border-gray-800/60 flex justify-between items-center">
                                                                    <span>Set Log</span>
                                                                    <span className="text-[11px] text-gray-500 font-normal">Weight & Reps</span>
                                                                </div>

                                                                <div className="space-y-3 pt-1">
                                                                    {Array.from({ length: ex.sets }).map((_, i) => {
                                                                        const setKey = `${ex.id}_set_${i}`;
                                                                        const isDone = !!completedSets[setKey];
                                                                        const weightValue = setWeights[setKey] || '';
                                                                        const repsValue = setReps[setKey] || '';

                                                                        return (
                                                                            <div 
                                                                                key={i} 
                                                                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 rounded-lg border transition-all ${
                                                                                    isDone 
                                                                                        ? 'bg-pink-500/10 border-pink-500/30' 
                                                                                        : 'bg-[#0f0f13] border-gray-800/80'
                                                                                }`}
                                                                            >
                                                                                {/* ROW 1 (Mobile): Set Label */}
                                                                                <div className="flex items-center justify-between sm:justify-start">
                                                                                    <span className="text-xs font-bold text-gray-300 w-12 shrink-0">
                                                                                        Set {i + 1}
                                                                                    </span>
                                                                                </div>

                                                                                {/* ROW 2 (Mobile): Weight & Reps Stepper Controls */}
                                                                                {isSessionActive ? (
                                                                                    <div className="flex items-center justify-center gap-3 w-full sm:w-auto my-0.5 sm:my-0">
                                                                                        {/* Weight Stepper */}
                                                                                        <div className="flex items-center justify-center gap-0.5 bg-[#181822] rounded-md p-1 border border-gray-700/80 shrink-0">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => adjustWeight(ex.id, i, -2.5)}
                                                                                                className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 active:bg-pink-600 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
                                                                                            >
                                                                                                <MinusIcon />
                                                                                            </button>

                                                                                            <div className="flex items-center justify-center px-1">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    step="0.5"
                                                                                                    min="0"
                                                                                                    value={weightValue}
                                                                                                    onChange={(e) => handleSetWeightChange(ex.id, i, e.target.value)}
                                                                                                    placeholder="0"
                                                                                                    className="w-10 bg-transparent border-none p-0 text-xs font-bold text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                                                />
                                                                                                <span className="text-[10px] font-bold text-gray-400 ml-0.5 select-none">
                                                                                                    kg
                                                                                                </span>
                                                                                            </div>

                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => adjustWeight(ex.id, i, 2.5)}
                                                                                                className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 active:bg-pink-600 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
                                                                                            >
                                                                                                <PlusIcon />
                                                                                            </button>
                                                                                        </div>

                                                                                        {/* Reps Stepper */}
                                                                                        <div className="flex items-center justify-center gap-0.5 bg-[#181822] rounded-md p-1 border border-gray-700/80 shrink-0">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => adjustReps(ex.id, i, -1)}
                                                                                                className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 active:bg-pink-600 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
                                                                                            >
                                                                                                <MinusIcon />
                                                                                            </button>

                                                                                            <div className="flex items-center justify-center px-1">
                                                                                                <input
                                                                                                    type="number"
                                                                                                    min="0"
                                                                                                    value={repsValue}
                                                                                                    onChange={(e) => handleSetRepsChange(ex.id, i, e.target.value)}
                                                                                                    placeholder="0"
                                                                                                    className="w-9 bg-transparent border-none p-0 text-xs font-bold text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                                                />
                                                                                                <span className="text-[10px] font-bold text-gray-400 ml-0.5 select-none whitespace-nowrap">
                                                                                                    reps
                                                                                                </span>
                                                                                            </div>

                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => adjustReps(ex.id, i, 1)}
                                                                                                className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 active:bg-pink-600 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
                                                                                            >
                                                                                                <PlusIcon />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-xs text-gray-500 italic py-1 sm:py-0">
                                                                                        Start workout to log sets
                                                                                    </div>
                                                                                )}

                                                                                {/* ROW 3 (Mobile): Full-width Log Set / Done Button */}
                                                                                {isSessionActive && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => toggleSetComplete(ex.id, i, ex.name, getExerciseTimerSec(ex))}
                                                                                        className={`w-full sm:w-20 h-10 sm:h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 shrink-0 cursor-pointer ${
                                                                                            isDone
                                                                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                                                                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                                                                        }`}
                                                                                    >
                                                                                        {isDone ? <CheckIcon /> : null}
                                                                                        <span>{isDone ? 'Done' : 'Log Set'}</span>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Exercise Notes */}
                                                            <div className="bg-[#1a1a21] rounded-lg p-3 border border-gray-800/50 flex items-start gap-3.5 focus-within:border-pink-500/50 transition-colors">
                                                                <EditIcon />
                                                                <div className="flex-1 flex flex-col gap-1">
                                                                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                                                                        Notes & Cue
                                                                    </label>
                                                                    <textarea
                                                                        rows={2}
                                                                        value={userNotes[ex.id] || ''}
                                                                        onChange={(e) => handleNoteChange(ex.id, e.target.value)}
                                                                        placeholder="Add your exercise notes or cues..."
                                                                        className="w-full bg-transparent border-none text-sm text-gray-200 italic leading-relaxed focus:outline-none focus:ring-0 resize-y"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Clear Data Confirmation Modal */}
            {showClearConfirmModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#181824] border border-gray-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center gap-3 text-red-400">
                            <div className="p-2 bg-red-500/10 rounded-xl">
                                <TrashIcon />
                            </div>
                            <h3 className="text-lg font-bold text-white">Reset All Tracker Data?</h3>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed">
                            This action will permanently delete all completed workouts, logged set history, saved weight entries, and custom timers. This cannot be undone.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowClearConfirmModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleClearAllData}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-colors cursor-pointer"
                            >
                                Yes, Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Rest Countdown Bar */}
            {timerState.active && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#181824]/95 backdrop-blur-xl border border-pink-500/40 shadow-2xl rounded-2xl p-4 z-50 text-white animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-2 rounded-xl flex items-center justify-center ${timerState.isFinished ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-pink-500/20 text-pink-400'}`}>
                                <ClockIcon />
                            </div>
                            <div className="truncate">
                                <div className="text-[10px] uppercase font-bold tracking-wider text-pink-400 truncate">
                                    {timerState.isFinished ? 'Rest Finished!' : `Resting • ${timerState.exerciseName}`}
                                </div>
                                <div className={`text-2xl font-black font-mono tracking-tight ${timerState.isFinished ? 'text-emerald-400' : 'text-white'}`}>
                                    {formatTimerDisplay(currentDisplaySec)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => addTimerSeconds(30)}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg border border-gray-700 transition-colors cursor-pointer"
                                title="Add 30 Seconds"
                            >
                                +30s
                            </button>

                            <button
                                type="button"
                                onClick={togglePauseTimer}
                                className="p-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white transition-colors active:scale-95 cursor-pointer"
                                title={timerState.isRunning ? 'Pause' : 'Resume'}
                            >
                                {timerState.isRunning ? <PauseIcon /> : <PlayIcon />}
                            </button>

                            <button
                                type="button"
                                onClick={resetTimer}
                                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg border border-gray-700 transition-colors cursor-pointer"
                                title="Reset Timer"
                            >
                                Reset
                            </button>

                            <button
                                type="button"
                                onClick={dismissTimer}
                                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Close Timer"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}