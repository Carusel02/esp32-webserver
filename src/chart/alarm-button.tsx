import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { database } from '@/auth/firebase-auth'; // Import your Firebase database instance
import { ref, set, onValue } from 'firebase/database';

export default function AlarmButton() {
    const [isAlarmOn, setIsAlarmOn] = useState(false);

    // Fetch the current trigger value from Firebase on component mount
    useEffect(() => {
        const triggerRef = ref(database, 'trigger');
        const unsubscribe = onValue(triggerRef, (snapshot) => {
            const triggerValue = snapshot.val();
            setIsAlarmOn(!!triggerValue); // Ensure it is a boolean
        });

        return () => unsubscribe(); // Cleanup the listener when the component unmounts
    }, []);

    // Function to update the trigger value in Firebase
    const updateTriggerInFirebase = (value: unknown) => {
        const triggerRef = ref(database, 'trigger'); // Reference to the 'trigger' node in the database
        set(triggerRef, value)
            .then(() => {
                console.log(`Trigger updated to ${value}`);
            })
            .catch((error) => {
                console.error('Error updating trigger:', error);
            });
    };

    // Toggle the alarm state
    const toggleAlarm = () => {
        const newAlarmState = !isAlarmOn;
        setIsAlarmOn(newAlarmState);
        updateTriggerInFirebase(newAlarmState); // Update Firebase with the new state
    };

    return (
        <Button
            onClick={toggleAlarm}
            className={`font-bold m-6 py-2 px-4 rounded-lg transition-colors duration-200 min-w-[200px] ${
                isAlarmOn
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-red-700 hover:bg-red-800 text-white'
            }`}
        >
            {isAlarmOn ? 'STOP ALARM' : 'START ALARM'}
        </Button>
    );
}

