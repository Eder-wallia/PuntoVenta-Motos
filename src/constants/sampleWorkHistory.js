// Datos de ejemplo para historial de trabajos
export const SAMPLE_WORK_HISTORY = {
  1: [
    {
      id: 'work-001',
      vehicleId: 1,
      date: new Date('2026-02-15'),
      services: [
        { description: 'Cambio de aceite', amount: 50000 },
        { description: 'Cambio de filtro', amount: 25000 }
      ],
      parts: [
        { name: 'Aceite sintético 10W-40', quantity: 2, cost: 45000 }
      ],
      labor: [
        { description: 'Mano de obra', price: 100000 }
      ],
      notes: 'Mantenimiento preventivo completado',
      status: 'completado'
    },
    {
      id: 'work-002',
      vehicleId: 1,
      date: new Date('2026-01-20'),
      services: [
        { description: 'Revisión general', amount: 80000 }
      ],
      parts: [
        { name: 'Pastillas de freno', quantity: 1, cost: 120000 }
      ],
      labor: [
        { description: 'Instalación', price: 50000 }
      ],
      notes: 'Se detectó desgaste en pastillas de freno',
      status: 'completado'
    }
  ],
  2: [
    {
      id: 'work-003',
      vehicleId: 2,
      date: new Date('2026-02-10'),
      services: [
        { description: 'Alineación y balanceo', amount: 150000 }
      ],
      parts: [
        { name: 'Llantas Michelin 195/60R15', quantity: 4, cost: 1200000 }
      ],
      labor: [
        { description: 'Instalación de llantas', price: 200000 }
      ],
      notes: 'Reemplazo de llantas desgastadas',
      status: 'completado'
    }
  ],
  3: [
    {
      id: 'work-004',
      vehicleId: 3,
      date: new Date('2026-02-05'),
      services: [
        { description: 'Diagnóstico OBD', amount: 60000 }
      ],
      parts: [],
      labor: [
        { description: 'Lectura de códigos', price: 0 }
      ],
      notes: 'Diagnóstico inicial - Sin problemas detectados',
      status: 'completado'
    }
  ]
};

export const getVehicleWorkHistory = (vehicleId) => {
  return SAMPLE_WORK_HISTORY[vehicleId] || [];
};

export const calculateWorkTotal = (work) => {
  const servicesTotal = work.services.reduce((sum, s) => sum + s.amount, 0);
  const partsTotal = work.parts.reduce((sum, p) => sum + (p.quantity * p.cost), 0);
  const laborTotal = work.labor.reduce((sum, l) => sum + l.price, 0);
  return servicesTotal + partsTotal + laborTotal;
};
