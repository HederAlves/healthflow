import bedReducer from '@/reducer/bedReducer';
import doctorReducer from '@/reducer/doctorReducer';
import healthflowReducer from '@/reducer/healthflowReducer';
import nurseReducer from '@/reducer/nurseReducer';
import patientReducer from '@/reducer/patientReducer';
import residentReducer from '@/reducer/residentReducer';
import teamReducer from '@/reducer/teamReducer';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        nurse: nurseReducer,
        patient: patientReducer,
        bed: bedReducer,
        healthflow: healthflowReducer,
        resident: residentReducer,
        team: teamReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
