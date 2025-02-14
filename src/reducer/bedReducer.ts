import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

export interface Bed {
    id: string;
    number: string;
    ward: string;
    room: string;
    corridor: string;
    floor: string;
    status: boolean;
}

export interface BedState {
    beds: Bed[];
    loading: boolean;
    error: string | null;
}

const initialState: BedState = {
    beds: [],
    loading: false,
    error: null,
};

const bedSlice = createSlice({
    name: 'bed',
    initialState,
    reducers: {
        setBeds: (state, action: PayloadAction<Bed[]>) => {
            state.beds = action.payload;
        },
        addBed: (state, action: PayloadAction<Bed>) => {
            state.beds.push(action.payload);
        },
        editBed: (state, action: PayloadAction<Bed>) => {
            const index = state.beds.findIndex((bed) => bed.id === action.payload.id);
            if (index !== -1) {
                state.beds[index] = action.payload;
            }
        },
        removeBed: (state, action: PayloadAction<string>) => {
            state.beds = state.beds.filter((bed) => bed.id !== action.payload);
        },
    },
});

export const { setBeds, addBed, editBed, removeBed } = bedSlice.actions;
export default bedSlice.reducer;

export const fetchBeds = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'beds'));

        const beds = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                number: data.number || '',
                ward: data.ward || '',
                room: data.room || '',
                corridor: data.corridor || '',
                floor: data.floor || '',
                status: data.status || false,
            };
        });

        dispatch(setBeds(beds));
    } catch (error) {
        console.error("Error fetching beds: ", error);
    }
};

export const createBed = (bed: Omit<Bed, 'id'>) => async (dispatch: any) => {
    try {
        const bedRef = await addDoc(collection(db, 'beds'), bed);
        const newBed = { ...bed, id: bedRef.id };
        dispatch(addBed(newBed));
    } catch (error) {
        console.error(error);
    }
};

export const updateBed = (bed: Bed) => async (dispatch: any) => {
    try {
        const bedRef = doc(db, 'beds', bed.id);

        const updatedBed = {
            number: bed.number,
            ward: bed.ward,
            room: bed.room,
            corridor: bed.corridor,
            floor: bed.floor,
            status: bed.status,
        };

        await updateDoc(bedRef, updatedBed);
        dispatch(editBed(bed));
    } catch (error) {
        console.error("Error updating bed: ", error);
    }
};

export const deleteBed = (id: string) => async (dispatch: any) => {
    try {
        const bedRef = doc(db, 'beds', id);
        await deleteDoc(bedRef);
        dispatch(removeBed(id));
    } catch (error) {
        console.error(error);
    }
};
