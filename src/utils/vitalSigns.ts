import { HealthFlow } from "@/reducer/healthflowReducer";

export type AgeGroup = 'bebê' | 'criança' | 'adulto' | 'idoso';

export const vitalSignsReference: {
    [key in AgeGroup]: {
        heartRate: number[];
        respiratoryRate: number[];
        bloodPressure: number[] | null;
        temperature: number[];
    };
} = {
    bebê: { heartRate: [100, 160], respiratoryRate: [30, 60], bloodPressure: [110, 75], temperature: [36.1, 37.2] },
    criança: { heartRate: [80, 120], respiratoryRate: [20, 30], bloodPressure: [120, 80], temperature: [36.1, 37.2] },
    adulto: { heartRate: [60, 100], respiratoryRate: [12, 20], bloodPressure: [139, 89], temperature: [36.1, 37.2] },
    idoso: { heartRate: [45, 90], respiratoryRate: [16, 25], bloodPressure: null, temperature: [36.1, 37.2] },
};

export function countAbnormalVitalSigns(flow: HealthFlow) {
    const patientAgeGroup = flow.patientAgeGroup;
    const patientGender = flow.patientGender;

    if (!patientAgeGroup || !vitalSignsReference.hasOwnProperty(patientAgeGroup)) {
        console.error(`Idade do paciente '${patientAgeGroup}' não é válida ou não encontrada.`);
        return 0;
    }

    const vitalSigns = vitalSignsReference[patientAgeGroup];
    console.log("------------------------------------------------------------");
    console.log(`Sinais vitais de referência para ${patientAgeGroup}:`, vitalSigns);

    let bloodPressureReference = vitalSigns.bloodPressure;
    if (patientAgeGroup === "idoso") {
        const originalBloodPressure = bloodPressureReference;
        bloodPressureReference = patientGender === "mulher" ? [134, 84] : [135, 88];
        console.log(`Pressão arterial ajustada para idoso (${patientGender}): de ${originalBloodPressure} para ${bloodPressureReference}`);
    }

    if (!flow.vitalData || flow.vitalData.length === 0) {
        console.log("Nenhum dado vital encontrado para este paciente.");
        return 0;
    }

    const lastVitalData = flow.vitalData[flow.vitalData.length - 1];
    console.log(`Últimos dados vitais para ${patientAgeGroup}:`, lastVitalData);

    let bloodPressureArray: number[] = [];
    if (typeof lastVitalData.bloodPressure === "string") {
        const splitBP = lastVitalData.bloodPressure.split("/").map(bp => parseInt(bp.trim(), 10));
        if (splitBP.length === 2 && !isNaN(splitBP[0]) && !isNaN(splitBP[1])) {
            bloodPressureArray = splitBP;
            console.log(`Pressão arterial convertida: ${bloodPressureArray}`);
        }
    }

    let abnormalCount = 0;

    if (lastVitalData.heartRate < vitalSigns.heartRate[0] || lastVitalData.heartRate > vitalSigns.heartRate[1]) {
        console.log(`Frequência cardíaca alterada: ${lastVitalData.heartRate} (esperado: ${vitalSigns.heartRate[0]}-${vitalSigns.heartRate[1]})`);
        abnormalCount++;
    }

    if (lastVitalData.respiratoryRate < vitalSigns.respiratoryRate[0] || lastVitalData.respiratoryRate > vitalSigns.respiratoryRate[1]) {
        console.log(`Frequência respiratória alterada: ${lastVitalData.respiratoryRate} (esperado: ${vitalSigns.respiratoryRate[0]}-${vitalSigns.respiratoryRate[1]})`);
        abnormalCount++;
    }

    if (lastVitalData.temperature < vitalSigns.temperature[0] || lastVitalData.temperature > vitalSigns.temperature[1]) {
        console.log(`Temperatura alterada: ${lastVitalData.temperature} (esperado: ${vitalSigns.temperature[0]}-${vitalSigns.temperature[1]})`);
        abnormalCount++;
    }

    if (bloodPressureArray.length === 2 && bloodPressureReference) {
        const [systolic, diastolic] = bloodPressureArray;
        const [systolicRef, diastolicRef] = bloodPressureReference;

        let message = "Pressão alterada:";
        let isAbnormal = false;

        if (systolic > systolicRef) {
            message += ` Sistólica ${systolic} (esperado: ${systolicRef})`;
            isAbnormal = true;
        }

        if (diastolic > diastolicRef) {
            message += ` Diastólica ${diastolic} (esperado: ${diastolicRef})`;
            isAbnormal = true;
        }

        if (isAbnormal) {
            console.log(message);
            abnormalCount++;
        }
    }

    return abnormalCount;
}
