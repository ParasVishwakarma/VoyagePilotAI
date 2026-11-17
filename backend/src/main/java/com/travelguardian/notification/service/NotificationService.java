package com.travelguardian.notification.service;

import com.travelguardian.notification.dto.NotificationItem;

import java.util.List;

public interface NotificationService {

    List<NotificationItem> getNotifications();

    void markAllAsRead();
}
