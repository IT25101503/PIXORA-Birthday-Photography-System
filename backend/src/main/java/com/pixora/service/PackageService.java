package com.pixora.service;

import com.pixora.dto.PackageDto;
import com.pixora.entity.Package;
import com.pixora.exception.ResourceNotFoundException;
import com.pixora.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackageService {

    private final PackageRepository packageRepository;

    @Transactional(readOnly = true)
    public List<PackageDto> getAllPackages() {
        return packageRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PackageDto> getActivePackages() {
        return packageRepository.findByIsActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public PackageDto createPackage(PackageDto dto) {
        Package pkg = Package.builder()
                .packageName(dto.getPackageName())
                .priceLkr(dto.getPriceLkr())
                .description(dto.getDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return toDto(packageRepository.save(pkg));
    }

    @Transactional
    public PackageDto updatePackage(Long id, PackageDto dto) {
        Package pkg = findPackage(id);
        pkg.setPackageName(dto.getPackageName());
        pkg.setPriceLkr(dto.getPriceLkr());
        pkg.setDescription(dto.getDescription());
        if (dto.getIsActive() != null) pkg.setIsActive(dto.getIsActive());
        return toDto(packageRepository.save(pkg));
    }

    @Transactional
    public PackageDto toggleActive(Long id) {
        Package pkg = findPackage(id);
        pkg.setIsActive(!pkg.getIsActive());
        return toDto(packageRepository.save(pkg));
    }

    @Transactional
    public void deletePackage(Long id) {
        packageRepository.delete(findPackage(id));
    }

    private Package findPackage(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));
    }

    public PackageDto toDto(Package p) {
        return PackageDto.builder()
                .packageId(p.getPackageId())
                .packageName(p.getPackageName())
                .priceLkr(p.getPriceLkr())
                .description(p.getDescription())
                .isActive(p.getIsActive())
                .build();
    }
}
