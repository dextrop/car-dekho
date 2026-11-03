import { formatINRFull } from './format.js';

/** Spec rows shared by the variant detail and the compare table: [label, variant => value|null]. */
export const SPEC_ROWS = [
  ['Ex-showroom price', v => formatINRFull(v.price)],
  ['Fuel', v => v.data.fuel_type],
  ['Engine', v => v.data.engine],
  ['Displacement', v => v.data.displacement_cc ? `${v.data.displacement_cc} cc` : null],
  ['Transmission', v => v.data.transmission],
  ['Drivetrain', v => v.data.drivetrain],
  ['Power', v => v.data.power_ps ? `${v.data.power_ps} PS${v.data.power_kw ? ` (${v.data.power_kw} kW)` : ''}` : v.data.power_kw ? `${v.data.power_kw} kW` : null],
  ['Torque', v => v.data.torque_nm ? `${v.data.torque_nm} Nm` : null],
  ['Battery', v => v.data.battery_kwh ? `${v.data.battery_kwh} kWh` : null],
  ['Claimed efficiency / range', v => v.data.claimed_efficiency || (v.data.claimed_range_km ? `${v.data.claimed_range_km} km` : null)],
  ['Real-world range', v => v.data.real_world_range_km ? `${v.data.real_world_range_km} km` : null],
  ['DC fast charge', v => v.data.dc_fast_charge],
  ['AC charge', v => v.data.ac_charge],
  ['0–100 km/h', v => v.data.zero_to_100_s ? `${v.data.zero_to_100_s} s` : null],
  ['Seating', v => v.data.seating ?? v.data.seating_capacity ?? v.model.seats],
  ['Boot space', v => v.data.boot_space_litres ? `${v.data.boot_space_litres} L` : null],
  ['Series', v => v.data.series],
  ['Released', v => v.data.release_date],
  ['Deliveries from', v => v.data.delivery_start],
];
