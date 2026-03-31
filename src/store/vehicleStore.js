import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useVehicleStore = create(
  persist(
    (set) => ({
      // Estado del formulario de registro de vehículo
      vehicleType: '',
      formData: {
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        motorcycleBrand: '',
        carBrand: '',
        model: '',
        color: '',
        plates: '',
        mileage: '',
        observations: '',
      },

      // Setters
      setVehicleType: (type) => set({ vehicleType: type }),
      setFormData: (data) => set({ formData: data }),
      updateFormField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      // Limpiar formulario
      clearForm: () =>
        set({
          vehicleType: '',
          formData: {
            clientName: '',
            clientPhone: '',
            clientEmail: '',
            clientAddress: '',
            motorcycleBrand: '',
            carBrand: '',
            model: '',
            color: '',
            plates: '',
            mileage: '',
            observations: '',
          },
        }),
    }),
    {
      name: 'vehicle-form-storage', // nombre de la clave en localStorage
    }
  )
);
