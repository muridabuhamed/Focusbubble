package com.focusbubble.app;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DoNotDisturb")
public class DoNotDisturbPlugin extends Plugin {

    private NotificationManager notificationManager;
    private AudioManager audioManager;
    private int originalRingerMode;
    private boolean wasRingerModeSaved = false;

    @Override
    public void load() {
        notificationManager = (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
        audioManager = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
    }

    @PluginMethod
    public void checkDNDAccess(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            boolean hasAccess = notificationManager.isNotificationPolicyAccessGranted();
            JSObject ret = new JSObject();
            ret.put("hasAccess", hasAccess);
            call.resolve(ret);
        } else {
            // Older Android versions don't need special permission
            JSObject ret = new JSObject();
            ret.put("hasAccess", true);
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void requestDNDAccess(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (!notificationManager.isNotificationPolicyAccessGranted()) {
                Intent intent = new Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
            }
        }
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void enableDND(PluginCall call) {
        try {
            // Save current ringer mode
            if (!wasRingerModeSaved) {
                originalRingerMode = audioManager.getRingerMode();
                wasRingerModeSaved = true;
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                // Check if we have DND access
                if (notificationManager.isNotificationPolicyAccessGranted()) {
                    // Enable Do Not Disturb with priority interruptions only
                    NotificationManager.Policy policy = new NotificationManager.Policy(
                        NotificationManager.Policy.PRIORITY_CATEGORY_ALARMS, // Allow alarms
                        0, // No calls
                        NotificationManager.Policy.PRIORITY_SENDERS_NONE // No messages
                    );
                    notificationManager.setNotificationPolicy(policy);
                    notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_PRIORITY);
                } else {
                    // Fallback: Just set to silent mode
                    audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
                }
            } else {
                // For older Android versions, just use silent mode
                audioManager.setRingerMode(AudioManager.RINGER_MODE_SILENT);
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void disableDND(PluginCall call) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                if (notificationManager.isNotificationPolicyAccessGranted()) {
                    // Restore normal notification mode
                    notificationManager.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_ALL);
                }
            }
            
            // Restore original ringer mode
            if (wasRingerModeSaved) {
                audioManager.setRingerMode(originalRingerMode);
                wasRingerModeSaved = false;
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void getCurrentDNDStatus(PluginCall call) {
        try {
            boolean isDNDActive = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                int filter = notificationManager.getCurrentInterruptionFilter();
                isDNDActive = filter != NotificationManager.INTERRUPTION_FILTER_ALL;
            }
            
            JSObject ret = new JSObject();
            ret.put("isActive", isDNDActive);
            ret.put("ringerMode", audioManager.getRingerMode());
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }
}