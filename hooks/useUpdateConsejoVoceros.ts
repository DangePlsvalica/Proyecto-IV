import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { patch } from '@/lib/request/api';

interface VoceroUpdatePayload {
    consejoId: string;
    titularesComisionElectoralIds?: number[];
    suplentesComisionElectoralIds?: number[];
    titularesContraloriaIds?: number[];
    suplentesContraloriaIds?: number[];
    titularesFinanzasIds?: number[];
    suplentesFinanzasIds?: number[];
    voceriasEjecutivas?: {
        tipoVoceriaId: number;
        titularId?: number | null; 
        suplenteId?: number | null;
    }[];
}

export const useUpdateConsejoVoceros = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async ({ consejoId, ...data }: VoceroUpdatePayload) => {
            return patch({
                path: `/api/consejos/${consejoId}/voceros`,
                body: data,
            });
        },
        onSuccess: async (_, variables) => {
            toast.success('Vocerías actualizadas exitosamente');
            await queryClient.invalidateQueries({ queryKey: ['consejoscomunal'] });
            await queryClient.invalidateQueries({ queryKey: ['consejoscomunal', variables.consejoId] });
            router.push(`/consejos-comunales/${variables.consejoId}`);
        },
        onError: (error: Error) => {
            console.error('Error al actualizar voceros:', error);
            toast.error(error.message || 'Hubo un problema al actualizar las vocerías.');
        },
    });

    return mutation;
};