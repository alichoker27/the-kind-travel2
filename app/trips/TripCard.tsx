// TripCard.tsx - PREMIUM & ELEGANT
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaEdit, FaTrash, FaImages, FaTimes } from "react-icons/fa";
import styles from "@/styles/Trips/trips.module.css";

interface Trip {
  id: number;
  title: string;
  tourType: string;
  description: string | null;
  notes: string | null;
  images: string[];
}

interface TripCardProps {
  trip: Trip;
  isAdmin: boolean;
}

export default function TripCard({ trip, isAdmin }: TripCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete trip");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  const displayImage =
    trip.images.length > 0 ? trip.images[0] : "/placeholder-trip.jpg";

  const whatsappNumber = "905413416826";
  const whatsappMessage = encodeURIComponent(
    `Please more info about ${trip.title}...`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <div className={styles.tripCard}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <Image
            src={displayImage}
            alt={trip.title}
            fill
            className={styles.tripImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={styles.tourTypeBadge}>{trip.tourType}</div>

          {trip.images.length > 1 && (
            <button
              onClick={() => setShowGallery(true)}
              className={styles.showAllButton}
              title="View All Photos"
            >
              <FaImages /> Show All ({trip.images.length})
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className={styles.cardContent}>
          <h3 className={styles.tripTitle}>{trip.title}</h3>
          <p className={styles.tripDescription}>
            {trip.description || "No description available."}
          </p>

          {trip.notes && (
            <div className={styles.notesSection}>
              <p className={styles.notesLabel}>Notes</p>
              <p className={styles.notesText}>{trip.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionsContainer}>
            {isAdmin ? (
              <>
                <Link
                  href={`/trips/${trip.id}/edit`}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  <FaTrash /> {isDeleting ? "..." : "Delete"}
                </button>
              </>
            ) : (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionButton} ${styles.whatsappButton}`}
              >
                <FaWhatsapp size={18} /> Book via WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Glassy */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3 className={styles.modalTitle}>Delete Trip</h3>
            <p className={styles.modalMessage}>
              Are you sure you want to delete <strong>{trip.title}</strong>?
              This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`${styles.modalButton} ${styles.cancelButton}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className={`${styles.modalButton} ${styles.confirmDeleteButton}`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal - Glassy */}
      {showGallery && (
        <div className={styles.galleryOverlay}>
          <button
            onClick={() => setShowGallery(false)}
            className={styles.closeButton}
            aria-label="Close Gallery"
          >
            <FaTimes size={24} />
          </button>

          <div className={styles.galleryContainer}>
            <h2 className={styles.galleryHeader}>
              {trip.title} - Gallery ({trip.images.length})
            </h2>

            <div className={styles.galleryGrid}>
              {trip.images.map((img, idx) => (
                <div
                  key={idx}
                  className={styles.galleryImageWrapper}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className={styles.galleryImage}
                  />
                  <div className={styles.galleryImageOverlay} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Viewer - Premium */}
      {selectedImage && (
        <div
          className={styles.fullscreenOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className={styles.closeButton}
            style={{ top: "1rem", right: "1rem" }}
          >
            <FaTimes size={28} />
          </button>

          <div className={styles.fullscreenImageContainer}>
            <Image
              src={selectedImage}
              alt="Full View"
              fill
              className={styles.fullscreenImage}
              quality={90}
            />
          </div>
        </div>
      )}
    </>
  );
}
