"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/EditTrip/editTrip.module.css"; // REUSING SAME CSS
import {
  MdCloudUpload,
  MdDelete,
  MdAdd,
  MdAddCircleOutline,
  MdInfo,
  MdImage,
  MdPlace,
  MdArrowBack,
  MdSave,
} from "react-icons/md";

export default function CreateTripForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [tourType, setTourType] = useState("");
  const [includes, setIncludes] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Handlers (IDENTICAL - NO CHANGES)
  function handlePlaceAdd(e: React.KeyboardEvent | React.MouseEvent) {
    if (
      (e.type === "click" || (e as React.KeyboardEvent).key === "Enter") &&
      placeInput.trim()
    ) {
      e.preventDefault();
      if (!places.includes(placeInput.trim())) {
        setPlaces([...places, placeInput.trim()]);
      }
      setPlaceInput("");
    }
  }

  function handlePlaceRemove(placeToRemove: string) {
    setPlaces(places.filter((p) => p !== placeToRemove));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          setImages((prev) => [...prev, data.url]);
        } else {
          console.error("Upload failed for file:", files[i].name);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageRemove(indexToRemove: number) {
    setImages(images.filter((_, i) => i !== indexToRemove));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic Validation
    if (!title || title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (!tourType || tourType.length < 2) {
      setError("Tour Type must be at least 2 characters");
      return;
    }
    if (!includes || includes.length < 5) {
      setError("Includes must be at least 5 characters");
      return;
    }
    if (places.length === 0) {
      setError("At least one place is required");
      return;
    }
    if (images.length === 0) {
      setError("At least one image is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tourType,
          includes,
          notes: notes || undefined,
          description: description || undefined,
          places,
          images,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Trip created successfully!");
        // Reset Form
        setTitle("");
        setTourType("");
        setIncludes("");
        setNotes("");
        setDescription("");
        setPlaces([]);
        setImages([]);

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to create trip");
        if (data.errors) {
          console.log("Validation errors:", data.errors);
        }
      }
    } catch (_) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimated}>
        <div className={styles.bgGradient}></div>
        <div className={styles.floatingOrb1}></div>
        <div className={styles.floatingOrb2}></div>
      </div>

      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <Image
          src="/the-kind-travel-logo.jpg"
          alt="The Kind Travel"
          width={180}
          height={120}
          className={styles.navLogo}
          priority
        />
      </nav>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <MdAddCircleOutline className={styles.headerIcon} />
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>Create New Trip</h1>
              <p className={styles.subtitle}>
                Add a new luxury destination to your catalog
              </p>
            </div>
            <MdInfo className={styles.headerIcon} />
          </div>
        </header>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Info Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <MdInfo className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Basic Information</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Trip Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. Majestic Japan Adventure"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tour Type *</label>
                  <input
                    type="text"
                    value={tourType}
                    onChange={(e) => setTourType(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. Adventure, Luxury, Cultural"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>What is Included *</label>
                <textarea
                  value={includes}
                  onChange={(e) => setIncludes(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="e.g. Flights, Hotels, Meals, Tour Guide..."
                  required
                />
              </div>

              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Tell travelers about this amazing trip..."
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Any special requirements or information..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Places Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <MdPlace className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Places to Visit *</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.placeInputWrapper}>
                <input
                  type="text"
                  value={placeInput}
                  onChange={(e) => setPlaceInput(e.target.value)}
                  onKeyDown={handlePlaceAdd}
                  className={styles.input}
                  placeholder="Enter a place name and press Enter"
                />
                <button
                  type="button"
                  onClick={handlePlaceAdd}
                  className={styles.addButton}
                >
                  <MdAdd style={{ fontSize: "1.25rem" }} />
                  Add Place
                </button>
              </div>
              <div className={styles.placesContainer}>
                {places.length === 0 ? (
                  <p className={styles.emptyText}>No places added yet</p>
                ) : (
                  places.map((place, index) => (
                    <span key={index} className={styles.placeTag}>
                      {place}
                      <button
                        type="button"
                        onClick={() => handlePlaceRemove(place)}
                        className={styles.removeButton}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <MdImage className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Trip Images *</h2>
            </div>
            <div className={styles.sectionContent}>
              <div
                className={`${styles.uploadArea} ${uploading ? styles.uploading : ""}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <MdCloudUpload className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {uploading
                    ? "Uploading..."
                    : "Click to upload images (multiple allowed)"}
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.fileInput}
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className={styles.imagesGrid}>
                  {images.map((img, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <Image
                        src={img}
                        alt={`Trip image ${index + 1}`}
                        fill
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className={styles.deleteButton}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {error && <div className={styles.errorMessage}>{error}</div>}
          {message && <div className={styles.successMessage}>{message}</div>}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Link href="/dashboard" className={styles.cancelButton}>
              <MdArrowBack className={styles.buttonIcon} />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              disabled={loading || uploading}
              className={styles.submitButton}
            >
              <MdSave className={styles.buttonIcon} />
              <span>{loading ? "Creating Trip..." : "Create Trip"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
