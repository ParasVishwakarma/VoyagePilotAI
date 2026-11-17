package com.travelguardian.hotel.service;

import com.travelguardian.hotel.dto.CreateHotelRequest;
import com.travelguardian.hotel.dto.HotelResponse;
import com.travelguardian.hotel.dto.UpdateHotelRequest;

import java.util.List;

public interface HotelService {

    HotelResponse createHotel(Long tripId, CreateHotelRequest request);

    List<HotelResponse> getTripHotels(Long tripId);

    List<HotelResponse> getAllMyHotels();

    HotelResponse getHotel(Long id);

    HotelResponse updateHotel(Long id, UpdateHotelRequest request);

    void deleteHotel(Long id);
}
