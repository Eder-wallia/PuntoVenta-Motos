// Datos de ejemplo de vehículos registrados
export const SAMPLE_VEHICLES = [
  {
    id: 1,
    vehicleType: 'motorcycle',
    clientName: 'Juan Pérez García',
    clientPhone: '3105551234',
    clientEmail: 'juan.perez@ejemplo.com',
    clientAddress: 'Calle Principal 123, Apto 4B',
    motorcycleBrand: 'Honda',
    carBrand: '',
    model: 'CB 500',
    color: 'Rojo',
    plates: 'ABC-1234',
    mileage: '15000',
    registrationDate: '2026-02-20',
  },
  {
    id: 2,
    vehicleType: 'car',
    clientName: 'María López Ruiz',
    clientPhone: '3185559876',
    clientEmail: 'maria.lopez@ejemplo.com',
    clientAddress: 'Avenida Central 456',
    motorcycleBrand: '',
    carBrand: 'Toyota',
    model: 'Corolla 2020',
    color: 'Blanco',
    plates: 'XYZ-5678',
    mileage: '32000',
    registrationDate: '2026-02-18',
  },
  {
    id: 3,
    vehicleType: 'motorcycle',
    clientName: 'Carlos Mendez',
    clientPhone: '3215554567',
    clientEmail: 'carlos.mendez@ejemplo.com',
    clientAddress: 'Carrera 10 No. 89-10',
    motorcycleBrand: 'Yamaha',
    carBrand: '',
    model: 'YZF-R3',
    color: 'Negro',
    plates: 'DEF-9012',
    mileage: '8500',
    registrationDate: '2026-02-15',
  },
];

// Funciones auxiliares para manejar vehículos
export function getVehicleDisplayName(vehicle) {
  const brand = vehicle.vehicleType === 'motorcycle' ? vehicle.motorcycleBrand : vehicle.carBrand;
  return `${brand} ${vehicle.model} - ${vehicle.plates}`;
}

export function getVehicleType(type) {
  return type === 'motorcycle' ? '🏍️ Moto' : '🚗 Carro';
}
