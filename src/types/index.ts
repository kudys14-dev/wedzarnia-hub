export interface Device {
  id: string;
  device_id: string;
  name: string;
  description?: string;
  firmware_version?: string;
  last_seen_at?: string;
  is_online: boolean;
  created_at: string;
}

export interface SmokerReading {
  id: string;
  device_id: string;
  t_chamber1: number;
  t_chamber2: number;
  t_chamber: number;
  t_meat: number;
  t_set: number;
  process_state: string;
  current_step: number;
  step_count: number;
  step_name: string;
  step_time_remaining: number;
  total_time_elapsed: number;
  power_mode: number;
  fan_mode: number;
  smoke_pwm: number;
  door_open: boolean;
  heater1: boolean;
  heater2: boolean;
  heater3: boolean;
  fan_on: boolean;
  pid_output: number;
  wifi_rssi: number;
  firmware_version: string;
  uptime: number;
  created_at: string;
}

export interface SmokerCommand {
  id: string;
  device_id: string;
  cmd: string;
  value?: number;
  extra?: Record<string, unknown>;
  created_at: string;
  executed_at?: string;
}

export interface ProfileStep {
  name: string;
  tSet: number;
  tMeatTarget: number;
  minTimeMs: number;
  powerMode: number;
  smokePwm: number;
  fanMode: number;
  fanOnTime: number;
  fanOffTime: number;
  useMeatTemp: boolean;
}

export interface SmokerProfile {
  id: string;
  name: string;
  description?: string;
  steps: ProfileStep[];
  created_at: string;
  updated_at: string;
}

export interface SmokerAlert {
  id: string;
  device_id: string;
  alert_type: string;
  message?: string;
  resolved_at?: string;
  created_at: string;
}
