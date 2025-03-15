import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { AppDispatch } from '@/store/store';

export interface Team {
    id: string;
    specialty: string;
    bossId: string;
    doctorIds: string[];
    nurseIds: string[];
    residentIds: string[];
}

export interface TeamState {
    teams: Team[];
    loading: boolean;
    error: string | null;
}

const initialState: TeamState = {
    teams: [],
    loading: false,
    error: null,
};

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        setTeams: (state, action: PayloadAction<Team[]>) => {
            state.teams = action.payload;
        },
        addTeam: (state, action: PayloadAction<Team>) => {
            state.teams.push(action.payload);
        },
        editTeam: (state, action: PayloadAction<Team>) => {
            const index = state.teams.findIndex((team) => team.id === action.payload.id);
            if (index !== -1) {
                state.teams[index] = action.payload;
            }
        },
        removeTeam: (state, action: PayloadAction<string>) => {
            state.teams = state.teams.filter((team) => team.id !== action.payload);
        },
    },
});

export const { setTeams, addTeam, editTeam, removeTeam } = teamSlice.actions;

export default teamSlice.reducer;

export const fetchTeams = () => async (dispatch: AppDispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'teams'));
        const teamsList: Team[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Team[];
        dispatch(setTeams(teamsList));
    } catch (error) {
        console.error('Error fetching teams: ', error);
    }
};

export const createTeam = (team: Omit<Team, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const teamRef = await addDoc(collection(db, 'teams'), team);
        const newTeam = { ...team, id: teamRef.id };
        dispatch(addTeam(newTeam));
    } catch (error) {
        console.error('Error creating team: ', error);
    }
};

export const updateTeam = (team: Team) => async (dispatch: AppDispatch) => {
    try {
        if (!team.id || !team.specialty || !team.bossId || !team.doctorIds || !team.nurseIds || !team.residentIds) {
            console.error('Missing team fields, cannot update team.');
            return;
        }

        const teamRef = doc(db, 'teams', team.id);
        await updateDoc(teamRef, {
            specialty: team.specialty,
            bossId: team.bossId,
            doctorIds: team.doctorIds,
            nurseIds: team.nurseIds,
            residentIds: team.residentIds,
        });

        dispatch(editTeam(team));
    } catch (error) {
        console.error('Error updating team: ', error);
    }
};

export const deleteTeam = (id: string) => async (dispatch: AppDispatch) => {
    try {
        const teamRef = doc(db, 'teams', id);
        await deleteDoc(teamRef);
        dispatch(removeTeam(id));
    } catch (error) {
        console.error('Error deleting team: ', error);
    }
};
