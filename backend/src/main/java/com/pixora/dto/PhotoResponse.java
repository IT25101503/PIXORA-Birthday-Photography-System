package com.pixora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoResponse {
    private Long photoId;
    private Long bookingId;
    private Long photographerId;
    private String photographerName;
    private String photoUrl;
    private Boolean isPublishedPortfolio;
    private Boolean isFavorite;
}
