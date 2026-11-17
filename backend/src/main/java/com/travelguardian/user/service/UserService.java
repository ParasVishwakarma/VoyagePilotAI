package com.travelguardian.user.service;

import com.travelguardian.user.dto.ChangePasswordRequest;
import com.travelguardian.user.dto.UpdateProfileRequest;
import com.travelguardian.user.dto.UserProfileResponse;

public interface UserService {

    UserProfileResponse getCurrentUser();

    UserProfileResponse updateProfile(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);

    void deleteCurrentUser();
}
