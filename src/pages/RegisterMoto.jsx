import { MOTORCYCLE_BRANDS, CAR_BRANDS } from "../constants/vehicleBrands";
import { useRegisterMoto } from "../hooks/useRegisterMoto";
import "./RegisterMoto.css";

export function RegisterMoto() {
  const {
    loading,
    error,
    success,
    vehicleType,
    formData,
    handleVehicleTypeChange,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useRegisterMoto();

  return (
    <div className="register-moto-container">
      <div className="register-card">
        <div className="register-header">
          <h1>🏍️ Registrar Vehiculo</h1>
          <p>Complete el formulario con los datos del cliente y del vehículo</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Sección: Tipo de Vehículo */}
          <fieldset className="form-section">
            <legend>Tipo de Vehículo</legend>

            <div className="vehicle-type-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vehicleType === "motorcycle"}
                  onChange={() => handleVehicleTypeChange("motorcycle")}
                  disabled={loading}
                />
                <span className="checkbox-text">🏍️ Moto</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vehicleType === "car"}
                  onChange={() => handleVehicleTypeChange("car")}
                  disabled={loading}
                />
                <span className="checkbox-text">🚗 Carro</span>
              </label>
            </div>
          </fieldset>

          {/* Sección: Datos Cliente */}
          <fieldset className="form-section">
            <legend>Datos Cliente</legend>

            <div className="form-group">
              <label htmlFor="clientName">Nombre cliente *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientPhone">Teléfono *</label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="Ej: 3123456789"
                  inputMode="numeric"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientEmail">Email *</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="Ej: juan@ejemplo.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="clientAddress">Domicilio *</label>
              <input
                type="text"
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="Ej: Calle Principal 123, Apt 4B"
                disabled={loading}
              />
            </div>
          </fieldset>

          {/* Sección: Datos Vehiculo */}
          {vehicleType && (
            <fieldset className="form-section">
              <legend>Datos Vehiculo</legend>

              {vehicleType === "motorcycle" && (
                <div className="form-group">
                  <label htmlFor="motorcycleBrand">Marca (Moto) *</label>
                  <select
                    id="motorcycleBrand"
                    name="motorcycleBrand"
                    value={formData.motorcycleBrand}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Selecciona marca de moto --</option>
                    {MOTORCYCLE_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {vehicleType === "car" && (
                <div className="form-group">
                  <label htmlFor="carBrand">Marca (Carro) *</label>
                  <select
                    id="carBrand"
                    name="carBrand"
                    value={formData.carBrand}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Selecciona marca de carro --</option>
                    {CAR_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="model">Modelo *</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ej: CB 500"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="color">Color *</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ej: Rojo"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="plates">Placas *</label>
                  <input
                    type="text"
                    id="plates"
                    name="plates"
                    value={formData.plates}
                    onChange={handleChange}
                    placeholder="Ej: ABC-1234"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mileage">Kilometraje *</label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="Ej: 15000"
                    min="0"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="clientAddress">Observaciones *</label>
                  <input
                    type="text"
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    placeholder="Ej: Golpe lado del conductor"
                    disabled={loading}
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar Vehiculo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterMoto;
