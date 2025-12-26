import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../services/firebase';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import type { Technique } from '../types';

export const useCustomRoutines = () => {
    const { user } = useAuth();
    const [customTechniques, setCustomTechniques] = useState<Technique[]>([]);

    // Load from LocalStorage or Cloud
    useEffect(() => {
        const loadRoutines = async () => {
            if (user) {
                // Cloud Load
                const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'customRoutines'));
                const loaded: Technique[] = [];
                querySnapshot.forEach((doc) => {
                    loaded.push(doc.data() as Technique);
                });
                setCustomTechniques(loaded);
            } else {
                // Local Load
                if (typeof globalThis.window !== 'undefined') {
                    const raw = globalThis.window.localStorage.getItem('nebraCustomRoutines');
                    if (raw) {
                        setCustomTechniques(JSON.parse(raw));
                    } else {
                        setCustomTechniques([]);
                    }
                }
            }
        };
        loadRoutines();
    }, [user]);

    const saveRoutine = async (routine: Technique) => {
        const updated = [...customTechniques, routine];
        setCustomTechniques(updated);

        if (user) {
            // Save to Cloud
            await setDoc(doc(db, 'users', user.uid, 'customRoutines', routine.id), routine);
        } else {
            // Save to Local
            if (typeof globalThis.window !== 'undefined') {
                globalThis.window.localStorage.setItem('nebraCustomRoutines', JSON.stringify(updated));
            }
        }
    };

    const deleteRoutine = async (id: string) => {
        const updated = customTechniques.filter(t => t.id !== id);
        setCustomTechniques(updated);

        if (user) {
            // Delete from Cloud
            await deleteDoc(doc(db, 'users', user.uid, 'customRoutines', id));
        } else {
            // Delete from Local
            if (typeof globalThis.window !== 'undefined') {
                globalThis.window.localStorage.setItem('nebraCustomRoutines', JSON.stringify(updated));
            }
        }
    };

    return { customTechniques, saveRoutine, deleteRoutine };
};
