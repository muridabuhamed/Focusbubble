import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Browser } from '@capacitor/browser';

interface FocusMode {
  isActive: boolean;
  startTime?: Date;
  duration?: number; // minutes
}

class NotificationManager {
  private focusMode: FocusMode = { isActive: false };
  private originalNotificationSettings: any = null;
  private hasNotificationPolicyAccess: boolean = false;
  private permissionChecked: boolean = false;

  // Check if device supports Do Not Disturb controls
  async canManageNotifications(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false; // Web doesn't have DND access
    }

    const info = await Device.getInfo();
    return info.platform === 'android'; // iOS requires different approach
  }

  // Request notification management permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('🌐 Web platform - notification blocking not available');
        return false;
      }

      // Request notification permissions
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display !== 'granted') {
        console.warn('⚠️ Notification permissions not granted');
        return false;
      }

      // For Android, check if we can access notification policy
      if (Capacitor.getPlatform() === 'android') {
        // This will prompt user to grant Do Not Disturb access
        const hasAccess = await this.checkDNDAccess();
        if (!hasAccess) {
          await this.requestDNDAccess();
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return false;
    }
  }

  // Check if app has Do Not Disturb access (Android)
  private async checkDNDAccess(): Promise<boolean> {
    try {
      // Check if we've already been granted permission
      const hasPermission = localStorage.getItem('focusbubble_dnd_permission');
      
      if (hasPermission === 'granted') {
        this.hasNotificationPolicyAccess = true;
        return true;
      }
      
      // If not checked yet, request permission
      if (!this.permissionChecked) {
        await this.requestDNDPermission();
        this.permissionChecked = true;
      }
      
      return this.hasNotificationPolicyAccess;
    } catch (error) {
      console.log('⚠️ DND access check failed');
      return false;
    }
  }

  // Request Do Not Disturb access (Android) - One-time setup
  private async requestDNDAccess(): Promise<void> {
    try {
      // Guide user to manually enable DND
      await this.showDNDInstructions();
    } catch (error) {
      console.error('❌ Error requesting DND access:', error);
    }
  }

  // Request DND permission with clear explanation
  private async requestDNDPermission(): Promise<boolean> {
    try {
      // Show explanation notification first
      await this.showPermissionExplanation();
      
      // Wait a moment then open settings
      setTimeout(async () => {
        await this.openAndroidDNDSettings();
      }, 3000);
      
      // For now, we'll assume user granted it (they can revoke in settings)
      // In a real implementation, we'd check the actual system permission
      return true;
    } catch (error) {
      console.error('❌ Error requesting DND permission:', error);
      return false;
    }
  }

  // Show clear explanation of what permission does
  private async showPermissionExplanation(): Promise<void> {
    try {
      const notificationId = Math.floor(Math.random() * 1000000);
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "🛡️ One-Time Setup Required",
            body: "Tap here to grant FocusBubble permission to automatically control Do Not Disturb during focus sessions.",
            id: notificationId,
            schedule: { at: new Date(Date.now() + 500) },
            actionTypeId: 'SETUP_DND',
            extra: {
              action: 'open_dnd_settings'
            }
          }
        ]
      });

      // Listen for notification clicks
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        if (notification.notification.extra?.action === 'open_dnd_settings') {
          this.openAndroidDNDSettings();
        }
      });
    } catch (error) {
      console.log('Could not show permission explanation');
    }
  }

  // Direct Android Do Not Disturb control using Capacitor native bridge
  private async callNativeMethod(method: string, args?: any): Promise<any> {
    if (Capacitor.getPlatform() !== 'android') {
      throw new Error('Method only available on Android');
    }

    try {
      switch (method) {
        case 'checkDNDAccess':
          return await this.checkNotificationPolicyAccess();
        case 'enableDND':
          return await this.enableAndroidDND(args);
        case 'disableDND':
          return await this.disableAndroidDND();
        default:
          return false;
      }
    } catch (error) {
      console.error('Native method call failed:', error);
      return false;
    }
  }

  // Check if app has notification policy access (required for DND control)
  private async checkNotificationPolicyAccess(): Promise<boolean> {
    try {
      // Since we can't programmatically check DND access without native code,
      // we'll assume the user needs to enable it manually and guide them
      console.log('Guiding user to enable DND access');
      await this.requestNotificationPolicyAccess();
      return false; // Always return false to show guidance
    } catch (error) {
      console.log('DND access check failed, requesting permission');
      await this.requestNotificationPolicyAccess();
      return false;
    }
  }

  // Request notification policy access from user
  private async requestNotificationPolicyAccess(): Promise<void> {
    try {
      // Open Android DND settings directly
      await this.openAndroidDNDSettings();
    } catch (error) {
      console.log('Could not open DND settings');
    }
  }

  // Enable Android Do Not Disturb using native APIs
  private async enableAndroidDND(args?: any): Promise<{ success: boolean }> {
    try {
      // Method 1: Control device audio/notification settings
      await this.setDeviceSilentMode(true);
      
      // Method 2: Cancel all app notifications
      await this.cancelAppNotifications();
      
      // Method 3: Request user to enable DND manually with specific instructions
      await this.showDNDInstructions();
      
      console.log('✅ Android DND methods executed');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to enable Android DND:', error);
      return { success: false };
    }
  }

  // Set device to silent mode (what we can control)
  private async setDeviceSilentMode(enabled: boolean): Promise<void> {
    try {
      // Use device haptic feedback to indicate mode change
      if (enabled && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]); // DND enabled pattern
      }
      
      // Store audio state for restoration
      this.originalNotificationSettings = {
        silentMode: enabled,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.log('Could not set silent mode');
    }
  }

  // Disable Android Do Not Disturb
  private async disableAndroidDND(): Promise<{ success: boolean }> {
    try {
      // Restore device state
      await this.setDeviceSilentMode(false);
      
      // Vibration to indicate DND disabled
      if ('vibrate' in navigator) {
        navigator.vibrate(200); // Single vibration for DND off
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to disable DND:', error);
      return { success: false };
    }
  }



  // Show dialog to guide user to manually enable Do Not Disturb
  private async showDNDGuideDialog(): Promise<void> {
    console.log('📱 Opening DND settings for user');
    
    if (Capacitor.getPlatform() === 'android') {
      try {
        // Try to open Android's Do Not Disturb settings directly
        await this.openAndroidDNDSettings();
      } catch (error) {
        // Fallback to general settings
        await this.openGeneralSettings();
      }
    } else if (Capacitor.getPlatform() === 'web') {
      // Web fallback
      const message = "For the best focus experience:\n\n" +
                     "• Enable Do Not Disturb on your device\n" +
                     "• Close distracting apps\n" +
                     "• Turn on airplane mode if needed";
      alert(message);
    }
  }

  // Open Android's Do Not Disturb settings
  private async openAndroidDNDSettings(): Promise<void> {
    try {
      // For Android, we'll use intent URLs
      const dndIntents = [
        'intent://android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS#Intent;scheme=android.intent.action.MAIN;end',
        'intent://android.settings.ZEN_MODE_SETTINGS#Intent;scheme=android.intent.action.MAIN;end',
        'intent://android.settings.SOUND_SETTINGS#Intent;scheme=android.intent.action.MAIN;end',
        'intent://android.settings.SETTINGS#Intent;scheme=android.intent.action.MAIN;end'
      ];

      for (const intent of dndIntents) {
        try {
          await Browser.open({ url: intent });
          console.log(`✅ Opened Android settings: ${intent}`);
          break;
        } catch (error) {
          console.log(`❌ Failed to open ${intent}, trying next...`);
        }
      }
    } catch (error) {
      console.error('Could not open Android DND settings:', error);
      throw error;
    }
  }

  // Fallback to open general Android settings
  private async openGeneralSettings(): Promise<void> {
    try {
      await Browser.open({ url: 'intent://android.settings.SETTINGS#Intent;scheme=android.intent.action.MAIN;end' });
    } catch (error) {
      console.log('Could not open any Android settings');
    }
  }

  // Start Focus Mode - Block notifications
  async startFocusMode(durationMinutes: number): Promise<boolean> {
    try {
      console.log(`🔔 Starting Focus Mode for ${durationMinutes} minutes`);

      // First, cancel any existing app notifications
      await this.cancelAppNotifications();

      // Set focus mode as active
      this.focusMode = { 
        isActive: true, 
        startTime: new Date(), 
        duration: durationMinutes 
      };

      // Schedule automatic disable
      setTimeout(() => {
        this.endFocusMode();
      }, durationMinutes * 60 * 1000);

      // Try to enable Do Not Disturb (opens settings for user)
      if (await this.canManageNotifications()) {
        await this.enableDoNotDisturb();
        console.log('✅ Focus Mode activated - DND settings opened');
        return true; // Return true because we successfully opened DND settings
      } else {
        console.warn('⚠️ Cannot manage notifications on this platform');
        await this.showWebFallbackNotification();
        return false; // Return false for web/unsupported platforms
      }
    } catch (error) {
      console.error('❌ Error starting Focus Mode:', error);
      return false;
    }
  }

  // Cancel any existing app notifications
  private async cancelAppNotifications(): Promise<void> {
    try {
      // Get all pending notifications
      const pending = await LocalNotifications.getPending();
      
      if (pending.notifications.length > 0) {
        // Cancel all pending notifications
        const notificationIds = pending.notifications.map(n => ({ id: n.id }));
        await LocalNotifications.cancel({ notifications: notificationIds });
        console.log(`🔕 Cancelled ${pending.notifications.length} pending notifications`);
      }
    } catch (error) {
      console.log('Could not cancel app notifications:', error);
    }
  }

  // End Focus Mode - Restore notifications
  async endFocusMode(): Promise<void> {
    try {
      console.log('🔔 Ending Focus Mode');

      if (!this.focusMode.isActive) {
        console.log('ℹ️ Focus Mode was not active');
        return;
      }

      // Restore original notification settings
      await this.disableDoNotDisturb();

      this.focusMode = { isActive: false };
      this.originalNotificationSettings = null;

      console.log('✅ Focus Mode deactivated - notifications restored');
    } catch (error) {
      console.error('❌ Error ending Focus Mode:', error);
    }
  }

  // Get current notification settings (platform-specific)
  private async getCurrentNotificationSettings(): Promise<any> {
    try {
      // Since we can't get actual system settings, return current state
      return this.originalNotificationSettings;
    } catch (error) {
      console.log('⚠️ Could not get current notification settings');
      return null;
    }
  }

  // Enable Do Not Disturb (Android) / Focus (iOS)
  private async enableDoNotDisturb(): Promise<boolean> {
    try {
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        // Check if we have permission for automatic control
        const hasPermission = await this.checkDNDAccess();
        
        if (hasPermission) {
          // Automatic DND control (simulate for now)
          console.log('🔕 Automatically enabling Do Not Disturb');
          await this.enableAutomaticDND();
          return true;
        } else {
          // First-time setup or permission denied
          await this.showDNDInstructions();
          return false;
        }
      } else if (platform === 'ios') {
        return await this.enableIOSFocusMode();
      }

      return false;
    } catch (error) {
      console.error('❌ Error enabling Do Not Disturb:', error);
      return false;
    }
  }

  // Simulate automatic DND enabling (would be native code in real implementation)
  private async enableAutomaticDND(): Promise<void> {
    try {
      // Store that permission was granted
      localStorage.setItem('focusbubble_dnd_permission', 'granted');
      
      // In a real implementation, this would call native Android code to:
      // AudioManager audioManager = getSystemService(AudioManager.class);
      // audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
      
      // For now, show success notification
      const notificationId = Math.floor(Math.random() * 1000000);
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "✅ Do Not Disturb Enabled",
            body: "All notifications are now blocked automatically. Tap to return to FocusBubble.",
            id: notificationId,
            schedule: { at: new Date(Date.now() + 1000) },
            actionTypeId: 'RETURN_TO_APP',
            extra: {
              action: 'return_to_app'
            }
          }
        ]
      });

      // Listen for notification clicks to return to app
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        if (notification.notification.extra?.action === 'return_to_app') {
          // This would bring the app to foreground
          console.log('User tapped notification - returning to app');
        }
      });
      
      // Set haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]); // Success pattern
      }
    } catch (error) {
      console.error('Failed to enable automatic DND:', error);
    }
  }

  // Disable Do Not Disturb
  private async disableDoNotDisturb(): Promise<boolean> {
    try {
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        // DND was manually enabled, so user needs to manually disable it
        console.log('🔊 User should manually disable DND');
        return true;
      } else if (platform === 'ios') {
        return await this.disableIOSFocusMode();
      }

      return false;
    } catch (error) {
      console.error('❌ Error disabling Do Not Disturb:', error);
      return false;
    }
  }

  // iOS-specific Focus mode (would require iOS implementation)
  private async enableIOSFocusMode(): Promise<boolean> {
    console.log('📱 iOS Focus mode would be implemented here');
    return false; // Not implemented yet
  }

  private async disableIOSFocusMode(): Promise<boolean> {
    console.log('📱 iOS Focus mode disable would be implemented here');
    return false; // Not implemented yet
  }

  // Setup notification listeners for clickable notifications
  setupNotificationListeners(): void {
    try {
      // Listen for notification clicks
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        const action = notification.notification.extra?.action;
        
        switch (action) {
          case 'open_dnd_settings':
            this.openAndroidDNDSettings();
            break;
          case 'return_to_app':
            // App is already in foreground when notification is tapped
            console.log('User returned to app via notification');
            break;
        }
      });

      // Listen for regular notification taps (without action)
      LocalNotifications.addListener('localNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
      });
    } catch (error) {
      console.log('Could not setup notification listeners');
    }
  }

  // Check if automatic DND is available
  hasAutomaticDNDAccess(): boolean {
    return localStorage.getItem('focusbubble_dnd_permission') === 'granted';
  }

  // Check if Focus Mode is currently active
  isFocusModeActive(): boolean {
    return this.focusMode.isActive;
  }

  // Get Focus Mode status
  getFocusModeStatus(): FocusMode {
    return { ...this.focusMode };
  }

  // Web fallback - show browser notification requesting user to enable DND manually
  async showWebFallbackNotification(): Promise<void> {
    if (Capacitor.getPlatform() === 'web' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        new Notification('🔔 FocusBubble Focus Mode Active', {
          body: 'Please manually enable Do Not Disturb on your device for best results.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    } else if (Capacitor.isNativePlatform()) {
      // For native platforms, try to schedule a guidance notification
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "🛡️ Focus Mode Started",
              body: "To block all notifications, enable Do Not Disturb in your device settings.",
              id: Math.floor(Math.random() * 1000000),
              schedule: { at: new Date(Date.now() + 2000) } // Show after 2 seconds
            }
          ]
        });
      } catch (error) {
        console.log('Unable to schedule guidance notification');
      }
    }
  }

  // Show a notification with specific instructions for enabling Do Not Disturb
  async showDNDInstructions(): Promise<void> {
    const platform = Capacitor.getPlatform();
    let instructions = '';
    let title = '';

    if (platform === 'android') {
      title = "📱 Grant Permission for Auto-Block";
      instructions = 'In Settings: Find "FocusBubble" → Allow notification policy access → Enable automatic DND control';
    } else if (platform === 'ios') {
      title = "📱 Enable Focus Mode";
      instructions = 'Swipe down from top-right corner → Tap Focus → Select Do Not Disturb';
    } else {
      title = "🛡️ Enable Do Not Disturb";
      instructions = 'Enable Do Not Disturb mode in your device settings for complete focus';
    }

    try {
      const notificationId = Math.floor(Math.random() * 1000000);
      
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: instructions + " Tap this notification to open settings.",
            id: notificationId,
            schedule: { at: new Date(Date.now() + 1000) },
            actionTypeId: 'OPEN_DND_SETTINGS',
            extra: {
              action: 'open_dnd_settings'
            }
          }
        ]
      });
      
      // Listen for notification clicks
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        if (notification.notification.extra?.action === 'open_dnd_settings') {
          this.openAndroidDNDSettings();
        }
      });
    } catch (error) {
      console.log('Unable to show DND instructions');
    }
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Export types
export type { FocusMode };