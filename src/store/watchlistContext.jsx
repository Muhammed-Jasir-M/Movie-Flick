import { createContext, useContext, useEffect, useCallback } from "react";
import { setDoc, doc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthContext } from "./authContext";
import { toast } from "react-toastify";

const WatchlistContext = createContext(null);
const GUEST_STORAGE_KEY = 'guest_watchlist';

export const WatchlistContextProvider = ({ children }) => {
    const { user } = useAuthContext();

    // Helper to get local guest watchlist
    const getGuestWatchlist = () => {
        try {
            const stored = localStorage.getItem(GUEST_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading guest watchlist:', error);
            return [];
        }
    };

    // Helper to save local guest watchlist
    const setGuestWatchlist = (items) => {
        try {
            localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving guest watchlist:', error);
        }
    };

    const addToWatchlist = async (userId, item, type) => {
        const docId = `${type}-${item.id}`;
        const itemData = {
            id: item.id,
            title: item.title || item.name,
            overview: item.overview || '',
            type,
            poster_path: item.poster_path || '',
            release_date: item.release_date || item.first_air_date || '',
            vote_average: item.vote_average || 0,
        };

        if (userId) {
            try {
                const watchlistRef = doc(db, "users", userId, "watchlist", docId);
                await setDoc(watchlistRef, itemData, { merge: true });
            } catch (error) {
                console.error('Error adding to Firebase watchlist:', error);
            }
        } else {
            // Guest mode via localStorage
            const localList = getGuestWatchlist();
            const exists = localList.some((i) => i.id === item.id);
            if (!exists) {
                const updated = [itemData, ...localList];
                setGuestWatchlist(updated);
            }
        }
    };

    const removeFromWatchlist = async (userId, item, type) => {
        const docId = `${type}-${item.id}`;
        if (userId) {
            try {
                const watchlistRef = doc(db, "users", userId, "watchlist", docId);
                await deleteDoc(watchlistRef);
            } catch (error) {
                console.error('Error removing from Firebase watchlist:', error);
            }
        } else {
            // Guest mode via localStorage
            const localList = getGuestWatchlist();
            const updated = localList.filter((i) => i.id !== item.id);
            setGuestWatchlist(updated);
        }
    };

    const fetchWatchlist = useCallback(async (userId) => {
        if (userId) {
            try {
                const watchlistRef = collection(db, "users", userId, "watchlist");
                const querySnapshot = await getDocs(watchlistRef);
                return querySnapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                }));
            } catch (error) {
                console.error('Error fetching Firebase watchlist:', error);
                return [];
            }
        } else {
            // Guest mode
            return getGuestWatchlist();
        }
    }, []);

    // Sync guest watchlist to Firebase when user signs in
    const syncGuestWatchlist = useCallback(async (userId) => {
        if (!userId) return;
        const guestItems = getGuestWatchlist();
        if (guestItems.length === 0) return;

        try {
            for (const item of guestItems) {
                const docId = `${item.type || 'movie'}-${item.id}`;
                const watchlistRef = doc(db, "users", userId, "watchlist", docId);
                await setDoc(watchlistRef, item, { merge: true });
            }
            localStorage.removeItem(GUEST_STORAGE_KEY);
            toast.info(`Synced ${guestItems.length} guest watchlist item(s) to your account!`);
        } catch (error) {
            console.error('Error syncing guest watchlist to Firebase:', error);
        }
    }, []);

    useEffect(() => {
        if (user?.uid) {
            syncGuestWatchlist(user.uid);
        }
    }, [user?.uid, syncGuestWatchlist]);

    return (
        <WatchlistContext.Provider value={{ fetchWatchlist, removeFromWatchlist, addToWatchlist, syncGuestWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlistContext = () => {
    return useContext(WatchlistContext);
};