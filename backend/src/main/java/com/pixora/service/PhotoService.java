package com.pixora.service;

import com.pixora.dto.PhotoResponse;
import com.pixora.entity.Booking;
import com.pixora.entity.Photo;
import com.pixora.entity.User;
import com.pixora.exception.ResourceNotFoundException;
import com.pixora.repository.BookingRepository;
import com.pixora.repository.PhotoRepository;
import com.pixora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${server.port:8089}")
    private String serverPort;

    @Transactional
    public PhotoResponse uploadPhoto(Long bookingId, Long photographerId, MultipartFile file) throws IOException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        User photographer = userRepository.findById(photographerId)
                .orElseThrow(() -> new ResourceNotFoundException("Photographer not found"));

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        String photoUrl = "http://localhost:" + serverPort + "/uploads/" + filename;

        Photo photo = Photo.builder()
                .booking(booking)
                .photographer(photographer)
                .photoUrl(photoUrl)
                .isPublishedPortfolio(false)
                .build();

        return toResponse(photoRepository.save(photo));
    }

    @Transactional
    public PhotoResponse togglePublishPortfolio(Long photoId) {
        Photo photo = findPhoto(photoId);
        photo.setIsPublishedPortfolio(!photo.getIsPublishedPortfolio());
        return toResponse(photoRepository.save(photo));
    }

    @Transactional(readOnly = true)
    public List<PhotoResponse> getPhotosByBooking(Long bookingId) {
        return photoRepository.findByBookingBookingId(bookingId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoResponse> getPortfolioPhotos() {
        return photoRepository.findByIsPublishedPortfolioTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoResponse> getAllPhotos() {
        return photoRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        Photo photo = findPhoto(photoId);
        try {
            String url = photo.getPhotoUrl();
            String filename = url.substring(url.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (Exception ignored) {}
        photoRepository.delete(photo);
    }

    @Transactional
    public PhotoResponse toggleFavorite(Long photoId, Long clientId) {
        Photo photo = findPhoto(photoId);
        if (!photo.getBooking().getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("Unauthorized to favorite photos from other clients' events");
        }
        photo.setIsFavorite(photo.getIsFavorite() == null ? true : !photo.getIsFavorite());
        return toResponse(photoRepository.save(photo));
    }

    private Photo findPhoto(Long id) {
        return photoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found with id: " + id));
    }

    public PhotoResponse toResponse(Photo p) {
        String normalizedUrl = p.getPhotoUrl();
        if (normalizedUrl != null && normalizedUrl.contains(":8080/")) {
            normalizedUrl = normalizedUrl.replace(":8080/", ":" + serverPort + "/");
        }
        return PhotoResponse.builder()
                .photoId(p.getPhotoId())
                .bookingId(p.getBooking().getBookingId())
                .photographerId(p.getPhotographer().getUserId())
                .photographerName(p.getPhotographer().getFullName())
                .photoUrl(normalizedUrl)
                .isPublishedPortfolio(p.getIsPublishedPortfolio())
                .isFavorite(p.getIsFavorite() != null && p.getIsFavorite())
                .build();
    }
}