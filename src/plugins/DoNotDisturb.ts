import { registerPlugin } from '@capacitor/core';

export interface DoNotDisturbPlugin {
  checkDNDAccess(): Promise<{ hasAccess: boolean }>;
  requestDNDAccess(): Promise<{ success: boolean }>;
  enableDND(): Promise<{ success: boolean; error?: string }>;
  disableDND(): Promise<{ success: boolean; error?: string }>;
  getCurrentDNDStatus(): Promise<{ 
    isActive: boolean; 
    ringerMode: number; 
    success?: boolean; 
    error?: string 
  }>;
}

const DoNotDisturb = registerPlugin<DoNotDisturbPlugin>('DoNotDisturb');

export default DoNotDisturb;